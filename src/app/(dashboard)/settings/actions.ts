"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { ensureUserWorkspace } from "@/app/auth/actions"
import { getWorkspaceQuotas } from "@/lib/services/usage-enforcement"
import { TIER_CONFIG, SubscriptionTier } from "@/lib/tiers"
import { revalidatePath } from "next/cache"

export async function getSettingsData() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const userId = session.user.id
    const workspaceId = await ensureUserWorkspace(userId)

    const [user, userAiRaw, quotas, contactCount, campaignCount] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                subscriptionPlan: true,
                createdAt: true,
            }
        }),
        prisma.$queryRaw`SELECT "aiDefaultLanguage", "aiDefaultTone", "aiEngagementThreshold", "aiAutoOptimize" FROM "User" WHERE id = ${userId}` as Promise<any[]>,
        getWorkspaceQuotas(workspaceId).catch(() => null),
        prisma.contact.count({ where: { userId } }),
        prisma.campaign.count({ where: { userId } }),
    ])

    if (!user) throw new Error("User not found")
    const aiRaw = userAiRaw?.[0] || {}

    const plan = (user.subscriptionPlan || 'free').toLowerCase() as SubscriptionTier
    const limits = TIER_CONFIG[plan] || TIER_CONFIG.free

    const emailsUsed = quotas?.emails
        ? quotas.emails.limit - quotas.emails.remaining
        : 0
    const emailUsagePct = quotas?.emails
        ? Math.round((emailsUsed / quotas.emails.limit) * 100)
        : 0

    const aiUsed = quotas?.ai
        ? quotas.ai.limit - quotas.ai.remaining
        : 0
    const aiUsagePct = quotas?.ai
        ? Math.round((aiUsed / quotas.ai.limit) * 100)
        : 0

    const planLabels: Record<string, string> = {
        free: "Free Plan", starter: "Starter Plan", growth: "Growth Plan",
        pro: "Pro Plan", enterprise: "Enterprise Plan"
    }

    return {
        profile: {
            name: user.name || "",
            email: user.email || "",
            avatar: user.image || null,
            memberSince: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : "Unknown",
        },
        subscription: {
            planKey: plan,
            plan: planLabels[plan] || "Free Plan",
            emailLimit: limits.emails_per_month,
            emailsUsed,
            emailUsagePct,
            aiCreditsLimit: limits.ai_credits_per_month,
            aiCreditsUsed: aiUsed,
            aiUsagePct,
            contactsUsed: contactCount,
            contactsLimit: limits.contacts,
            campaignCount,
            features: limits.features,
        },
        integrations: [
            { id: "i1", name: "HubSpot CRM", status: "Connected", lastSync: "12m ago" },
            { id: "i2", name: "Slack Alerts", status: "Active", lastSync: "2h ago" },
            { id: "i3", name: "Twilio SMS", status: "Pending", lastSync: "Never" },
        ],
        aiPreferences: {
            defaultLanguage: aiRaw.aiDefaultLanguage || "English",
            defaultTone: aiRaw.aiDefaultTone || "Professional",
            engagementThreshold: aiRaw.aiEngagementThreshold || 75,
            autoOptimize: aiRaw.aiAutoOptimize ?? true,
        },
        domains: [
            { domain: "mg.antigravity.ai", status: "Verified", spf: true, dkim: true },
            { domain: "mail.tactical.io", status: "Attention Required", spf: true, dkim: false },
        ]
    }
}

export async function updateProfile(data: { name: string; email: string }) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const { name, email } = data
    try {
        await (prisma as any).user.update({
            where: { id: session.user.id },
            data: { name: name.trim() || null, email: email.trim() }
        })
        revalidatePath("/settings")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: "Failed to save changes" }
    }
}

export async function updateAISettings(data: {
    defaultLanguage?: string
    defaultTone?: string
    engagementThreshold?: number
    autoOptimize?: boolean
}) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    try {
        await (prisma as any).user.update({
            where: { id: session.user.id },
            data: {
                ...(data.defaultLanguage && { aiDefaultLanguage: data.defaultLanguage }),
                ...(data.defaultTone && { aiDefaultTone: data.defaultTone }),
                ...(data.engagementThreshold !== undefined && { aiEngagementThreshold: data.engagementThreshold }),
                ...(data.autoOptimize !== undefined && { aiAutoOptimize: data.autoOptimize }),
            }
        })
        revalidatePath("/settings")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: "Failed to save AI preferences" }
    }
}

export async function syncIntegration(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { success: false }

    // Mock a sync delay for realism
    await new Promise(resolve => setTimeout(resolve, 2000))
    return { success: true, timestamp: new Date().toISOString() }
}
