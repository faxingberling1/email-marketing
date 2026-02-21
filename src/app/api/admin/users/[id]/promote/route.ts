// POST /api/admin/users/[id]/promote — set global_role = super_admin
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { logAdminAction } from "@/lib/audit"
import { prisma } from "@/lib/db"

export const POST = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[5]

    const target = await (prisma as any).user.findUnique({ where: { id } })
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (target.global_role === "super_admin") {
        return NextResponse.json({ error: "User is already a super_admin" }, { status: 400 })
    }

    const updated = await (prisma as any).user.update({
        where: { id },
        data: { global_role: "super_admin" },
        select: { id: true, email: true, name: true, global_role: true },
    })

    await logAdminAction({
        actorId: adminUser.id,
        action: "USER_PROMOTED",
        target: { type: "user", id },
        metadata: { email: target.email, promotedBy: adminUser.email },
        req
    })

    return NextResponse.json({ user: updated })
})
