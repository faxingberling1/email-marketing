"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function getDashboardStats() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = session.user.id;

    try {
        const [
            user,
            totalContacts,
            totalEmails,
            openedEmails,
            clickedEmails,
            recentCampaigns,
            recentActivity
        ] = await Promise.all([
            prisma.user.findUnique({ where: { id: userId }, select: { name: true } }),
            prisma.contact.count({ where: { userId } }),
            prisma.email.count({ where: { campaign: { userId } } }),
            prisma.email.count({ where: { campaign: { userId }, opened: true } }),
            prisma.email.count({ where: { campaign: { userId }, clicked: true } }),
            prisma.campaign.findMany({
                where: { userId },
                take: 5,
                orderBy: { updatedAt: 'desc' },
                include: {
                    _count: {
                        select: { emails: true }
                    }
                }
            }),
            prisma.email.findMany({
                where: { campaign: { userId }, NOT: { sentAt: null } },
                take: 10,
                orderBy: { sentAt: 'desc' },
                include: {
                    contact: { select: { name: true, email: true } },
                    campaign: { select: { name: true } }
                }
            })
        ]);

        const openRate = totalEmails > 0 ? (openedEmails / totalEmails) * 100 : 0;
        const clickRate = totalEmails > 0 ? (clickedEmails / totalEmails) * 100 : 0;

        const trendData = Array.from({ length: 30 }).map((_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
            openRate: Math.floor(Math.random() * 20) + 30,
            clickRate: Math.floor(Math.random() * 10) + 5,
            isForecast: i > 23 // Last 7 days are "forecast"
        }));

        const peakEngagement = {
            time: "4:00 PM EST",
            segment: "Founders & CEOs",
            confidence: "High",
            reason: "Post-lunch synchronization window detected"
        };

        return {
            user: { name: user?.name || session.user.email?.split('@')[0] || "User" },
            metrics: [
                {
                    name: 'Total Contacts',
                    value: totalContacts.toLocaleString(),
                    change: '+12%',
                    icon: 'Users',
                    sparkline: [30, 45, 35, 50, 48, 60, 55],
                    aiSuggestion: "Growth accelerating. Segment imports recommended.",
                    status: 'success'
                },
                {
                    name: 'Emails Sent',
                    value: totalEmails.toLocaleString(),
                    change: '+24%',
                    icon: 'Send',
                    sparkline: [20, 30, 25, 40, 35, 50, 45],
                    aiSuggestion: "Volume optimal. Delivery rates stable.",
                    status: 'success'
                },
                {
                    name: 'Avg. Open Rate',
                    value: `${openRate.toFixed(1)}%`,
                    change: '-2%',
                    icon: 'TrendingUp',
                    sparkline: [45, 42, 40, 38, 35, 36, 34],
                    aiSuggestion: "Open rate low → Optimize subject lines with AI.",
                    status: 'warning'
                },
                {
                    name: 'Click Rate',
                    value: `${clickRate.toFixed(1)}%`,
                    change: '+2%',
                    icon: 'MousePointer2',
                    sparkline: [12, 14, 13, 15, 14, 16, 17],
                    aiSuggestion: "Click momentum detected. Add CTA variants.",
                    status: 'success'
                },
            ],
            recentCampaigns: recentCampaigns.map((c: any) => {
                const sentCount = c._count.emails;
                const openRate = sentCount > 0 ? Math.floor(Math.random() * 25) + 20 : 0;
                const clickRate = openRate > 0 ? Math.floor(Math.random() * 10) + 5 : 0;

                return {
                    id: c.id,
                    name: c.name,
                    sentDate: c.createdAt.toLocaleDateString(),
                    status: c.status === 'PUBLISHED' ? 'Active' : c.status === 'DRAFT' ? 'Scheduled' : 'Paused',
                    sentCount: sentCount.toLocaleString(),
                    openRate: `${openRate}%`,
                    clickRate: `${clickRate}%`,
                    retargetRecommended: openRate < 25 && sentCount > 0,
                    nextLaunchSuggestion: "AI recommends Tuesday at 10 AM for 15% higher open potential"
                };
            }),
            activity: recentActivity.map((a: any) => ({
                id: a.id,
                type: a.clicked ? 'click' : a.opened ? 'open' : 'sent',
                contact: a.contact.name || a.contact.email,
                campaign: a.campaign.name,
                time: a.sentAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now'
            })),
            trendData,
            peakEngagement,
            aiPanel: {
                growthForecast: "+12.4%",
                activityHorizon: [
                    "Waiting for incoming signal...",
                    "Analyzing founder engagement patterns...",
                    "Optimizing sequence cadence...",
                ],
                recommendations: [
                    {
                        id: 1,
                        title: "High Saturation Detected",
                        text: "Founder segment demonstrates high saturation. Retargeting via secondary sequence is predicted to yield +18% uplift.",
                        uplift: "+18%",
                        priority: "high",
                        copyText: "Retarget founders with secondary sequence optimization."
                    },
                    {
                        id: 2,
                        title: "Optimal Send Window",
                        text: "Next major sync window opens at 4:30 PM EST for the SaaS segment. Prepare dispatch for maximum visibility.",
                        uplift: "+12%",
                        priority: "medium",
                        copyText: "Schedule SaaS segment dispatch for 4:30 PM EST."
                    }
                ]
            },
            sequences: [
                {
                    id: 'seq-1',
                    name: "Founder Onboarding Sequence",
                    status: 'active',
                    steps: [
                        { id: '1', type: 'email', label: 'Intro: The Vision', performance: '45% Open / 12% Click', status: 'optimal' },
                        { id: '2', type: 'wait', label: 'Wait for 2 Days', status: 'stable' },
                        { id: '3', type: 'email', label: 'Deep Dive: Features', performance: '32% Open / 8% Click', status: 'needs_work' },
                        { id: '4', type: 'trigger', label: 'Click on Pricing', status: 'active' }
                    ],
                    prediction: "+22% Conversion Potential"
                }
            ],
            templates: [
                { id: 't-1', name: 'The Visionary Pitch', category: 'Growth', languages: ['EN', 'DE', 'FR'], tone: 'Bold', rating: 4.8 },
                { id: 't-2', name: 'Product Update: Glassmorphism', category: 'Tech', languages: ['EN', 'JP'], tone: 'Minimalist', rating: 4.9 },
                { id: 't-3', name: 'Retarget: SaaS Decision Makers', category: 'Sales', languages: ['EN'], tone: 'Urgent', rating: 4.5 }
            ],
            commands: [
                {
                    id: 'create',
                    name: 'CREATE CAMPAIGN',
                    icon: 'Send',
                    color: 'indigo',
                    status: 'ready',
                    isRecommended: true,
                    tip: "Recommended action for next campaign"
                },
                {
                    id: 'import',
                    name: 'IMPORT CONTACTS',
                    icon: 'Users',
                    color: 'purple',
                    status: 'ready',
                    isRecommended: false,
                    tip: null
                },
                {
                    id: 'verify',
                    name: 'VERIFY DOMAIN',
                    icon: 'ShieldCheck',
                    color: 'emerald',
                    status: 'pending',
                    isRecommended: false,
                    tip: "Security handshake in progress"
                },
                {
                    id: 'launch',
                    name: 'LAUNCH AI',
                    icon: 'Sparkles',
                    color: 'cyan',
                    status: 'ready',
                    isRecommended: true,
                    tip: "AI Template Priming Available"
                },
            ]
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return null;
    }
}
