"use server"

// Template Intelligence Layer

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getTemplates() {
    const session = await auth();
    if (!session?.user?.id) return [];

    try {
        const templates = await prisma.template.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: 'desc' }
        });

        // Map DB models to the expected UI format (mock data format for now + DB records)
        return templates.map(t => ({
            id: t.id,
            name: t.name,
            description: t.subject || 'No subject',
            category: t.category,
            engagementScore: 0,
            thumbnail: '/templates/custom.jpg', // Placeholder
            lastEdited: t.updatedAt.toLocaleDateString(),
            htmlContent: t.htmlContent,
            textContent: t.textContent
        }));
    } catch (e) {
        console.error("Failed to load templates", e);
        return [];
    }
}

export async function translateTemplate(content: string, targetLanguage: string, tone: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mocking neural translation logic
    return {
        translatedContent: `[${targetLanguage} - ${tone}] Optimized creative content with preserved intent and localized engagement markers.`,
        confidence: '98%',
        toneMatch: 'High'
    };
}

export async function optimizeTemplateLayout(templateId: string) {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        suggestions: [
            { id: 's1', type: 'CTA', message: 'Move "Get Started" button 20px up for better focal resonance.' },
            { id: 's2', type: 'Copy', message: 'Reduce header word count by 15% to improve mobile readability.' }
        ],
        predictedLift: '+4.2%'
    };
}

export async function saveTemplate(data: { name: string; subject?: string; htmlContent: string; textContent?: string }) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const template = await prisma.template.create({
            data: {
                userId: session.user.id,
                name: data.name || "Untitled Template",
                subject: data.subject,
                htmlContent: data.htmlContent,
                textContent: data.textContent,
                category: "Custom",
            }
        });
        
        revalidatePath("/templates");
        return { success: true, id: template.id };
    } catch (error) {
        console.error("Save template error:", error);
        return { success: false, error: "Database error" };
    }
}

export async function generateAIDraft(prompt: string, tone: string) {
    await new Promise(resolve => setTimeout(resolve, 2500));
    return {
        draft: `A highly-optimized copy draft generated for ${tone} audience based on: "${prompt}"`,
        confidence: '94%',
        engagementEstimate: '+12.5% Open Rate Lift'
    };
}
