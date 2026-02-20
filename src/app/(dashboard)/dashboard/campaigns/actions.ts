"use client"

// Note: In a real Next.js app, this would be a 'use server' file.
// For this demo/UI-focus, we'll keep it as simple client-side actions.

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
