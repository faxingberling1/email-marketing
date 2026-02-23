"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

async function verifySuperAdmin() {
    const session = await auth()
    if (!session || (session.user as any)?.global_role !== "super_admin") {
        throw new Error("Unauthorized: Super-Admin clearance required.")
    }
    return session.user
}

export async function createWorkspaceProtocol(name: string) {
    const user = await verifySuperAdmin()

    try {
        const workspace = await prisma.workspace.create({
            data: {
                name,
                ownerId: user.id, // Default to creator if no owner specified
                subscription_plan: "enterprise",
                subscription_status: "active",
                ai_credits_remaining: 5000,
            }
        })
        revalidatePath("/admin")
        return { success: true, workspace }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function allocateAiCreditsProtocol(workspaceId: string, amount: number) {
    await verifySuperAdmin()

    try {
        const workspace = await prisma.workspace.update({
            where: { id: workspaceId },
            data: {
                ai_credits_remaining: {
                    increment: amount
                }
            }
        })
        revalidatePath("/admin")
        return { success: true, workspace }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function broadcastAnnouncementProtocol(message: string) {
    const user = await verifySuperAdmin()

    try {
        await prisma.systemSetting.upsert({
            where: { key: "global_announcement" },
            update: {
                value: message,
                updatedById: user.id
            },
            create: {
                key: "global_announcement",
                value: message,
                updatedById: user.id,
                type: "string",
                description: "Global system announcement displayed to all users."
            }
        })
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function toggleMaintenanceModeProtocol(enabled: boolean) {
    const user = await verifySuperAdmin()

    try {
        await prisma.systemSetting.upsert({
            where: { key: "maintenance_mode" },
            update: {
                value: enabled ? "true" : "false",
                updatedById: user.id
            },
            create: {
                key: "maintenance_mode",
                value: enabled ? "true" : "false",
                updatedById: user.id,
                type: "boolean",
                description: "Controls system-wide maintenance mode."
            }
        })
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getWorkspacesProtocol() {
    await verifySuperAdmin()
    try {
        const workspaces = await prisma.workspace.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        })
        return { success: true, workspaces }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
