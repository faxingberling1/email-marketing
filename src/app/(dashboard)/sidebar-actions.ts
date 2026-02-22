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
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { workspaceId: true, global_role: true } as any
        }) as any;

        if (!user) return null;

        // Auto-heal: ensure this user always has a workspace
        const workspaceId = await ensureUserWorkspace(userId);

        const quotas = await getWorkspaceQuotas(workspaceId);

        // Fetch dynamic counts for badges
        const [contactCount, campaignCount, recentLogs] = await Promise.all([
            prisma.contact.count({ where: { user: { workspaceId } } }),
            prisma.campaign.count({ where: { userId } }),
            (prisma as any).auditLog.findMany({
                where: { target_id: user.workspaceId },
                orderBy: { created_at: "desc" },
                take: 5
            })
        ]);

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
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                workspaceId: true,
                subscriptionPlan: true,
            } as any
        }) as any;

        // Count contacts directly by userId — most reliable regardless of workspace setup
        const [contactCount, campaignCount] = await Promise.all([
            prisma.contact.count({ where: { userId } }),
            prisma.campaign.count({ where: { userId } }),
        ]);

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
