import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';

export async function POST(req: Request) {
    try {
        const { prompt, industry, audience, offer, tone = 'Professional', language = 'English', cta = '' } = await req.json();

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
        Do not include markdown codeblocks (\`\`\`json) around the response, just the raw JSON string.`;

        const userPrompt = `
        Context:
        Industry: ${industry}
        Target Audience: ${audience}
        Core Offer/Message: ${offer}
        
        Specific Campaign Instructions:
        ${prompt}
        `;

        const result = await geminiModel.generateContent(`${systemInstruction}\n\n${userPrompt}`);
        const responseText = result.response.text();

        // Sometimes LLMs still wrap in markdown despite instructions. Clean it.
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return NextResponse.json(JSON.parse(cleanedJSON));
    } catch (error) {
        console.error('Gemini AI Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate content using Gemini' }, { status: 500 });
    }
}
