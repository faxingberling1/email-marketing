import { prisma } from "@/lib/db";

export interface RiskProfile {
    warningCount: number;
    restrictedCount: number;
    suspendedCount: number;
    spikeDetected: boolean;
    recentRiskyAdminActions: number;
}

/**
 * Calculates a unified risk profile for the platform.
 */
export async function getPlatformRiskProfile(): Promise<RiskProfile> {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [healthStatus, spikeCheck, riskyActions] = await Promise.all([
        prisma.workspace.groupBy({
            by: ["health_status"],
            _count: { _all: true },
        }),
        // AI usage spike check (internal call for reusability)
        (prisma as any).aiUsageLog.aggregate({
            _sum: { tokens_used: true } as any, // Added 'as any' for divergent types
            where: { created_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        }) as any, // Added 'as any' for divergent types
        (prisma as any).auditLog.count({
            where: {
                created_at: { gte: since24h },
                action_type: { in: ["WORKSPACE_SUSPENDED", "USER_SUSPENDED", "IMPERSONATION_STARTED"] }
            }
        })
    ]);

    const stats = healthStatus.reduce((acc: any, curr: any) => {
        acc[curr.health_status] = curr._count?._all || 0;
        return acc;
    }, {});

    return {
        warningCount: stats['warning'] || 0,
        restrictedCount: stats['restricted'] || 0,
        suspendedCount: stats['suspended'] || 0,
        spikeDetected: false, // Could be linked to AI usage spike detector later
        recentRiskyAdminActions: riskyActions,
    };
}

/**
 * Calculates a risk score (0-100) for a specific workspace.
 * Used for automated abuse detection.
 */
export async function calculateWorkspaceRiskScore(workspaceId: string): Promise<number> {
    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: {
            _count: {
                select: {
                    aiUsageLogs: true // Corrected 'aiUsage' to 'aiUsageLogs'
                }
            } as any // Added 'as any' for divergent types
        }
    });

    if (!workspace) return 0;

    let score = 0;

    // 1. Bounce Logic (Higher impact)
    const totalEmails = (workspace as any).total_emails_sent || 1;
    const aiLogCount = (workspace as any)._count?.aiUsageLogs || 0;

    // For now, if we don't have bounce email counts, we use a placeholder or check email status
    const bounceRate = 0; // Placeholder for now or implement email status check
    if (bounceRate > 10) score += 40;
    else if (bounceRate > 5) score += 20;

    // 2. AI Usage Logic (Volume impact)
    if (aiLogCount > 100) score += 30; // High frequency

    // 3. Health status impact
    if ((workspace as any).health_status === 'warning') score += 10;
    if ((workspace as any).health_status === 'restricted') score += 50;

    return Math.min(100, score);
}
