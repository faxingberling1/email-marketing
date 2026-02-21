// POST /api/admin/users/[id]/reactivate — un-suspend a user
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

    const updated = await (prisma as any).user.update({
        where: { id },
        data: { is_suspended: false },
        select: { id: true, email: true, name: true, is_suspended: true, global_role: true },
    })

    await logAdminAction({
        actorId: adminUser.id,
        action: "USER_REACTIVATED",
        target: { type: "user", id },
        metadata: { email: target.email },
        req
    })

    return NextResponse.json({ user: updated })
})
