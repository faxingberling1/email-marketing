import { prisma } from "@/lib/db";
import { getTierLimits } from "@/lib/tiers";

export interface UsageCheck {
    allowed: boolean;
    remaining: number;
    limit: number;
    reason?: string;
    code?: string;
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
    const ws = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { subscription_plan: true } as any
    }) as any;

    if (!ws) throw new Error("Workspace not found");

    const currentContacts = await prisma.contact.count({
        where: { user: { workspaceId } }
    });

    const limits = getTierLimits(ws.subscription_plan as any);
    const allowed = (currentContacts + newContactCount) <= limits.contacts;

    return {
        allowed,
        remaining: limits.contacts - currentContacts,
        limit: limits.contacts,
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
