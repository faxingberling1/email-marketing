import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { logAdminAction } from "@/lib/audit";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const metadata = session.metadata;
        const workspaceId = metadata?.workspaceId;
        const userId = metadata?.userId;
        const addonType = metadata?.addonType;

        if (addonType === "AI_CREDITS") {
            const amount = parseInt(metadata?.creditAmount || "0");

            if (workspaceId && amount > 0) {
                await prisma.workspace.update({
                    where: { id: workspaceId },
                    data: {
                        ai_credits_remaining: { increment: amount }
                    } as any
                });

                await logAdminAction({
                    actorId: userId || "SYSTEM",
                    action: "BILLING_ADDON_PURCHASED",
                    target: { type: "workspace", id: workspaceId },
                    metadata: {
                        type: "AI_CREDITS",
                        credits: amount,
                        stripeSessionId: session.id
                    }
                });

                console.log(`[Stripe Webhook] Firing AI Credit Fulfillment: ${amount} credits for WS ${workspaceId}`);
            }
        }

        // Handle Subscription updates
        const subscriptionId = session.subscription as string;
        if (subscriptionId && !addonType) {
            // This would be for plan upgrades
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const planId = subscription.items.data[0].price.id;

            // Logic to map Stripe Price ID to local plan name
            // For now, we'll assume the metadata has the plan name if we set it in createCheckoutSession
            const planName = metadata?.planName || "pro"; // Fallback

            if (workspaceId) {
                await prisma.workspace.update({
                    where: { id: workspaceId },
                    data: {
                        subscription_plan: planName.toLowerCase(),
                    } as any
                });

                await logAdminAction({
                    actorId: userId || "SYSTEM",
                    action: "WORKSPACE_PLAN_CHANGED",
                    target: { type: "workspace", id: workspaceId },
                    metadata: { plan: planName, stripeSubscriptionId: subscriptionId }
                });
            }
        }
    }

    return new NextResponse(null, { status: 200 });
}
