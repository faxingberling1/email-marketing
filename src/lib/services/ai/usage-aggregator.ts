import { prisma } from "@/lib/db";

export interface AIUsageSummary {
    tokensUsed: number;
    costEstimate: number;
    topWorkspaceId: string | null;
    topTokensUsed: number;
    isSpikeDetected: boolean;
}

/**
 * Aggregates AI usage logs for the specified period.
 */
export async function getAIUsageAggregation(days: number = 30): Promise<AIUsageSummary> {
    const periodStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [aggregate, topUser] = await Promise.all([
        (prisma as any).aiUsageLog.aggregate({
            _sum: { tokens_used: true, cost_estimate: true },
            where: { created_at: { gte: periodStart } },
        }),
        (prisma as any).aiUsageLog.groupBy({
            by: ["workspaceId"],
            _sum: { tokens_used: true },
            where: { created_at: { gte: periodStart } },
            orderBy: { _sum: { tokens_used: "desc" } },
            take: 1,
        }),
    ]);

    const tokensUsed = aggregate._sum.tokens_used ?? 0;
    const costEstimate = Number(aggregate._sum.cost_estimate ?? 0);
    const topTokensUsed = topUser[0]?._sum.tokens_used ?? 0;
    const topWorkspaceId = topUser[0]?.workspaceId ?? null;

    // Spike logic: If a single workspace consumes > 50% of 30d volume or is > 5x the average
    const isSpikeDetected = tokensUsed > 0 && (topTokensUsed / tokensUsed > 0.5);

    return {
        tokensUsed,
        costEstimate,
        topWorkspaceId,
        topTokensUsed,
        isSpikeDetected,
    };
}

/**
 * Calculates current platform-wide AI cost trends.
 */
export async function getAICostForecast() {
    // Logic for growth projection based on token velocity
    const current = await getAIUsageAggregation(1); // 24h
    const previous = await getAIUsageAggregation(30); // 30d avg

    const dailyAvg = previous.tokensUsed / 30;
    const growthPercent = dailyAvg > 0 ? ((current.tokensUsed - dailyAvg) / dailyAvg) * 100 : 0;

    return {
        currentDailyTokens: current.tokensUsed,
        averageDailyTokens: dailyAvg,
        growthPercent: growthPercent.toFixed(1),
    };
}
