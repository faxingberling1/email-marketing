"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getWorkspaceQuotas } from "@/lib/services/usage-enforcement";

export async function getSidebarData() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const userId = session.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { workspaceId: true, global_role: true } as any
        }) as any;

        if (!user?.workspaceId) return null;

        const quotas = await getWorkspaceQuotas(user.workspaceId);

        // Fetch dynamic counts for badges
        const [contactCount, campaignCount, recentLogs] = await Promise.all([
            prisma.contact.count({ where: { user: { workspaceId: user.workspaceId } } }),
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
