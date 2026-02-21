"use server"

import { getDynamicModel } from "@/lib/gemini";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { checkAiLimit, consumeAiCredits } from "@/lib/services/usage-enforcement";

// Mocking Intelligence Data Layer for AI Assistant
// Ideally these would interface with LLM APIs

export async function generateSubjectLines(prompt: string, segment: string) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { workspaceId: true }
        });
        if (!user?.workspaceId) throw new Error("No active workspace");

        // Enforcement Check
        const usage = await checkAiLimit(user.workspaceId, 1);
        if (!usage.allowed) {
            return { error: usage.reason, code: usage.code };
        }

        const systemInstruction = `You are an expert marketing copywriter. 
        Generate 4 highly engaging email subject lines for the target audience: ${segment}.
        The subject lines should be based on this instruction: ${prompt}
        
        Respond ONLY with a JSON array of objects. Each object must have:
        - id (string, 1 to 4)
        - text (the subject line)
        - predictedOpenRate (a realistic percentage string, e.g. "45.2%")
        - confidence (High, Optimal, Stable, or Neutral)
        
        Do not include markdown blocks.`;

        const model = await getDynamicModel();
        const result = await model.generateContent(systemInstruction);
        const responseText = result.response.text();
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const subjects = JSON.parse(cleanedJSON);

        // Consume Credits on success
        await consumeAiCredits(user.workspaceId, 1);

        return subjects;
    } catch (error: any) {
        console.error("Gemini AI Subject Generation Error:", error);
        if (error.message?.includes("Insufficient") || error.message?.includes("Limit")) {
            return { error: error.message, code: "AI_LIMIT_REACHED" };
        }
        return [
            { id: '1', text: `🚀 Level up your ${segment} outreach today!`, predictedOpenRate: '48.5%', confidence: 'High' }
        ];
    }
}

export async function generateEmailCopy(data: { prompt: string, tone: string, language: string, segment: string }) {
    try {
        const session = await auth();
        const userId = session?.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { workspaceId: true }
        });
        if (!user?.workspaceId) throw new Error("No active workspace");

        // Enforcement Check (Email generation costs 2 credits)
        const usage = await checkAiLimit(user.workspaceId, 2);
        if (!usage.allowed) {
            return { error: usage.reason, code: usage.code };
        }

        const systemInstruction = `You are a world-class email marketing AI.
        Generate the body copy for an email campaign based on these parameters:
        Target Audience: ${data.segment}
        Tone: ${data.tone}
        Language: ${data.language}
        Instructions: ${data.prompt}
        
        Provide ONLY the email body text. Do not include subject lines or extra formatting.`;

        const model = await getDynamicModel();
        const result = await model.generateContent(systemInstruction);
        const responseText = result.response.text();

        // Consume Credits
        await consumeAiCredits(user.workspaceId, 2);

        return {
            id: Date.now().toString(),
            content: responseText.trim(),
            language: data.language,
            tone: data.tone
        };
    } catch (error: any) {
        console.error("Gemini AI Body Generation Error:", error);
        return {
            id: Date.now().toString(),
            content: error.message || "Failed to generate copy. Please check API settings.",
            language: data.language,
            tone: data.tone,
            error: true
        };
    }
}

export async function getAIIntelligence() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
        performanceForecasts: [
            { id: 'f1', name: 'Q1 Outreach', predictedUplift: '+12.4%', status: 'Optimal' },
            { id: 'f2', name: 'SaaS Beta', predictedUplift: '+8.2%', status: 'Targeted' },
        ],
        underperformingAreas: [
            { id: 'u1', area: 'Evening Click Rates', segment: 'Founders', suggestion: 'Reschedule to Morning (9:00 AM EST)', impact: 'High' },
            { id: 'u2', area: 'Body Length', segment: 'Enterprise', suggestion: 'Reduce word count by 15%', impact: 'Medium' }
        ],
        optimalSendWindows: [
            { segment: 'Tech Startup', window: 'Tue/Wed 10:00 AM' },
            { segment: 'Corporate VC', window: 'Mon/Thu 11:30 AM' }
        ]
    };
}

export async function getAITemplates() {
    await new Promise(resolve => setTimeout(resolve, 800));

    return [
        { id: 't1', name: 'The Visionary Pitch', category: 'Growth', rating: 4.9, tone: 'Bold' },
        { id: 't2', name: 'Technical Deep Dive', category: 'Product', rating: 4.7, tone: 'Professional' },
        { id: 't3', name: 'Retention Guard', category: 'Churn', rating: 4.8, tone: 'Empathetic' },
    ];
}
