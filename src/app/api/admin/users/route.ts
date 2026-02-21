// GET /api/admin/users — paginated user list with search
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

    const where = search ? {
        OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { name: { contains: search, mode: "insensitive" as const } },
        ]
    } : {}

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                email: true,
                name: true,
                global_role: true,
                is_suspended: true,
                auth_provider: true,
                subscriptionPlan: true,
                createdAt: true,
                _count: {
                    select: {
                        campaigns: true,
                        contacts: true,
                    }
                }
            }
        }),
        prisma.user.count({ where }),
    ])

    return NextResponse.json({ users, total, page, limit })
})
