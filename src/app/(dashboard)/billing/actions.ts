"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { logAdminAction } from "@/lib/audit";
import { redirect } from "next/navigation"

export async function createCheckoutSession(priceId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { workspace: true }
    })

    if (!user) throw new Error("User not found")

    // Get or create Stripe Customer
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email!,
            name: user.name!,
            metadata: {
                userId: user.id,
                workspaceId: user.workspaceId || ""
            }
        })
        stripeCustomerId = customer.id
        await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id }
        })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXTAUTH_URL}/billing?success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/billing?canceled=true`,
        subscription_data: {
            metadata: {
                workspaceId: user.workspaceId || "",
                userId: user.id,
                planName: priceId.includes("starter") ? "starter" : priceId.includes("growth") ? "growth" : priceId.includes("pro") ? "pro" : "free"
            }
        }
    });

    // Audit Log
    await logAdminAction({
        actorId: session.user.id,
        action: "BILLING_CHECKOUT_STARTED",
        target: { type: "workspace", id: user.workspaceId as string },
        metadata: { priceId, customerId: user.stripeCustomerId }
    });

    return { url: checkoutSession.url }
}

export async function createPortalSession() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user?.stripeCustomerId) {
        throw new Error("No active subscription found")
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXTAUTH_URL}/billing`,
    });

    // Audit Log
    await logAdminAction({
        actorId: session.user.id,
        action: "BILLING_PORTAL_STARTED",
        target: { type: "workspace", id: user.workspaceId as string },
        metadata: { customerId: user.stripeCustomerId }
    });

    return { url: portalSession.url }
}

export async function createAddonCheckoutSession(credits: number, price: number) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { workspace: true }
    })

    if (!user) throw new Error("User not found")
    if (!user.workspaceId) throw new Error("No active workspace")

    // Get or create Stripe Customer
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
            email: user.email!,
            name: user.name!,
            metadata: {
                userId: user.id,
                workspaceId: user.workspaceId
            }
        })
        stripeCustomerId = customer.id
        await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customer.id }
        })
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${credits.toLocaleString()} AI Credits`,
                        description: 'Neural allocation boost for your AI Assistant.',
                        images: ['https://raw.githubusercontent.com/lucide-react/lucide/main/icons/zap.png'],
                    },
                    unit_amount: price * 100,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.NEXTAUTH_URL}/billing?success=true&type=addon`,
        cancel_url: `${process.env.NEXTAUTH_URL}/billing?canceled=true`,
        metadata: {
            workspaceId: user.workspaceId,
            userId: user.id,
            addonType: "AI_CREDITS",
            creditAmount: credits.toString()
        }
    });

    // Audit Log
    await logAdminAction({
        actorId: session.user.id,
        action: "BILLING_CHECKOUT_STARTED",
        target: { type: "workspace", id: user.workspaceId },
        metadata: { credits, price, type: "ADDON_AI_CREDITS" }
    });

    return { url: checkoutSession.url }
}
