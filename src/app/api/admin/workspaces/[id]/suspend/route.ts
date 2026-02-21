// Workspace action routes: suspend, reactivate, credits, reset-limits, health
// POST /api/admin/workspaces/[id]/suspend
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/db"
import { WorkspaceHealthStatus } from "@prisma/client"

export const POST = withAdminGuard(async (
    req: NextRequest,
    adminUser,
) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[5]
    const workspace = await prisma.workspace.findUnique({ where: { id } })
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })

    const updated = await prisma.workspace.update({
        where: { id },
        data: { health_status: WorkspaceHealthStatus.suspended },
    })

    await createAuditLog({
        actorId: adminUser.id,
        action_type: "WORKSPACE_SUSPENDED",
        target_type: "workspace",
        target_id: id,
        metadata: { previousHealth: workspace.health_status, workspaceName: workspace.name },
    })

    return NextResponse.json({ workspace: updated })
})
