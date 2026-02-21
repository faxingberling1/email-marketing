"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { getDynamicModel } from "@/lib/gemini";
import { getCachedData, setCachedData } from "@/lib/cache";

export async function getAutomationSequences() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const cacheKey = `automation_sequences_${session.user.id}`;
    const cached = getCachedData<any>(cacheKey, 60 * 60 * 1000); // 1 hour TTL
    if (cached) return cached;

    try {
        const systemInstruction = `You are an AI Automation Strategist.
        Generate 3 distinct email automation sequence summaries that a SaaS or E-commerce company should be running.
        
        Respond ONLY with a JSON array of objects matching this exact shape:
        [
            {
                "id": "s1",
                "name": "Creative sequence name (e.g. 'Visionary Onboarding Orbit')",
                "status": "Optimized", "Needs Improvement", or "Stable",
                "steps": number between 3 and 7,
                "activeContacts": number between 100 and 5000,
                "avgConversion": "percentage string",
                "lastOptimization": "e.g. 24h ago"
            }
        ]
        Do not include markdown codeblocks.`;

        const model = await getDynamicModel();
        const result = await model.generateContent(systemInstruction);
        const responseText = result.response.text();
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanedJSON);
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error("Gemini AI Sequence Gen Error:", error);
        return [
            { id: 's1', name: 'Visionary Onboarding Orbit', status: 'Optimized', steps: 4, activeContacts: 1240, avgConversion: '22%', lastOptimization: '2h ago' },
            { id: 's2', name: 'Churn Risk Mitigation', status: 'Stable', steps: 5, activeContacts: 850, avgConversion: '15%', lastOptimization: '12h ago' }
        ];
    }
}

export async function getSequenceFlow(sequenceId: string) {
    const cacheKey = `sequence_flow_${sequenceId}`;
    const cached = getCachedData<any>(cacheKey, 24 * 60 * 60 * 1000); // 24 hour TTL (flows change rarely)
    if (cached) return cached;

    try {
        const systemInstruction = `You are a tactical email automation structural AI.
        Generate a 4 to 6 step flow diagram for an optimal email sequence.
        The sequence should include a mix of triggers, emails, wait periods, and conditions.
        
        Respond ONLY with a JSON array of objects matching this exact shape:
        [
            { 
                "id": "1", 
                "type": "trigger", "email", "wait", or "condition", 
                "label": "Short descriptive label", 
                "performance": "Optional string (e.g. '45% Open / 12% Click') - only for emails", 
                "status": "active", "optimized", "stable", or "needs_work", 
                "delay": "Optional string (e.g. 'Instant' or '2 Days')" 
            }
        ]
        Do not include markdown codeblocks.`;

        const model = await getDynamicModel();
        const result = await model.generateContent(systemInstruction);
        const responseText = result.response.text();
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanedJSON);
        setCachedData(cacheKey, data);
        return data;

    } catch (error) {
        console.error("Gemini AI Flow Gen Error:", error);
        return [
            { id: '1', type: 'trigger', label: 'Identity Verification Trigger', status: 'active' },
            { id: '2', type: 'email', label: 'Welcome Transfixed', performance: '45% Open / 12% Click', status: 'optimized' },
            { id: '3', type: 'wait', label: '2 Day Logic Gap', status: 'stable' },
            { id: '4', type: 'email', label: 'Growth Catalyst', performance: '32% Open / 8% Click', status: 'needs_work' }
        ];
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
