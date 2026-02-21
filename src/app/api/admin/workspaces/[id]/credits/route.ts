// POST /api/admin/workspaces/[id]/credits
// Body: { credits: number }
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/db"

export const POST = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[5]
    const body = await req.json()
    const credits = parseInt(body.credits)
    if (!credits || credits < 1 || credits > 1_000_000) {
        return NextResponse.json({ error: "Invalid credits value (1–1,000,000)" }, { status: 400 })
    }

    const workspace = await prisma.workspace.findUnique({ where: { id } })
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })

    const updated = await prisma.workspace.update({
        where: { id },
        data: { ai_credits_remaining: { increment: credits } },
    })

    await createAuditLog({
        actorId: adminUser.id,
        action_type: "WORKSPACE_CREDITS_ADDED",
        target_type: "workspace",
        target_id: id,
        metadata: { creditsAdded: credits, newTotal: updated.ai_credits_remaining, workspaceName: workspace.name },
    })

    return NextResponse.json({ workspace: updated })
})
