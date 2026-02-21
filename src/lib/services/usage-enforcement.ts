import { prisma } from "@/lib/db";
import { getTierLimits, SubscriptionTier } from "@/lib/tiers";

export interface UsageCheck {
    allowed: boolean;
    remaining: number;
    limit: number;
    reason?: string;
    code?: string;
}

export interface WorkspaceQuotas {
    plan: SubscriptionTier;
    ai: UsageCheck;
    emails: UsageCheck;
    contacts: UsageCheck;
    automation: {
        allowed: boolean;
        workflowsUsed: number;
        limit: number;
    };
    features: {
        abTesting: boolean;
        predictiveAnalytics: boolean;
        customBranding: boolean;
    };
}

/**
 * Robustly fetches workspace usage data.
 */
async function getWorkspaceUsage(workspaceId: string) {
    const ws = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: {
            ai_credits_remaining: true,
            subscription_plan: true,
            email_limit_remaining: true,
            total_ai_used: true,
            total_emails_sent: true
        } as any
    }) as any;

    if (!ws) throw new Error("Workspace not found");
    return ws;
}

/**
 * Aggregates all quotas for a workspace.
 */
export async function getWorkspaceQuotas(workspaceId: string): Promise<WorkspaceQuotas> {
    const ws = await getWorkspaceUsage(workspaceId);
    const limits = getTierLimits(ws.subscription_plan);

    const contactCount = await prisma.contact.count({
        where: { user: { workspaceId } }
    });

    const workflowCount = await prisma.campaign.count({
        where: {
            userId: {
                in: (await prisma.user.findMany({
                    where: { workspaceId },
                    select: { id: true }
                })).map(u => u.id)
            }, type: "AUTOMATION"
        } as any
    });

    return {
        plan: ws.subscription_plan as SubscriptionTier,
        ai: {
            allowed: ws.ai_credits_remaining > 0,
            remaining: ws.ai_credits_remaining,
            limit: limits.ai_credits_per_month
        },
        emails: {
            allowed: ws.email_limit_remaining > 0,
            remaining: ws.email_limit_remaining,
            limit: limits.emails_per_month
        },
        contacts: {
            allowed: contactCount < limits.contacts,
            remaining: Math.max(0, limits.contacts - contactCount),
            limit: limits.contacts
        },
        automation: {
            allowed: workflowCount < limits.automation_workflows,
            workflowsUsed: workflowCount,
            limit: limits.automation_workflows
        },
        features: {
            abTesting: limits.features.ab_testing,
            predictiveAnalytics: limits.features.predictive_analytics,
            customBranding: limits.features.custom_branding
        }
    };
}

/**
 * Checks if a workspace has enough AI credits for an operation.
 */
export async function checkAiLimit(workspaceId: string, requiredCredits: number = 1): Promise<UsageCheck> {
    const ws = await getWorkspaceUsage(workspaceId);
    const limits = getTierLimits(ws.subscription_plan as any);
    const allowed = ws.ai_credits_remaining >= requiredCredits;

    return {
        allowed,
        remaining: ws.ai_credits_remaining,
        limit: limits.ai_credits_per_month,
        reason: allowed ? undefined : "Insufficient AI credits. Please upgrade your plan or purchase an add-on.",
        code: "AI_LIMIT_REACHED"
    };
}

/**
 * Checks if a workspace can send more emails this month.
 */
export async function checkEmailLimit(workspaceId: string, recipientCount: number = 1): Promise<UsageCheck> {
    const ws = await getWorkspaceUsage(workspaceId);
    const limits = getTierLimits(ws.subscription_plan as any);
    const allowed = ws.email_limit_remaining >= recipientCount;

    return {
        allowed,
        remaining: ws.email_limit_remaining,
        limit: limits.emails_per_month,
        reason: allowed ? undefined : "Monthly email limit reached. Upgrade your plan to send more.",
        code: "EMAIL_LIMIT_REACHED"
    };
}

/**
 * Checks if a workspace can add more contacts.
 */
export async function checkContactLimit(workspaceId: string, newContactCount: number = 1): Promise<UsageCheck> {
    const quotas = await getWorkspaceQuotas(workspaceId);
    const allowed = (quotas.contacts.limit - quotas.contacts.remaining + newContactCount) <= quotas.contacts.limit;

    return {
        allowed,
        remaining: quotas.contacts.remaining,
        limit: quotas.contacts.limit,
        reason: allowed ? undefined : "Contact limit reached for your current plan.",
        code: "CONTACT_LIMIT_REACHED"
    };
}

/**
 * Permanently decrements AI credits for a workspace.
 */
export async function consumeAiCredits(workspaceId: string, amount: number = 1) {
    return await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
            ai_credits_remaining: { decrement: amount },
            total_ai_used: { increment: amount }
        } as any
    });
}

/**
 * Permanently decrements email sending limit for a workspace.
 */
export async function consumeEmailCredits(workspaceId: string, amount: number = 1) {
    return await prisma.workspace.update({
        where: { id: workspaceId },
        data: {
            email_limit_remaining: { decrement: amount },
            total_emails_sent: { increment: amount }
        } as any
    });
}
