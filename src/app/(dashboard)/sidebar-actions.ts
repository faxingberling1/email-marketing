"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getWorkspaceQuotas } from "@/lib/services/usage-enforcement";
import { ensureUserWorkspace } from "@/app/auth/actions";

export async function getSidebarData() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = session.user.id;

    try {
        const users = await prisma.$queryRaw`SELECT "workspaceId", "global_role" FROM "User" WHERE id = ${userId} LIMIT 1` as any[]
        const user = users?.[0]

        if (!user) return null;

        // Auto-heal: ensure this user always has a workspace
        const workspaceId = await ensureUserWorkspace(userId);

        const quotas = await getWorkspaceQuotas(workspaceId);

        // Fetch dynamic counts for badges
        const [contactCountRaw, campaignCountRaw, recentLogs] = await Promise.all([
            prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "Contact" WHERE "userId" IN (SELECT id FROM "User" WHERE "workspaceId" = ${workspaceId})` as Promise<any[]>,
            prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "Campaign" WHERE "userId" = ${userId}` as Promise<any[]>,
            prisma.$queryRaw`SELECT * FROM "AuditLog" WHERE "target_id" = ${user.workspaceId} ORDER BY "created_at" DESC LIMIT 5` as Promise<any[]>
        ]);

        const contactCount = contactCountRaw?.[0]?.count || 0;
        const campaignCount = campaignCountRaw?.[0]?.count || 0;

        return {
            quotas,
            counts: {
                contacts: contactCount,
                campaigns: campaignCount,
            },
            notifications: recentLogs.map((log: any) => ({
                id: log.id,
                title: log.action_type.replace(/_/g, " "),
                desc: `Action recorded on ${log.target_type}`,
                time: log.created_at,
                type: log.action_type.includes("ERROR") ? "error" : "info"
            })),
            role: user.global_role
        };
    } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
        return null;
    }
}

/** Lightweight fetch just for the Plan Details Modal — always returns fresh data. */
export async function getPlanModalData() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = session.user.id;
    try {
        const users = await prisma.$queryRaw`SELECT "workspaceId", "subscriptionPlan" FROM "User" WHERE id = ${userId} LIMIT 1` as any[]
        const user = users?.[0]

        // Count contacts directly by userId — most reliable regardless of workspace setup
        const [contactCountRaw, campaignCountRaw] = await Promise.all([
            prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "Contact" WHERE "userId" = ${userId}` as Promise<any[]>,
            prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "Campaign" WHERE "userId" = ${userId}` as Promise<any[]>,
        ]);

        const contactCount = contactCountRaw?.[0]?.count || 0;
        const campaignCount = campaignCountRaw?.[0]?.count || 0;

        // If no workspace, still return useful data based on subscription plan
        if (!user?.workspaceId) {
            return {
                quotas: null,
                counts: { contacts: contactCount, campaigns: campaignCount },
                plan: (user?.subscriptionPlan ?? 'free') as string,
            };
        }

        const quotas = await getWorkspaceQuotas(user.workspaceId).catch(() => null);

        return {
            quotas,
            counts: { contacts: contactCount, campaigns: campaignCount },
            plan: user.subscriptionPlan ?? quotas?.plan ?? 'free',
        };
    } catch (error) {
        console.warn("getPlanModalData error:", error);
        return null;
    }
}
