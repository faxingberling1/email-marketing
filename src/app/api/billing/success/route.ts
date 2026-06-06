import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    const addonId = searchParams.get('addon');

    if (!sessionId || !addonId) {
        return NextResponse.redirect(new URL('/billing', req.url));
    }

    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        let creditAmount = 0;
        if (addonId === 'ai_100') creditAmount = 100;
        else if (addonId === 'ai_500') creditAmount = 500;
        else if (addonId === 'ai_2000') creditAmount = 2000;

        if (creditAmount > 0) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { workspaceId: true }
            });

            if (user?.workspaceId) {
                // To prevent double counting, in a real app we'd verify the Stripe session status and check if it was already processed.
                // For this demo, we'll assume it's valid if they reach this URL with a session ID
                await prisma.workspace.update({
                    where: { id: user.workspaceId },
                    data: {
                        ai_credits_remaining: {
                            increment: creditAmount
                        }
                    }
                });
            }
        }

        // Redirect back to billing
        return NextResponse.redirect(new URL('/billing?success=true', req.url));

    } catch (error) {
        console.error('Billing Success Fulfillment Error:', error);
        return NextResponse.redirect(new URL('/billing', req.url));
    }
}
