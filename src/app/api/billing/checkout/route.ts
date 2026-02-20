import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const { priceId, customerId } = await req.json();

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=cancel`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}
