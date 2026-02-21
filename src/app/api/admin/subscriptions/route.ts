import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { prisma } from "@/lib/db"

export const GET = withAdminGuard(async (req: NextRequest) => {
    // ── Metric Aggregation ──
    // In a real app, this would query Stripe or a specialized billing table.
    // Here we derive it from the Workspace subscription fields for demonstration.

    const counts = await prisma.$queryRaw<any[]>`
        SELECT 
            subscription_plan, 
            subscription_status,
            COUNT(*) as count,
            SUM(CASE 
                WHEN subscription_plan = 'starter' THEN 29
                WHEN subscription_plan = 'pro' THEN 99
                WHEN subscription_plan = 'enterprise' THEN 499
                ELSE 0 
            END) as mrr
        FROM "Workspace"
        WHERE deleted_at IS NULL
        GROUP BY subscription_plan, subscription_status
    `

    let totalMrr = 0
    let activeSubs = 0
    let trialSubs = 0
    let failedPayments = 0

    counts.forEach(c => {
        const mrr = Number(c.mrr || 0)
        const count = Number(c.count || 0)

        if (c.subscription_status === 'active') {
            totalMrr += mrr
            activeSubs += count
        } else if (c.subscription_status === 'trialing') {
            trialSubs += count
        } else if (['unpaid', 'past_due'].includes(c.subscription_status)) {
            failedPayments += count
        }
    })

    const arr = totalMrr * 12
    const churnRate = 2.4 // Mocked for UI demonstration

    // ── Top Subscriptions ──
    const recentSubs = await prisma.$queryRaw<any[]>`
        SELECT id, name, subscription_plan, subscription_status, "createdAt"
        FROM "Workspace"
        WHERE deleted_at IS NULL AND subscription_plan != 'free'
        ORDER BY "createdAt" DESC
        LIMIT 10
    `

    return NextResponse.json({
        metrics: {
            mrr: totalMrr,
            arr,
            activeSubs,
            trialSubs,
            failedPayments,
            churnRate
        },
        recentSubs
    })
})

