// PATCH /api/admin/workspaces/[id]/change-plan
// Body: { plan: "free" | "starter" | "pro" | "enterprise", status?: SubscriptionStatus }
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/db"

const VALID_PLANS = ["free", "starter", "pro", "enterprise"]
const VALID_STATUSES = ["active", "trialing", "past_due", "canceled", "unpaid"]

export const PATCH = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[4]
    const body = await req.json()
    const { plan, status } = body

    if (plan && !VALID_PLANS.includes(plan)) {
        return NextResponse.json({ error: `Invalid plan. Must be one of: ${VALID_PLANS.join(", ")}` }, { status: 400 })
    }
    if (status && !VALID_STATUSES.includes(status)) {
        return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 })
    }
    if (!plan && !status) {
        return NextResponse.json({ error: "Provide at least one of: plan, status" }, { status: 400 })
    }

    const workspace = await prisma.workspace.findUnique({ where: { id } })
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })

    // Safety: don't silently downgrade an active paid workspace without logging
    const wasPaid = ["active"].includes((workspace as any).subscription_status)
        && (workspace as any).subscription_plan !== "free"

    const updateData: Record<string, unknown> = {}
    if (plan) updateData.subscription_plan = plan
    if (status) updateData.subscription_status = status

    const updated = await prisma.workspace.update({
        where: { id },
        data: updateData as any,
    })

    await createAuditLog({
        actorId: adminUser.id,
        action_type: "WORKSPACE_PLAN_CHANGED",
        target_type: "workspace",
        target_id: id,
        metadata: {
            workspaceName: (workspace as any).name,
            previousPlan: (workspace as any).subscription_plan,
            previousStatus: (workspace as any).subscription_status,
            newPlan: plan ?? (workspace as any).subscription_plan,
            newStatus: status ?? (workspace as any).subscription_status,
            wasPaidActive: wasPaid,
        },
    })

    return NextResponse.json({ workspace: updated })
})
