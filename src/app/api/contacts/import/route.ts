import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

// Email validation regex (RFC 5322 compliant-ish)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export async function POST(req: Request) {
    try {
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
        const { data } = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: 'greedy',
            transform: (value) => value.trim()
        });

        // 1. Resolve Workspace & Tier
        const user = await (prisma as any).user.findUnique({
            where: { id: userId },
            include: {
                workspace: true,
                ownedWorkspaces: { take: 1 },
                workspaceMemberships: { include: { workspace: true }, take: 1 }
            }
        });

        let ws: any = user?.workspace
            || user?.ownedWorkspaces?.[0]
            || user?.workspaceMemberships?.[0]?.workspace;

        if (!ws) {
            ws = { subscription_plan: 'free' };
        }

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

        // 3. Batch Validation & Sanitization
        let contacts = (data as any[]).map((row: any) => {
            const email = (row.email || '').toLowerCase();
            const isValid = EMAIL_REGEX.test(email);

            if (!isValid) return null;

            return {
                id: `c${Math.random().toString(36).substring(2, 15)}`,
                userId,
                email,
                name: row.name || row.fullname || null,
                phone: row.phone || null,
                businessName: row.businessName || row.business_name || row.company || null,
                tags: row.tags
                    ? row.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                    : [],
            };
        }).filter(Boolean) as any[];

        if (contacts.length === 0) {
            return NextResponse.json({ error: 'No valid contacts found. Ensure your CSV has an "email" column with valid addresses.' }, { status: 400 });
        }

        // Tier capping
        const totalIncoming = contacts.length;
        if (contacts.length > remainingSpace) {
            contacts = contacts.slice(0, remainingSpace);
        }

        // 4. High-Performance Bulk Insert (Batch size of 500)
        let inserted = 0;
        const BATCH_SIZE = 500;

        for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
            const batch = contacts.slice(i, i + BATCH_SIZE);

            // Build the values string for raw SQL
            // format: ($1, $2, ...), ($8, $9, ...)
            const values: any[] = [];
            const placeholders = batch.map((_, idx) => {
                const offset = idx * 7;
                values.push(
                    batch[idx].id,
                    batch[idx].userId,
                    batch[idx].email,
                    batch[idx].name,
                    batch[idx].phone,
                    batch[idx].businessName,
                    batch[idx].tags
                );
                return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}::text[])`;
            }).join(', ');

            const query = `
                INSERT INTO "Contact" (id, "userId", email, name, phone, "businessName", tags, "updatedAt", "createdAt")
                VALUES ${placeholders}
                ON CONFLICT (email, "userId") DO NOTHING
            `;

            const result = await prisma.$executeRawUnsafe(query, ...values);
            inserted += Number(result);
        }

        const skipped = totalIncoming - inserted;

        // 5. Clear contacts cache
        try {
            const { clearUserCache } = await import('@/lib/cache');
            clearUserCache(`contacts_intel_${userId}`);
        } catch {
            // Non-fatal
        }

        return NextResponse.json({
            success: true,
            inserted,
            skipped: Math.max(0, skipped),
            totalIncoming,
            cappedAt: totalIncoming > remainingSpace ? remainingSpace : null,
            message: `${inserted} contact${inserted !== 1 ? 's' : ''} imported successfully.${skipped > 0 ? ` ${skipped} were skipped (duplicates, invalid, or limit reached).` : ''}`,
        });
    } catch (error) {
        console.error('CSV Import Error:', error);
        return NextResponse.json({ error: 'Internal server error during ingestion process.' }, { status: 500 });
    }
}
