"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { checkEmailLimit, consumeEmailCredits } from "@/lib/services/usage-enforcement";
import { getTierLimits } from "@/lib/tiers";
import { sendEmail } from "@/lib/resend";

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
                    segment: data.segment || 'seg-all',
                    segmentCount: data.segmentCount,
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

export async function sendCampaign(campaignId: string) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) return { success: false, error: "Unauthorized" };

        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId, userId }
        });
        if (!campaign) return { success: false, error: "Invalid campaign" };
        if (campaign.status === 'SENT') return { success: false, error: "Campaign already sent" };

        const user = await prisma.user.findUnique({ 
            where: { id: userId }, 
            include: { workspace: { include: { verifiedDomains: true } } } 
        });
        if (!user?.workspaceId) return { success: false, error: "No workspace" };

        // Get verified domain for "from" address
        const verifiedDomain = user.workspace?.verifiedDomains?.find(d => d.status === 'verified');
        const fromAddress = verifiedDomain ? `updates@${verifiedDomain.domain}` : 'onboarding@resend.dev';

        // Get contacts
        let contacts = [];
        const c = campaign as any;
        if (c.segment === 'seg-active') {
            contacts = await prisma.contact.findMany({ where: { userId, engagementScore: { gte: 50 }, subscribed: true } });
        } else if (c.segment?.startsWith('tag-')) {
            const tag = c.segment.replace('tag-', '');
            contacts = await prisma.contact.findMany({ where: { userId, tags: { has: tag }, subscribed: true } });
        } else {
            // Default to all
            contacts = await prisma.contact.findMany({ where: { userId, subscribed: true } });
        }

        if (contacts.length === 0) return { success: false, error: "No active contacts in segment" };

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        let sent = 0;
        let failed = 0;

        for (const contact of contacts) {
            // Create Email record first to get ID for tracking
            const emailRecord = await prisma.email.create({
                data: {
                    campaignId,
                    contactId: contact.id,
                    status: 'sending'
                }
            });

            // Inject tracking
            const trackingPixel = `<img src="${baseUrl}/api/track/open?eid=${emailRecord.id}" width="1" height="1" alt="" style="display:none;" />`;
            // Simple link replacement (a real implementation would use a proper HTML parser)
            let htmlContent = campaign.aiContent ? campaign.aiContent.replace(/\\n/g, '<br/>') : '';
            htmlContent = htmlContent.replace(/href="([^"]+)"/g, `href="${baseUrl}/api/track/click?eid=${emailRecord.id}&url=$1"`);
            const htmlWithTracking = htmlContent + trackingPixel;

            try {
                await sendEmail({
                    to: contact.email,
                    from: fromAddress,
                    subject: campaign.subject || 'Update',
                    text: campaign.aiContent || '',
                    html: htmlWithTracking,
                    campaignId,
                    contactId: contact.id
                });
                await prisma.email.update({ where: { id: emailRecord.id }, data: { status: 'sent', sentAt: new Date() } });
                sent++;
            } catch (e) {
                await prisma.email.update({ where: { id: emailRecord.id }, data: { status: 'failed' } });
                failed++;
            }
        }

        // Update campaign
        await prisma.campaign.update({
            where: { id: campaignId },
            data: { status: 'SENT' }
        });

        // Update workspace usage
        await prisma.workspace.update({
            where: { id: user.workspaceId },
            data: { total_emails_sent: { increment: sent } }
        });

        return { success: true, sent, failed };
    } catch (error) {
        console.error("Failed to send campaign:", error);
        return { success: false, error: "Delivery failure" };
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
        const allContacts = await prisma.contact.findMany({ where: { userId }, select: { tags: true, engagementScore: true } });
        const contactCount = allContacts.length;
        
        const tagMap = new Map<string, number>();
        let activeCount = 0;

        for (const c of allContacts) {
            if (c.engagementScore >= 50) activeCount++;
            for (const t of c.tags) {
                tagMap.set(t, (tagMap.get(t) || 0) + 1);
            }
        }

        const segments: any[] = [
            { id: 'seg-all', name: 'All Contacts', count: contactCount, recommended: true },
            { id: 'seg-active', name: 'Active Subscribers', count: activeCount, recommended: false },
        ];

        // Add dynamic tag segments
        tagMap.forEach((count, tag) => {
            segments.push({ id: `tag-${tag}`, name: `Tag: ${tag}`, count, recommended: false });
        });

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
