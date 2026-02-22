"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function unsubscribeContact(contactId: string) {
    if (!contactId) throw new Error("Invalid signal ID")

    try {
        await (prisma.contact as any).update({
            where: { id: contactId },
            data: {
                subscribed: false,
                unsubscribedAt: new Date()
            }
        })

        revalidatePath("/(dashboard)/contacts")
        return { success: true }
    } catch (error) {
        console.error("Unsubscribe Error:", error)
        throw new Error("Critical failure during signal detachment")
    }
}
