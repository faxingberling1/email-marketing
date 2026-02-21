// GET /api/admin/ai-usage — top workspaces by token consumption
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"

export const GET = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const { searchParams } = req.nextUrl
    const days = Math.min(90, parseInt(searchParams.get("days") ?? "30"))
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const [totals, topWorkspaces, recentLogs] = await Promise.all([
        prisma.aiUsageLog.aggregate({
            _sum: { tokens_used: true, cost_estimate: true },
            where: { created_at: { gte: since } },
        }),
        prisma.aiUsageLog.groupBy({
            by: ["workspaceId"],
            _sum: { tokens_used: true, cost_estimate: true },
            where: { created_at: { gte: since } },
            orderBy: { _sum: { tokens_used: "desc" } },
            take: 10,
        }),
        prisma.aiUsageLog.findMany({
            where: { created_at: { gte: since } },
            orderBy: { created_at: "desc" },
            take: 50,
            include: { workspace: { select: { name: true } } },
        }),
    ])

    // Hydrate workspace names for the grouped results
    const workspaceIds = topWorkspaces.map(r => r.workspaceId)
    const workspaces = await prisma.workspace.findMany({
        where: { id: { in: workspaceIds } },
        select: { id: true, name: true },
    })
    const wsMap = Object.fromEntries(workspaces.map(w => [w.id, w.name]))

    const top = topWorkspaces.map(r => ({
        workspaceId: r.workspaceId,
        workspaceName: wsMap[r.workspaceId] ?? "Unknown",
        tokens_used: r._sum.tokens_used ?? 0,
        cost_estimate: r._sum.cost_estimate ?? 0,
    }))

    return NextResponse.json({
        period_days: days,
        total_tokens: totals._sum.tokens_used ?? 0,
        total_cost: totals._sum.cost_estimate ?? 0,
        top_workspaces: top,
        recent_logs: recentLogs,
    })
})
