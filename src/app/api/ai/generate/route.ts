import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: Request) {
    try {
        const { prompt, industry, audience, offer } = await req.json();

        const systemPrompt = `You are a high-conversion email marketing expert. 
    Generate a professional, engaging, and personalized email campaign for the user.
    Return a JSON object with: 
    - subjectLines (array of 5 options)
    - body (the main email content)
    - segmentationSuggest (one sentence suggestion for targeting)`;

        const userPrompt = `Industry: ${industry}
    Target Audience: ${audience}
    Core Offer/Message: ${offer}
    Specific Instructions: ${prompt}`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" }
        });

        return NextResponse.json(JSON.parse(completion.choices[0].message.content || '{}'));
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}
