import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const GET = withAdminGuard(async (req: NextRequest) => {
    try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""
        if (!apiKey) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 })
        }

        const genAI = new GoogleGenerativeAI(apiKey)

        // Note: The Google Generative AI SDK doesn't have a direct 'listModels' in the top-level genAI object
        // in some versions, or it requires the admin/v1beta endpoint access.
        // We'll use a fetch to the raw endpoint to ensure we get the full list available to this key.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch models")
        }

        // Filter for models that support generating content
        const generativeModels = data.models
            .filter((m: any) => m.supportedGenerationMethods.includes("generateContent"))
            .map((m: any) => ({
                name: m.name.replace("models/", ""), // standard name e.g. gemini-1.5-flash
                displayName: m.displayName,
                description: m.description
            }))

        return NextResponse.json(generativeModels)
    } catch (error: any) {
        console.error("Model Discovery Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
})
