import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "./db";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Default fallback model
const DEFAULT_MODEL = "gemini-1.5-flash-latest";

/**
 * Dynamically retrieves the configured AI model from the system settings.
 * Falls back to a safe default if not configured.
 */
async function getActiveModel() {
    try {
        // Use raw SQL to bypass stale types and ensure speed
        const rows = await prisma.$queryRaw<any[]>`
            SELECT value FROM "SystemSetting" WHERE key = 'active_ai_model' LIMIT 1
        `;
        return rows[0]?.value || DEFAULT_MODEL;
    } catch (error) {
        console.error("Failed to fetch active AI model setting:", error);
        return DEFAULT_MODEL;
    }
}

/**
 * Returns a configured model instance based on the current system settings.
 * Use this in async server components or actions to ensure the correct model is used.
 */
export async function getDynamicModel() {
    if (!apiKey) throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing");

    const modelName = await getActiveModel();
    return genAI.getGenerativeModel({ model: modelName });
}

export async function generateAIEmailContent(prompt: string) {
    try {
        const model = await getDynamicModel();
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return null;
    }
}
