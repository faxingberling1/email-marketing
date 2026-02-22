"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function purchaseAddon(addonId: string) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    // In a real implementation, this would trigger a Stripe Checkout Session
    // For this tactical demo, we'll simulate a successful purchase logic

    let creditAmount = 0
    if (addonId === 'ai_100') creditAmount = 100
    else if (addonId === 'ai_500') creditAmount = 500
    else if (addonId === 'ai_2000') creditAmount = 2000

    if (creditAmount === 0) throw new Error("Invalid Addon Package")

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { workspaceId: true }
        })

        if (!user?.workspaceId) throw new Error("Workspace not found")

        await (prisma as any).workspace.update({
            where: { id: user.workspaceId },
            data: {
                ai_credits_remaining: {
                    increment: creditAmount
                }
            }
        })

        revalidatePath("/(dashboard)/billing")
        revalidatePath("/(dashboard)/dashboard")
        return { success: true, amount: creditAmount }
    } catch (error) {
        console.error("Purchase Error:", error)
        throw new Error("Financial relay failed during credit replenishment")
    }
}
