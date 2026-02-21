import { NextResponse } from 'next/server'
import { getDynamicModel } from '@/lib/gemini'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { requireActiveWorkspace, WorkspaceAccessError, workspaceErrorResponse } from '@/lib/workspace-guard'

export async function POST(req: Request) {
    try {
        // ── Auth check ────────────────────────────────────────────────────
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // ── Workspace suspension check ─────────────────────────────────────
        // Resolve workspace from the user's primary workspaceId
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { workspaceId: true },
        })

        if (user?.workspaceId) {
            try {
                await requireActiveWorkspace(user.workspaceId)
            } catch (err) {
                if (err instanceof WorkspaceAccessError) {
                    const { status, body } = workspaceErrorResponse(err)
                    return NextResponse.json(body, { status })
                }
                throw err
            }
        }

        // ── AI generation ─────────────────────────────────────────────────
        const { prompt, industry, audience, offer, tone = 'Professional', language = 'English', cta = '' } = await req.json()

        const workspaceId = user?.workspaceId
        if (!workspaceId) {
            return NextResponse.json({ error: "No active workspace found" }, { status: 400 })
        }

        // 1. Check AI Credits
        const wsRows = await prisma.$queryRaw<any[]>`
            SELECT ai_credits_remaining, "subscription_plan" FROM "Workspace" WHERE id = ${workspaceId} LIMIT 1
        `
        const ws = wsRows[0]
        if (!ws || (ws.ai_credits_remaining !== null && ws.ai_credits_remaining <= 0)) {
            return NextResponse.json({
                error: "AI Credit Exhausted",
                code: "CREDIT_LIMIT_REACHED",
                suggestion: "Upgrade your plan or purchase an add-on."
            }, { status: 403 })
        }

        const systemInstruction = `You are an elite, high-conversion email marketing AI.
        Your goal is to generate a highly engaging, personalized email campaign.

        CRITICAL INSTRUCTIONS:
        1. Base the content on the provided parameters.
        2. Tone must strictly be: ${tone}.
        3. Output language must be: ${language}.
        4. Integrate this Call-to-Action naturally: ${cta || 'Default signup/purchase CTA'}.

        You MUST respond ONLY with a valid JSON object using the following exact structure:
        {
            "subjectLines": ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"],
            "body": "The complete, formatted email body text here. Use strategic spacing.",
            "segmentationSuggest": "A one-sentence suggestion for who to target."
        }
        Do not include markdown codeblocks (\`\`\`json) around the response, just the raw JSON string.`

        const userPrompt = `
        Context:
        Industry: ${industry}
        Target Audience: ${audience}
        Core Offer/Message: ${offer}

        Specific Campaign Instructions:
        ${prompt}
        `

        const model = await getDynamicModel()
        const result = await model.generateContent(`${systemInstruction}\n\n${userPrompt}`)
        const responseText = result.response.text()
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim()

        // 2. Deduct Credit & Log Usage
        await prisma.$transaction([
            prisma.$executeRaw`
                UPDATE "Workspace" 
                SET ai_credits_remaining = GREATEST(0, ai_credits_remaining - 1),
                    total_ai_used = total_ai_used + 1
                WHERE id = ${workspaceId}
            `,
            prisma.$executeRaw`
                INSERT INTO "AiUsageLog" (id, "workspaceId", model_used, tokens_used, cost_estimate, created_at)
                VALUES (gen_random_uuid(), ${workspaceId}, 'gemini-1.5-flash-latest', 1, 0.05, NOW())
            `
        ])

        return NextResponse.json(JSON.parse(cleanedJSON))

    } catch (error) {
        console.error('Gemini AI Generation Error:', error)
        return NextResponse.json({ error: 'Failed to generate content using Gemini' }, { status: 500 })
    }
}
