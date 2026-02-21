"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { checkEmailLimit, consumeEmailCredits } from "@/lib/services/usage-enforcement";
import { getTierLimits } from "@/lib/tiers";

// Real DB Action
export async function createCampaign(data: {
    name: string;
    description?: string;
    senderEmail?: string;
    type: string;
    templateId: string;
    audienceId: string;
    config: any;
}) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { workspaceId: true }
        });
        if (!user?.workspaceId) return { success: false, error: "No active workspace" };

        const workspaceId = user.workspaceId;

        // 1. Resolve Tier & Limits
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: { subscription_plan: true } as any
        }) as any;

        if (!workspace) return { success: false, error: "No active workspace" };
        const limits = getTierLimits(workspace.subscription_plan);

        // 2. Check Workflow/Campaign Limit
        const campaignCount = await prisma.campaign.count({
            where: { userId }
        });

        if (campaignCount >= limits.automation_workflows) {
            return {
                success: false,
                error: `Workflow Limit Reached. Your ${workspace.subscription_plan} plan allows up to ${limits.automation_workflows} active workflow(s).`,
                code: "LIMIT_REACHED"
            };
        }

        // 3. Check Email Volume Limit (Mocking segment count for now)
        const segmentCount = 1000;
        const usage = await checkEmailLimit(workspaceId, segmentCount);
        if (!usage.allowed) {
            return {
                success: false,
                error: usage.reason,
                code: usage.code
            };
        }

        const campaign = await prisma.$transaction(async (tx) => {
            const newCampaign = await tx.campaign.create({
                data: {
                    userId,
                    name: data.name,
                    subject: "DRAFT SUBJECT",
                    aiContent: "DRAFT CONTENT",
                    status: "DRAFT",
                }
            });

            await consumeEmailCredits(workspaceId, segmentCount);

            return newCampaign;
        });

        return { success: true, campaign };
    } catch (error) {
        console.error("Failed to create campaign:", error);
        return { success: false, error: "Database error" };
    }
}

// Tactical Intelligence Actions
export async function getCampaignsData() {
    // Mocking a delay
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        campaigns: [
            {
                id: '1',
                name: 'Q1 Founder Outreach',
                status: 'Active',
                sentCount: '4,280',
                openRate: '42%',
                clickRate: '12%',
                retargetRecommended: false,
                nextLaunchSuggestion: 'AI recommends Thursday at 2 PM',
                prediction: { open: '45%', click: '14%' }
            },
            {
                id: '2',
                name: 'Product Update: Spring Edition',
                status: 'Scheduled',
                sentCount: '0',
                openRate: '0%',
                clickRate: '0%',
                retargetRecommended: false,
                nextLaunchSuggestion: 'Optimal window: Tuesday at 10 AM',
                prediction: { open: '38%', click: '9%' }
            },
            {
                id: '3',
                name: 'Low Engagement Retarget',
                status: 'Active',
                sentCount: '1,120',
                openRate: '18%',
                clickRate: '4%',
                retargetRecommended: true,
                nextLaunchSuggestion: 'AI recommends shifting tone to "Bold"',
                prediction: { open: '22%', click: '6%' }
            },
            {
                id: '4',
                name: 'Beta Tester Invitation',
                status: 'Paused',
                sentCount: '500',
                openRate: '65%',
                clickRate: '28%',
                retargetRecommended: false,
                nextLaunchSuggestion: 'Optimal window: Continuous',
                prediction: { open: '68%', click: '30%' }
            }
        ],
        segments: [
            { id: 'seg-1', name: 'SaaS Founders', count: 1250, recommended: true },
            { id: 'seg-2', name: 'Initial Beta List', count: 500, recommended: false },
            { id: 'seg-3', name: 'High-Value Leads', count: 840, recommended: true },
        ]
    };
}

export async function predictCampaignPerformance(data: any) {
    // Mocking AI computation
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        predictedOpenRate: '41.2%',
        predictedClickRate: '11.8%',
        confidence: 'High',
        factors: [
            { name: 'Subject Line Impact', status: 'positive' },
            { name: 'Segment Relevancy', status: 'optimal' },
            { name: 'Send Time Optimization', status: 'neutral' }
        ]
    };
}

export async function generateCreative(prompt: string, tone: string) {
    // Mocking AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
        subject: `[AI Generated] ${tone === 'Bold' ? 'Revolutionize' : 'Optimizing'} Your Workflow`,
        body: `Hi there,\n\nI've noticed your interest in scaling efficiency. Based on our latest AI analysis, we can help you achieve +25% better results...\n\nBest,\nAutomated Intelligence`
    };
}
