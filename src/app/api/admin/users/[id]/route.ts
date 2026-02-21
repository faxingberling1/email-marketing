// GET /api/admin/users/[id] — returns detailed user info, workspaces, and audit logs
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"

export const GET = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[4]

    // Fetch user details using raw query for resilience
    const userRows = await prisma.$queryRaw<any[]>`
        SELECT id, email, name, image, global_role, is_suspended, auth_provider, "subscriptionPlan", "createdAt", "onboardingCompleted"
        FROM "User"
        WHERE id = ${id}
        LIMIT 1
    `
    const userBase = userRows[0]
    if (!userBase) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Fetch workspace memberships with workspace details via raw JOIN
    const memberships = await prisma.$queryRaw<any[]>`
        SELECT 
            wm.id as "membershipId", 
            wm.role, 
            w.id, 
            w.name, 
            w.subscription_plan, 
            w.subscription_status, 
            w.health_status
        FROM "WorkspaceMember" wm
        JOIN "Workspace" w ON wm."workspaceId" = w.id
        WHERE wm."userId" = ${id}
    `
    // Map to expected structure
    const formattedMemberships = memberships.map(m => ({
        id: m.membershipId,
        role: m.role,
        workspace: {
            id: m.id,
            name: m.name,
            subscription_plan: m.subscription_plan,
            subscription_status: m.subscription_status,
            health_status: m.health_status
        }
    }))

    // Fetch counts - raw is safer
    const campaignsRows = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*)::bigint as count FROM "Campaign" WHERE "userId" = ${id}`
    const contactsRows = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*)::bigint as count FROM "Contact" WHERE "userId" = ${id}`

    const user = {
        ...userBase,
        _count: {
            campaigns: Number(campaignsRows[0]?.count ?? 0),
            contacts: Number(contactsRows[0]?.count ?? 0)
        },
        workspaceMemberships: formattedMemberships
    }

    // Fetch recent audit logs for this user (as actor OR target) - RAW
    const auditLogs = await prisma.$queryRaw<any[]>`
        SELECT al.*, u.name as "actor_name", u.email as "actor_email"
        FROM "AuditLog" al
        LEFT JOIN "User" u ON al."actorId" = u.id
        WHERE al."actorId" = ${id} OR (al.target_id = ${id} AND al.target_type = 'user')
        ORDER BY al.created_at DESC
        LIMIT 20
    `
    // Format actor for frontend
    const formattedLogs = auditLogs.map(l => ({
        ...l,
        actor: { name: l.actor_name, email: l.actor_email }
    }))

    return NextResponse.json({ user, auditLogs: formattedLogs })
})


