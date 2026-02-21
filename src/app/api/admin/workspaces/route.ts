// GET /api/admin/workspaces — paginated workspace list
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { prisma } from "@/lib/db"

export const GET = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const { searchParams } = req.nextUrl
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"))
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "25"))
    const search = searchParams.get("search") ?? ""
    const health = searchParams.get("health") ?? ""
    const includeDeleted = searchParams.get("include_deleted") === "1"
    const offset = (page - 1) * limit

    // Use $queryRaw to bypass stale Prisma types (deleted_at not in generated client yet)
    type WsRow = {
        id: string; name: string
        subscription_plan: string; subscription_status: string
        ai_credits_remaining: number; email_limit_remaining: number
        total_ai_used: number; total_emails_sent: number
        health_status: string; deleted_at: Date | null; createdAt: Date
        owner_id: string | null; owner_name: string | null; owner_email: string | null
        member_count: bigint
    }

    // Build raw SQL with optional filters
    // Parameterised via Prisma.sql tagged template to prevent SQL injection
    const { Prisma } = await import("@prisma/client")

    const searchFilter = search
        ? Prisma.sql`AND w.name ILIKE ${"%" + search + "%"}`
        : Prisma.empty
    const healthFilter = health
        ? Prisma.sql`AND w.health_status = ${health}`
        : Prisma.empty
    const deletedFilter = includeDeleted
        ? Prisma.empty
        : Prisma.sql`AND w.deleted_at IS NULL`

    const rows = await prisma.$queryRaw<WsRow[]>`
        SELECT
            w.id, w.name,
            w.subscription_plan, w.subscription_status,
            w.ai_credits_remaining, w.email_limit_remaining,
            w.total_ai_used, w.total_emails_sent,
            w.health_status, w.deleted_at, w."createdAt",
            w."ownerId" AS owner_id,
            u.name    AS owner_name,
            u.email   AS owner_email,
            COUNT(wm.id) AS member_count
        FROM "Workspace" w
        LEFT JOIN "User" u ON u.id = w."ownerId"
        LEFT JOIN "WorkspaceMember" wm ON wm."workspaceId" = w.id
        WHERE 1=1
        ${searchFilter}
        ${healthFilter}
        ${deletedFilter}
        GROUP BY w.id, u.name, u.email
        ORDER BY w."createdAt" DESC
        LIMIT ${limit} OFFSET ${offset}
    `

    const countRows = await prisma.$queryRaw<[{ total: bigint }]>`
        SELECT COUNT(*) AS total
        FROM "Workspace" w
        WHERE 1=1
        ${searchFilter}
        ${healthFilter}
        ${deletedFilter}
    `

    const total = Number(countRows[0]?.total ?? 0)

    // Shape into the same format the UI expects
    const workspaces = rows.map(r => ({
        id: r.id, name: r.name,
        subscription_plan: r.subscription_plan,
        subscription_status: r.subscription_status,
        ai_credits_remaining: r.ai_credits_remaining,
        email_limit_remaining: r.email_limit_remaining,
        total_ai_used: r.total_ai_used,
        total_emails_sent: r.total_emails_sent,
        health_status: r.health_status,
        deleted_at: r.deleted_at,
        createdAt: r.createdAt,
        owner: r.owner_id
            ? { id: r.owner_id, name: r.owner_name ?? undefined, email: r.owner_email ?? "" }
            : null,
        _count: { members: Number(r.member_count) },
    }))

    return NextResponse.json({ workspaces, total, page, limit })
})
