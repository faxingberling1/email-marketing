// POST /api/admin/users/[id]/suspend
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { logAdminAction } from "@/lib/audit"
import { prisma } from "@/lib/db"

export const POST = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[5]

    // Prevent self-suspension
    if (id === adminUser.id) {
        return NextResponse.json({ error: "Cannot suspend your own account" }, { status: 400 })
    }

    const target = await (prisma as any).user.findUnique({ where: { id } })
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // Prevent suspending the last super_admin
    if (target.global_role === "super_admin") {
        const superAdminCount = await (prisma as any).user.count({ where: { global_role: "super_admin", is_suspended: false } })
        if (superAdminCount <= 1) {
            return NextResponse.json({ error: "Cannot suspend the last active super_admin" }, { status: 400 })
        }
    }

    const updated = await (prisma as any).user.update({
        where: { id },
        data: { is_suspended: true },
        select: { id: true, email: true, name: true, is_suspended: true, global_role: true },
    })

    await logAdminAction({
        actorId: adminUser.id,
        action: "USER_SUSPENDED",
        target: { type: "user", id },
        metadata: { email: target.email },
        req
    })

    return NextResponse.json({ user: updated })
})
