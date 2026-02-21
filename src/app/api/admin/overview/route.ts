// GET /api/admin/overview — executive-level platform health metrics
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"

export const GET = withAdminGuard(async (_req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [
        totalUsers,
        totalWorkspaces,
        superAdminCount,
        suspendedUsers,
        // Workspace health breakdown
        healthyCount,
        warningCount,
        restrictedCount,
        suspendedWsCount,
        // Subscriptions
        activeSubCount,
        trialSubCount,
        // AI usage (30d)
        aiStats30d,
        aiAllTime,
        // Email (workspace totals — all time; 30d needs AiUsageLog proxy)
        emailStats,
        // Recent audit logs for context
        recentRiskyActions,
        // Top AI consumers (30d) for spike detection
        topAiConsumers,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.workspace.count(),
        prisma.user.count({ where: { global_role: "super_admin" as any } }),
        prisma.user.count({ where: { is_suspended: true } }),
        // Health breakdown
        prisma.workspace.count({ where: { health_status: "healthy" as any } }),
        prisma.workspace.count({ where: { health_status: "warning" as any } }),
        prisma.workspace.count({ where: { health_status: "restricted" as any } }),
        prisma.workspace.count({ where: { health_status: "suspended" as any } }),
        // Subscriptions
        prisma.workspace.count({ where: { subscription_status: "active" as any } }),
        prisma.workspace.count({ where: { subscription_status: "trialing" as any } }),
        // AI 30d
        prisma.aiUsageLog.aggregate({
            _sum: { tokens_used: true, cost_estimate: true },
            where: { created_at: { gte: since30d } },
        }),
        // AI all time
        prisma.aiUsageLog.aggregate({
            _sum: { tokens_used: true, cost_estimate: true },
        }),
        // Email all time from workspace aggregates
        prisma.workspace.aggregate({ _sum: { total_emails_sent: true } }),
        // Risky audit actions in last 24h
        prisma.auditLog.count({
            where: {
                created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                action_type: { in: ["WORKSPACE_SUSPENDED", "USER_SUSPENDED", "USER_PROMOTED", "IMPERSONATION_STARTED"] },
            },
        }),
        // Top AI consumers 30d — for spike detection
        prisma.aiUsageLog.groupBy({
            by: ["workspaceId"],
            _sum: { tokens_used: true },
            where: { created_at: { gte: since30d } },
            orderBy: { _sum: { tokens_used: "desc" } },
            take: 5,
        }),
    ])

    // Detect AI spike: any single workspace using >50% of total tokens
    const totalTokens30d = aiStats30d._sum.tokens_used ?? 0
    const topConsumerTokens = topAiConsumers[0]?._sum.tokens_used ?? 0
    const aiSpikeDetected = totalTokens30d > 0 && topConsumerTokens / totalTokens30d > 0.5

    // Payment failure proxy: workspaces with status "past_due" or "canceled" (if present)
    const paymentIssueCount = await prisma.workspace.count({
        where: { subscription_status: { in: ["past_due", "canceled"] as any } },
    })

    return NextResponse.json({
        // Core
        totalUsers,
        totalWorkspaces,
        superAdminCount,
        suspendedUsers,
        // Subscriptions
        activeSubCount,
        trialSubCount,
        suspendedWsCount,
        paymentIssueCount,
        // AI 30d
        aiTokens30d: totalTokens30d,
        aiCost30d: aiStats30d._sum.cost_estimate ?? 0,
        aiTokensAllTime: aiAllTime._sum.tokens_used ?? 0,
        aiCostAllTime: aiAllTime._sum.cost_estimate ?? 0,
        // Emails
        totalEmailsSent: emailStats._sum.total_emails_sent ?? 0,
        // Health breakdown
        health: { healthy: healthyCount, warning: warningCount, restricted: restrictedCount, suspended: suspendedWsCount },
        // Risk signals
        risk: {
            warningWorkspaces: warningCount,
            restrictedWorkspaces: restrictedCount,
            suspendedWorkspaces: suspendedWsCount,
            paymentIssues: paymentIssueCount,
            aiSpikeDetected,
            recentRiskyActions,
        },
    })
})
