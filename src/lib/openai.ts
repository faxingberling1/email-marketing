import OpenAI from 'openai';

let _openai: OpenAI | null = null;
export function getOpenAI(): OpenAI {
    if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return _openai;
}
export const openai = new Proxy({} as OpenAI, {
    get(_target, prop) { return (getOpenAI() as any)[prop]; },
});

export async function generateEmailContent(prompt: string) {
    const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
}
