import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { PRICING_PLANS } from '@/lib/pricing';

export async function POST(req: Request) {
    try {
        const { planName, workspaceId, userId, customerEmail } = await req.json();

        // 1. Resolve Price ID from Plan Name
        const plan = Object.values(PRICING_PLANS).find(p => p.name.toLowerCase() === planName.toLowerCase());

        if (!plan) {
            return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
        }

        // 2. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: plan.priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?billing=cancel`,
            customer_email: customerEmail,
            metadata: {
                workspaceId,
                userId,
                planName: plan.name,
            },
            subscription_data: {
                metadata: {
                    workspaceId,
                    userId,
                    planName: plan.name,
                },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}
