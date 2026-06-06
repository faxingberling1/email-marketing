"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { getDynamicModel } from "@/lib/gemini";
import { getCachedData, setCachedData } from "@/lib/cache";

export async function getAutomationData() {
    const session = await auth();
    if (!session?.user?.id) return { sequences: [], insights: [], segments: [], plan: 'free', quotas: null };

    try {
        const [campaigns, user] = await Promise.all([
            prisma.campaign.findMany({
                where: { userId: session.user.id, type: 'AUTOMATION' },
                include: { sequences: true },
                orderBy: { updatedAt: 'desc' }
            }),
            prisma.user.findUnique({
                where: { id: session.user.id },
                include: { workspace: true, _count: { select: { campaigns: true } } }
            })
        ]);

        const sequences = campaigns.map(c => ({
            id: c.id,
            name: c.name,
            status: c.status === 'ACTIVE' ? 'Optimized' : (c.status === 'DRAFT' ? 'Needs Improvement' : 'Stable'),
            steps: c.sequences.length,
            activeContacts: 0,
            avgConversion: '0%',
            lastOptimization: c.updatedAt.toLocaleDateString()
        }));

        // Mock segments
        const segments = [
            { id: 'seg-all', name: 'All Contacts', count: 1200 },
            { id: 'seg-active', name: 'Active Users', count: 450 }
        ];

        const plan = user?.workspace?.subscription_plan?.toLowerCase() || 'free';
        const quotas = {
            emails: { remaining: (user?.workspace?.email_limit_remaining || 5000) - (user?.workspace?.total_emails_sent || 0) },
            ai: { remaining: user?.workspace?.ai_credits_remaining || 100 }
        };

        return { sequences, insights: [], segments, plan, quotas };

    } catch (error) {
        console.error("Fetch Automation Data Error:", error);
        return { sequences: [], insights: [], segments: [], plan: 'free', quotas: null };
    }
}

export async function getSequenceFlow(campaignId: string) {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId, userId: session.user.id },
            include: { sequences: { orderBy: { stepNumber: 'asc' } } }
        });

        if (!campaign) return [];

        return campaign.sequences.map((s, index) => ({
            id: s.id,
            type: s.triggerEvent === 'delay' ? 'wait' : 'email',
            label: s.subject || `Step ${index + 1}`,
            performance: '0% Open / 0% Click', // Mock for now
            status: s.status,
            delay: s.delayTime > 0 ? `${s.delayTime} days` : 'Instant'
        }));

    } catch (error) {
        console.error("Fetch Flow Error:", error);
        return [];
    }
}

export async function getRetargetingInsights() {
    try {
        const systemInstruction = `You are an AI Retention expert.
        Generate 2 actionable retargeting campaign suggestions based on typical SaaS drop-off points.
        
        Respond ONLY with a JSON array of objects matching exactly:
        [
            {
                "id": "r1",
                "segment": "Target audience name",
                "reason": "Why this segment needs retargeting",
                "predictedUplift": "+X% Conversion or -X% Churn Risk",
                "action": "The command button text"
            }
        ]
        Do not include markdown codeblocks.`;

        const model = await getDynamicModel();
        const result = await model.generateContent(systemInstruction);
        const responseText = result.response.text();
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedJSON);
    } catch (error) {
        console.error("Gemini AI Retargeting Error:", error);
        return [];
    }
}

export async function optimizeSequenceOrder(sequenceId: string) {
    try {
        const systemInstruction = `You are an AI sequence optimization engine.
        Analyze a generic 5-step email sequence and recommend reordering the steps for maximum engagement.
        Assume steps are IDs '1' through '5'.
        
        Respond ONLY with a JSON object matching this schema exactly:
        {
            "suggestedOrder": ["array of step IDs in new order, e.g., '1', '3', '2', '5', '4'"],
            "reasoning": "One sentence explaining why this new order is structurally superior.",
            "predictedUplift": "String denoting the engagement lift, e.g., '+8.4% Sequence Completion'"
        }
        Do not include markdown codeblocks.`;

        const model = await getDynamicModel();
        const result = await model.generateContent(systemInstruction);
        const responseText = result.response.text();
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedJSON);
    } catch (error) {
        console.error("Gemini AI Step Reorder Error:", error);
        return {
            suggestedOrder: ['1', '2', '3', '4', '5'],
            reasoning: 'AI optimization offline. Retaining original sequence structure.',
            predictedUplift: '+0.0% (Offline)'
        };
    }
}
