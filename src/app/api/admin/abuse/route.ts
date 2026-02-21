import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { prisma } from "@/lib/db"

export const GET = withAdminGuard(async (req: NextRequest) => {
    // ── Risk Scoring Logic via Raw SQL ──
    const workspaces = await prisma.$queryRaw<any[]>`
        SELECT id, name, health_status, total_ai_used, total_emails_sent, subscription_status
        FROM "Workspace"
        WHERE deleted_at IS NULL
        ORDER BY total_ai_used DESC
        LIMIT 20
    `

    const flaggedWorkspaces = workspaces.map(ws => {
        let riskScore = 0
        const reasons: string[] = []

        // Metric-based risk rules
        if (Number(ws.total_ai_used || 0) > 5000) {
            riskScore += 40
            reasons.push("High AI Velocity")
        }
        if (ws.subscription_status === "unpaid" || ws.subscription_status === "past_due") {
            riskScore += 25
            reasons.push("Billing Anomaly")
        }
        if (Number(ws.total_emails_sent || 0) > 1000) {
            riskScore += 15
            reasons.push("Volume Spike")
        }

        return {
            ...ws,
            riskScore: Math.min(riskScore, 100),
            reasons,
            bounceRate: (Math.random() * 8 + 2).toFixed(1) + "%", // Mocked
        }
    }).filter(ws => ws.riskScore > 0).sort((a, b) => b.riskScore - a.riskScore)

    return NextResponse.json({
        highRiskCount: flaggedWorkspaces.filter(w => w.riskScore > 60).length,
        flaggedWorkspaces
    })
})
