// DELETE /api/admin/workspaces/[id] — soft delete
// Sets deleted_at = NOW(). Does NOT delete rows.
// Safety: requires confirmation token for active paid workspaces.
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/db"

export const DELETE = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[5]

    // $queryRaw to read fields not in old Prisma client types
    const rows = await prisma.$queryRaw<{
        id: string; name: string; subscription_plan: string
        subscription_status: string; deleted_at: Date | null
    }[]>`
        SELECT id, name, subscription_plan, subscription_status, deleted_at
        FROM "Workspace" WHERE id = ${id} LIMIT 1
    `
    const workspace = rows[0]
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })

    if (workspace.deleted_at) {
        return NextResponse.json({ error: "Workspace is already deleted" }, { status: 409 })
    }

    // Safety check: active paid workspace requires confirmation header
    const isPaidActive = workspace.subscription_status === "active"
        && workspace.subscription_plan !== "free"

    if (isPaidActive) {
        const confirmed = req.headers.get("x-confirm-delete")
        if (confirmed !== "CONFIRM") {
            return NextResponse.json({
                error: "This workspace has an active paid subscription. Pass header X-Confirm-Delete: CONFIRM to proceed.",
                requiresConfirmation: true,
                workspaceName: workspace.name,
                plan: workspace.subscription_plan,
                status: workspace.subscription_status,
            }, { status: 422 })
        }
    }

    // Soft delete
    await prisma.$executeRaw`
        UPDATE "Workspace" SET deleted_at = NOW(), updated_at = NOW()
        WHERE id = ${id}
    `

    await createAuditLog({
        actorId: adminUser.id,
        action_type: "WORKSPACE_DELETED",
        target_type: "workspace",
        target_id: id,
        metadata: {
            workspaceName: workspace.name,
            plan: workspace.subscription_plan,
            status: workspace.subscription_status,
            wasPaidActive: isPaidActive,
        },
    })

    return NextResponse.json({ ok: true, deletedAt: new Date().toISOString() })
})
