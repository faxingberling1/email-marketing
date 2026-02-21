// POST /api/admin/workspaces/[id]/reactivate
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/db"

export const POST = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[4]
    const workspace = await (prisma as any).workspace.findUnique({ where: { id } })
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })

    const updated = await (prisma as any).workspace.update({
        where: { id },
        data: {
            subscription_status: "active",
            health_status: "HEALTHY"
        } as any,
        select: { id: true, name: true, subscription_status: true, health_status: true } as any
    })

    await createAuditLog({
        actorId: adminUser.id,
        action_type: "WORKSPACE_REACTIVATED",
        target_type: "workspace",
        target_id: id,
        metadata: { workspaceName: (workspace as any).name },
    })

    return NextResponse.json({ workspace: updated })
})
