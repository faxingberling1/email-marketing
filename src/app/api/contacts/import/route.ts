import { NextResponse } from 'next/server';
// @ts-ignore
import Papa from 'papaparse';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        // Authenticate via session
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const csvText = await file.text();
        const { data } = Papa.parse(csvText, { header: true, skipEmptyLines: true });

        // 1. Resolve Workspace & Tier
        const userRows = await prisma.$queryRaw<any[]>`
            SELECT w.id as "workspaceId", w.subscription_plan
            FROM "User" u
            JOIN "Workspace" w ON u."workspaceId" = w.id
            WHERE u.id = ${userId}
            LIMIT 1
        `;
        const ws = userRows[0];
        if (!ws) return NextResponse.json({ error: 'No active workspace' }, { status: 400 });

        const { getTierLimits } = await import('@/lib/tiers');
        const limits = getTierLimits(ws.subscription_plan);

        // 2. Check contact count against tier limit
        const currentCount = await prisma.contact.count({ where: { userId } });
        if (currentCount >= limits.contacts) {
            return NextResponse.json({
                error: 'Contact limit reached',
                code: 'LIMIT_REACHED',
                suggestion: `Upgrade your plan to import more than ${limits.contacts} contacts.`,
            }, { status: 403 });
        }

        const remainingSpace = limits.contacts - currentCount;

        // 3. Parse and trim contacts from CSV
        let contacts = (data as any[]).map((row: any) => ({
            email: (row.email || '').trim(),
            name: (row.name || row.fullname || '').trim(),
            phone: (row.phone || '').trim() || null,
            businessName: (row.businessName || row.business_name || row.company || '').trim() || null,
            tags: row.tags
                ? row.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                : [],
        })).filter((c: any) => c.email && c.email.includes('@'));

        if (contacts.length === 0) {
            return NextResponse.json({ error: 'No valid contacts found. Make sure your CSV has an "email" column.' }, { status: 400 });
        }

        // Trim to remaining space if needed
        const totalIncoming = contacts.length;
        if (contacts.length > remainingSpace) {
            contacts = contacts.slice(0, remainingSpace);
        }

        // 4. Insert each contact using raw SQL (same pattern as createContact action)
        let inserted = 0;
        let skipped = 0;

        for (const c of contacts) {
            try {
                const id = `c${Math.random().toString(36).substring(2, 15)}`;
                const pgTags = `{${c.tags.join(',')}}`;
                await prisma.$executeRawUnsafe(
                    `INSERT INTO "Contact" (id, "userId", email, name, phone, "businessName", tags, "updatedAt", "createdAt")
                     VALUES ($1, $2, $3, $4, $5, $6, $7::text[], NOW(), NOW())
                     ON CONFLICT (email, "userId") DO NOTHING`,
                    id, userId, c.email, c.name, c.phone, c.businessName, pgTags
                );
                inserted++;
            } catch (rowErr: any) {
                // Skip duplicates or invalid rows silently
                skipped++;
            }
        }

        // 5. Clear contacts cache
        try {
            const { clearUserCache } = await import('@/lib/cache');
            clearUserCache(`contacts_intel_${userId}`);
        } catch {
            // Cache clear is non-fatal
        }

        return NextResponse.json({
            success: true,
            inserted,
            skipped,
            totalIncoming,
            cappedAt: totalIncoming > remainingSpace ? remainingSpace : null,
            message: `${inserted} contact${inserted !== 1 ? 's' : ''} imported successfully.${skipped > 0 ? ` ${skipped} skipped (duplicates or invalid).` : ''}`,
        });
    } catch (error) {
        console.error('CSV Import Error:', error);
        return NextResponse.json({ error: 'Failed to import contacts. Please check your file format.' }, { status: 500 });
    }
}
