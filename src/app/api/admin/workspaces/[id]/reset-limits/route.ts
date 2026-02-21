// POST /api/admin/workspaces/[id]/reset-limits
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/db"

export const POST = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[5]
    const workspace = await prisma.workspace.findUnique({ where: { id } })
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })

    const updated = await prisma.workspace.update({
        where: { id },
        data: {
            ai_credits_remaining: 100,
            email_limit_remaining: 500,
        },
    })

    await createAuditLog({
        actorId: adminUser.id,
        action_type: "WORKSPACE_LIMITS_RESET",
        target_type: "workspace",
        target_id: id,
        metadata: { workspaceName: workspace.name },
    })

    return NextResponse.json({ workspace: updated })
})
