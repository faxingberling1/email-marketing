// GET /api/admin/audit-logs — paginated audit log viewer
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"

export const GET = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const { searchParams } = req.nextUrl
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"))
    const action = searchParams.get("action") ?? undefined
    const targetType = searchParams.get("target_type") ?? undefined

    const where = {
        ...(action ? { action_type: action } : {}),
        ...(targetType ? { target_type: targetType } : {}),
    }

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { created_at: "desc" },
            include: {
                actor: { select: { id: true, name: true, email: true } },
            },
        }),
        prisma.auditLog.count({ where }),
    ])

    return NextResponse.json({ logs, total, page, limit })
})
