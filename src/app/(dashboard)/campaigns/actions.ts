"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { checkEmailLimit, consumeEmailCredits } from "@/lib/services/usage-enforcement";
import { getTierLimits } from "@/lib/tiers";

export async function deleteCampaign(campaignId: string) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) return { success: false, error: "Unauthorized" };

        // Verify ownership
        const campaign = await prisma.campaign.findFirst({
            where: { id: campaignId, userId }
        });
        if (!campaign) return { success: false, error: "Campaign not found" };

        // Delete emails of the campaign first (FK), then the campaign
        await prisma.email.deleteMany({ where: { campaignId } });
        await prisma.campaign.delete({ where: { id: campaignId } });

        return { success: true };
    } catch (error) {
        console.error("Failed to delete campaign:", error);
        return { success: false, error: "Database error" };
    }
}

export async function createCampaign(data: {
    name: string;
    subject: string;
    content: string;
    segment: string;
    segmentCount: number;
    status: string;
    type?: 'BROADCAST' | 'AUTOMATION';
    sequences?: any[];
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

        // 3. Check Email Volume Limit
        const usage = await checkEmailLimit(workspaceId, data.segmentCount);
        if (!usage.allowed) {
            return {
                success: false,
                error: usage.reason,
                code: usage.code
            };
        }

        const campaign = await prisma.$transaction(async (tx) => {
            const newCampaign = await (tx as any).campaign.create({
                data: {
                    userId,
                    name: data.name,
                    subject: data.subject,
                    aiContent: data.content,
                    status: data.status.toUpperCase(),
                    type: data.type || 'BROADCAST',
                    segmentCount: data.segmentCount, // Added segmentCount
                    sequences: data.sequences && data.sequences.length > 0 ? {
                        create: data.sequences.map((s, i: number) => ({
                            stepNumber: i + 1,
                            triggerEvent: s.triggerEvent || 'delay',
                            delayTime: s.delayTime || 0,
                            subject: s.subject || null,
                            aiContent: s.content || null,
                            status: 'active'
                        }))
                    } : undefined
                }
            });

            await consumeEmailCredits(workspaceId, data.segmentCount);

            return newCampaign;
        });

        return { success: true, campaign };
    } catch (error) {
        console.error("Failed to create campaign:", error);
        return { success: false, error: "Database error" };
    }
}

// Real DB Action for Campaigns
export async function getCampaignsData() {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) return { campaigns: [], segments: [], plan: 'free', quotas: { ai: { remaining: 0 }, emails: { remaining: 0 } } };

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { workspaceId: true }
        });
        if (!user?.workspaceId) return { campaigns: [], segments: [], plan: 'free', quotas: { ai: { remaining: 0 }, emails: { remaining: 0 } } };

        const workspace = await prisma.workspace.findUnique({
            where: { id: user.workspaceId }
        });

        if (!workspace) return { campaigns: [], segments: [], plan: 'free', quotas: { ai: { remaining: 0 }, emails: { remaining: 0 } } };

        const limits = getTierLimits(workspace.subscription_plan);
        const plan = workspace.subscription_plan.toLowerCase() as any;

        const quotas = {
            ai: {
                remaining: Math.max(0, limits.ai_credits_per_month - (workspace as any).total_ai_used)
            },
            emails: {
                remaining: Math.max(0, limits.emails_per_month - (workspace as any).total_emails_sent)
            }
        };

        // Fetch all campaigns for this user with their email stats
        const campaigns = await prisma.campaign.findMany({
            where: { userId },
            include: {
                emails: {
                    select: { opened: true, clicked: true, status: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedCampaigns = campaigns.map(c => {
            const totalEmails = c.emails.length;
            const openedEmails = c.emails.filter(e => e.opened).length;
            const clickedEmails = c.emails.filter(e => e.clicked).length;
            const sentCount = c.emails.filter(e => e.status === 'sent').length;

            const openRate = totalEmails > 0 ? Math.round((openedEmails / totalEmails) * 100) : 0;
            const clickRate = totalEmails > 0 ? Math.round((clickedEmails / totalEmails) * 100) : 0;

            // Map status to display format
            let displayStatus: 'Active' | 'Scheduled' | 'Paused' = 'Paused';
            const s = c.status?.toUpperCase();
            if (s === 'ACTIVE' || s === 'SENT') displayStatus = 'Active';
            else if (s === 'SCHEDULED' || s === 'DRAFT') displayStatus = 'Scheduled';
            else displayStatus = 'Paused';

            return {
                id: c.id,
                name: c.name,
                sentDate: c.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: displayStatus,
                sentCount: sentCount.toLocaleString(),
                openRate: `${openRate}%`,
                clickRate: `${clickRate}%`,
                retargetRecommended: openRate < 20 && totalEmails > 0,
                nextLaunchSuggestion: openRate < 20 ? 'AI recommends shifting tone to "Bold"' : 'Optimal window: Tuesday at 10 AM',
                prediction: { open: `${Math.min(openRate + 5, 100)}%`, click: `${Math.min(clickRate + 2, 100)}%` }
            };
        });

        // Get contacts for segment list
        const contactCount = await prisma.contact.count({ where: { userId } });
        const segments = [
            { id: 'seg-all', name: 'All Contacts', count: contactCount, recommended: true },
            { id: 'seg-active', name: 'Active Subscribers', count: Math.floor(contactCount * 0.7), recommended: false },
        ];

        // Compute real aggregate stats from email tracking data
        const totalEmailCount = await prisma.email.count({ where: { campaign: { userId } } });
        const openedCount = await prisma.email.count({ where: { campaign: { userId }, opened: true } });
        const clickedCount = await prisma.email.count({ where: { campaign: { userId }, clicked: true } });
        const sentCount = await prisma.email.count({ where: { campaign: { userId }, status: 'sent' } });

        const stats = {
            totalSent: sentCount,
            avgOpenRate: totalEmailCount > 0 ? Math.round((openedCount / totalEmailCount) * 100) : null,
            avgClickRate: totalEmailCount > 0 ? Math.round((clickedCount / totalEmailCount) * 100) : null,
            totalCampaigns: formattedCampaigns.length,
        };

        return { campaigns: formattedCampaigns, segments, plan, quotas, stats };
    } catch (error) {
        console.error("Failed to fetch campaigns data:", error);
        return { campaigns: [], segments: [] };
    }
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
