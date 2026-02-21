import { prisma } from "@/lib/db";

export interface BillingSummary {
    activeSubscribers: number;
    trialingSubscribers: number;
    paymentIssues: number;
    estimatedMRR: number;
    planDistribution: Record<string, number>;
}

/**
 * Aggregates subscription and billing data for the executive overview.
 */
export async function getBillingMetrics(): Promise<BillingSummary> {
    const [subscribers, planGroups] = await Promise.all([
        prisma.workspace.findMany({
            select: {
                subscription_status: true,
                subscription_plan: true,
            } as any,
        }),
        prisma.workspace.groupBy({
            by: ["subscription_plan"] as any,
            _count: { _all: true },
            where: { subscription_status: "active" as any },
        } as any)
    ]);

    const active = subscribers.filter((s: any) => s.subscription_status === 'active').length;
    const trialing = subscribers.filter((s: any) => s.subscription_status === 'trialing').length;
    const issues = subscribers.filter((s: any) => ['past_due', 'canceled', 'unpaid'].includes(s.subscription_status as string)).length;

    // Simple MRR Estimation (Business logic)
    const pricing: Record<string, number> = {
        'PRO': 49,
        'ENTERPRISE': 249,
        'STARTER': 19,
        'FREE': 0
    };

    let estimatedMRR = 0;
    const planDistribution: Record<string, number> = {};

    subscribers.forEach((s: any) => {
        if (s.subscription_status === 'active') {
            const plan = (s.subscription_plan || 'FREE').toUpperCase();
            estimatedMRR += pricing[plan] || 0;
            planDistribution[plan] = (planDistribution[plan] || 0) + 1;
        }
    });

    return {
        activeSubscribers: active,
        trialingSubscribers: trialing,
        paymentIssues: issues,
        estimatedMRR,
        planDistribution,
    };
}
