"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

import { getStripe } from "@/lib/stripe"

export async function purchaseAddon(addonId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    let creditAmount = 0
    let priceCents = 0
    let name = ""
    
    if (addonId === 'ai_100') { creditAmount = 100; priceCents = 1000; name = "100 AI Credits"; }
    else if (addonId === 'ai_500') { creditAmount = 500; priceCents = 4500; name = "500 AI Credits"; }
    else if (addonId === 'ai_2000') { creditAmount = 2000; priceCents = 15000; name = "2,000 AI Credits"; }

    if (creditAmount === 0) throw new Error("Invalid Addon Package")

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { email: true, stripeCustomerId: true }
        })

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const stripe = getStripe()
        
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user?.stripeCustomerId ? undefined : (user?.email || undefined),
            customer: user?.stripeCustomerId || undefined,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: name,
                            description: `One-time purchase of ${name}`,
                        },
                        unit_amount: priceCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/api/billing/success?session_id={CHECKOUT_SESSION_ID}&addon=${addonId}`,
            cancel_url: `${baseUrl}/billing`,
        })

        return { success: true, url: stripeSession.url }
    } catch (error) {
        console.error("Purchase Error:", error)
        throw new Error("Financial relay failed during credit replenishment")
    }
}
