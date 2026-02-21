"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function getSettingsData() {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) throw new Error("User not found")

    const planMapping: Record<string, string> = {
        starter: "Starter Plan",
        growth: "Growth Plan",
        pro: "Pro Plan",
        enterprise: "Enterprise Plan",
        free: "Free Plan"
    }

    const planName = planMapping[user.subscriptionPlan.toLowerCase()] || "Free Plan"

    return {
        profile: {
            name: user.name || "User",
            email: user.email,
            role: "Marketing Director", // Placeholder or fetch if you have a role field
            avatar: user.image
        },
        subscription: {
            plan: planName,
            usage: 42, // Mock for now until we have usage tracking
            nextBilling: "March 20, 2026",
            limit: user.subscriptionPlan === "pro" ? "200,000 Emails" : "10,000 Emails"
        },
        integrations: [
            { id: "i1", name: "HubSpot CRM", status: "Connected", lastSync: "12m ago" },
            { id: "i2", name: "Slack Alerts", status: "Active", lastSync: "2h ago" },
            { id: "i3", name: "Twilio SMS", status: "Pending", lastSync: "Never" },
        ],
        aiPreferences: {
            defaultLanguage: "English",
            defaultTone: "Professional",
            engagementThreshold: 75,
            autoOptimize: true
        },
        domains: [
            { domain: "mg.antigravity.ai", status: "Verified", spf: true, dkim: true },
            { domain: "mail.tactical.io", status: "Attention Required", spf: true, dkim: false },
        ]
    };
}

export async function updateAIThreshold(threshold: number) {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return { success: true, newThreshold: threshold };
}

export async function getDomainOptimization() {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        suggestedDomain: 'relay.antigravity.ai',
        benefit: '+4.2% Deliverability potential',
        risk: 'Minimal (Auto-warming enabled)'
    };
}

export async function syncIntegration(id: string) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { success: true, timestamp: new Date().toISOString() };
}
