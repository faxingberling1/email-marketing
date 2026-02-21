// POST /api/admin/users/[id]/demote — remove super_admin role
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { logAdminAction } from "@/lib/audit"
import { prisma } from "@/lib/db"

export const POST = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[5]

    // Prevent self-demotion
    if (id === adminUser.id) {
        return NextResponse.json({ error: "Cannot demote yourself" }, { status: 400 })
    }

    const target = await (prisma as any).user.findUnique({ where: { id } })
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (target.global_role !== "super_admin") {
        return NextResponse.json({ error: "User is not a super_admin" }, { status: 400 })
    }

    // Prevent removing the last super_admin
    const superAdminCount = await (prisma as any).user.count({ where: { global_role: "super_admin" } })
    if (superAdminCount <= 1) {
        return NextResponse.json({ error: "Cannot demote the last super_admin" }, { status: 400 })
    }

    const updated = await (prisma as any).user.update({
        where: { id },
        data: { global_role: "user" },
        select: { id: true, email: true, name: true, global_role: true },
    })

    await logAdminAction({
        actorId: adminUser.id,
        action: "USER_DEMOTED",
        target: { type: "user", id },
        metadata: { email: target.email },
        req
    })

    return NextResponse.json({ user: updated })
})
