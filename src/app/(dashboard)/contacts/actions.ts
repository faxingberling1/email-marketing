"use server"

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { getDynamicModel } from "@/lib/gemini";
import { getCachedData, setCachedData, clearUserCache } from "@/lib/cache";

export async function getContactsData(searchTerm: string = "") {
    const session = await auth();
    if (!session?.user?.id) return { contacts: [], clusters: [], predictions: {} };

    const userId = session.user.id;

    // Fetch real contacts via raw SQL to bypass stale Prisma Client SELECT list
    const rawContacts = await prisma.$queryRawUnsafe(
        `SELECT id, email, name, phone, "businessName", "engagementScore" as score, "createdAt", "updatedAt"
         FROM "Contact" 
         WHERE "userId" = $1 AND (
             $2 = '' OR 
             name ILIKE $3 OR 
             email ILIKE $3 OR 
             "businessName" ILIKE $3 OR 
             phone ILIKE $3
         )
         LIMIT 20`,
        userId, searchTerm, `%${searchTerm}%`
    ) as any[];

    // Fetch emails for context (can use conventional if they haven't changed)
    const contactsWithEmails = await Promise.all(rawContacts.map(async (c) => {
        const emails = await prisma.email.findMany({
            where: { contactId: c.id },
            orderBy: { sentAt: 'desc' },
            take: 5,
            select: { opened: true, clicked: true, sentAt: true }
        });
        return { ...c, emails };
    }));

    if (contactsWithEmails.length === 0) {
        return {
            contacts: [],
            clusters: [{ id: 'empty', name: 'No Data', count: 0, growth: '0%', color: 'slate' }],
            predictions: { avgLikelihoodToConvert: '0%', predictedChurnRate: '0%', atRiskCount: 0 }
        };
    }

    // Prepare data for AI analysis
    const contextData = contactsWithEmails.map(c => ({
        id: c.id,
        name: c.name || c.email,
        email: c.email,
        phone: c.phone,
        businessName: c.businessName,
        recentActivity: c.emails && c.emails.length > 0 ? c.emails.map((e: any) => ({
            opened: e.opened,
            clicked: e.clicked,
            daysAgo: e.sentAt ? Math.floor((Date.now() - e.sentAt.getTime()) / (1000 * 3600 * 24)) : 'unknown'
        })) : 'No recent activity'
    }));

    // prepared key for caching
    const cacheKey = `contacts_intel_${userId}_${searchTerm}`;
    const cached = getCachedData<any>(cacheKey, 30 * 60 * 1000); // 30 min TTL
    if (cached) return cached;

    // Call Gemini to analyze and cluster
    const aiIntelligence = await analyzeContactsEngagement(JSON.stringify(contextData), userId, searchTerm);

    // Merge AI insights back into the raw contacts for the HUD
    const enrichedContacts = contactsWithEmails.map((c: any) => {
        // Use email as a more stable key for LLM matching
        const prediction = aiIntelligence.contacts.find((p: any) => p.email === c.email);
        return {
            ...c,
            // Prioritize raw DB values, fallback to AI or defaults
            businessName: c.businessName || prediction?.businessName || null,
            phone: c.phone || prediction?.phone || null,
            segment: prediction?.segment || 'General',
            score: prediction?.score || 50,
            activity: prediction?.activity || 'No Activity',
            status: prediction?.status || 'Stable'
        };
    });

    const finalData = {
        contacts: enrichedContacts,
        clusters: aiIntelligence.clusters,
        predictions: aiIntelligence.predictions
    };

    setCachedData(cacheKey, finalData);
    return finalData;
}

export async function validateImportEmails(emails: string[]) {
    const session = await auth();
    if (session?.user?.id) {
        clearUserCache(`contacts_intel_${session.user.id}`);
    }
    // Mocking AI Deliverability Check
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        valid: emails.length - 2, // Mocking some invalid ones
        invalid: 2,
        details: [
            { email: 'bad-email@format', reason: 'Invalid Format' },
            { email: 'non-existent@domain.com', reason: 'Hard Bounce Risk' }
        ],
        threatLevel: 'Low'
    };
}

export async function identifyAtRiskContacts() {
    const session = await auth();
    if (!session?.user?.id) return [];

    const userId = session.user.id;

    // Grab up to 10 contacts with some old activity but nothing recent
    const atRiskContacts = await prisma.contact.findMany({
        where: { userId },
        take: 10,
        include: {
            emails: {
                take: 1,
                orderBy: { sentAt: 'desc' },
                select: { opened: true, clicked: true, sentAt: true }
            }
        }
    });

    if (atRiskContacts.length === 0) return [];

    const contextData = atRiskContacts.map(c => ({
        id: c.id,
        name: c.name || c.email,
        lastActivity: c.emails[0]?.sentAt ? c.emails[0].sentAt.toISOString() : 'Never',
        openedLast: c.emails[0]?.opened,
        clickedLast: c.emails[0]?.clicked
    }));

    try {
        const systemInstruction = `You are an AI retention specialist.
        Analyze these "At Risk" contacts and generate a specific reason and tactical suggestion to re-engage them.
        
        Data:
        ${JSON.stringify(contextData)}
        
        Respond ONLY with a JSON array of objects (maximum 3 items) matching exactly:
        [
            {
                "id": "must match provided original id exactly",
                "name": "contact name",
                "reason": "1 sentence explanation of why they are at risk (e.g., 'No opens in last 3 campaigns')",
                "suggestion": "1 actionable command (e.g., 'Trigger Win-back Sequence')"
            }
        ]
        Do not include markdown codeblocks.`;

        const model = await getDynamicModel();
        const result = await model.generateContent(systemInstruction);
        const responseText = result.response.text();
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedJSON);

    } catch (error) {
        console.error("Gemini AI At-Risk Detection Error:", error);
        return [
            { id: 'offline', name: 'Intelligence Offline', reason: 'Unable to analyze risk factors', suggestion: 'Check API Connection' }
        ];
    }
}

export async function createContact(data: { name: string; email: string; phone?: string; businessName?: string; tags?: string[] }) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        // Attempt conventional creation (may fail if Prisma Client is locked/stale)
        const contact = await (prisma as any).contact.create({
            data: {
                userId: session.user.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                businessName: data.businessName,
                tags: data.tags || [],
                updatedAt: new Date()
            }
        });
        clearUserCache(`contacts_intel_${session.user.id}`);
        return contact;
    } catch (err: any) {
        // Handle Unique Constraint Violation (email already exists)
        if (err.code === 'P2002' || err.message?.includes('23505')) {
            throw new Error(`Contact with email ${data.email} already exists.`);
        }

        console.error("Conventional create failed, attempting raw fallback:", err.message);

        try {
            // Raw SQL fallback to bypass Prisma Client runtime validation
            const id = `c${Math.random().toString(36).substring(2, 15)}`;
            // Format tags for Postgres text[] array: '{tag1,tag2}'
            const pgTags = `{${(data.tags || []).join(',')}}`;
            await prisma.$executeRawUnsafe(
                `INSERT INTO "Contact" (id, "userId", email, name, phone, "businessName", tags, "updatedAt", "createdAt") 
                 VALUES ($1, $2, $3, $4, $5, $6, $7::text[], NOW(), NOW())`,
                id, session.user.id, data.email, data.name, data.phone || null, data.businessName || null, pgTags
            );

            clearUserCache(`contacts_intel_${session.user.id}`);
            return { id, ...data };
        } catch (rawErr: any) {
            if (rawErr.message?.includes('23505')) {
                throw new Error(`Contact with email ${data.email} already exists.`);
            }
            throw rawErr;
        }
    }
}

async function analyzeContactsEngagement(contextString: string, userId: string, searchTerm: string) {
    const cacheKey = `contacts_intel_${userId}_${searchTerm}`;
    try {
        const systemInstruction = `You are a CRM predictive intelligence AI. 
        Analyze the provided contact data and email interaction history.
        
        Data to analyze:
        ${contextString}
        
        Task:
        1. Auto-cluster these contacts into 2 to 4 distinct behavioral segments (e.g., 'High Engagement', 'Churn Risk', 'Passive').
        2. Assign a 1-100 engagement score to EACH contact based on their activity (opens, clicks, recency).
        3. Make overall predictions for the whole group.
        
        Respond ONLY with a JSON object matching this exact shape:
        {
            "contacts": [
                {
                    "id": "must match provided original id exactly",
                    "name": "contact name",
                    "email": "contact email",
                    "phone": "contact phone (from context)",
                    "businessName": "business name (from context)",
                    "segment": "assigned segment name",
                    "score": number between 1 and 100,
                    "activity": "Last active X days ago (infer from data)",
                    "status": "Optimal", "Stable", "Passive", or "Critical"
                }
            ],
            "clusters": [
                {
                    "id": "c1",
                    "name": "segment name",
                    "count": number of contacts in this segment,
                    "growth": "+5%",
                    "color": "indigo"
                }
            ],
            "predictions": {
                "avgLikelihoodToConvert": "percentage string",
                "predictedChurnRate": "percentage string",
                "atRiskCount": number
            }
        }
        Do not include markdown or explanations.`;

        const model = await getDynamicModel();
        const result = await model.generateContent(systemInstruction);
        const responseText = result.response.text();
        const cleanedJSON = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(cleanedJSON);
        setCachedData(cacheKey, data);
        return data;
    } catch (error) {
        console.error("Gemini AI Segmentation Error:", error);
        return {
            contacts: [],
            clusters: [{ id: 'fallback', name: 'General', count: 0, growth: '0%', color: 'indigo' }],
            predictions: {
                avgLikelihoodToConvert: '42%',
                predictedChurnRate: '12%',
                atRiskCount: 0
            }
        };
    }
}

export async function deleteContact(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await (prisma.contact as any).delete({
            where: { id, userId: session.user.id }
        });
    } catch (err) {
        // Fallback for engine lock
        await prisma.$executeRawUnsafe(
            `DELETE FROM "Contact" WHERE id = $1 AND "userId" = $2`,
            id, session.user.id
        );
    }

    clearUserCache(`contacts_intel_${session.user.id}`);
}

export async function updateContactTags(id: string, tags: string[]) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    try {
        await (prisma.contact as any).update({
            where: { id, userId: session.user.id },
            data: { tags }
        });
    } catch (err: any) {
        // Fallback for engine lock
        const pgTags = `{${tags.join(',')}}`;
        await prisma.$executeRawUnsafe(
            `UPDATE "Contact" SET tags = $1::text[], "updatedAt" = NOW() WHERE id = $2 AND "userId" = $3`,
            pgTags, id, session.user.id
        );
    }

    clearUserCache(`contacts_intel_${session.user.id}`);
}
