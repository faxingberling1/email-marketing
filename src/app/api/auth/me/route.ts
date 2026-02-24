// GET /api/auth/me — returns the authenticated user's role for post-login redirect
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ role: null }, { status: 401 })

    // Use $queryRaw to avoid stale Prisma client type mismatch during dev
    // (global_role column exists in DB but types regenerate on server restart)
    const rows = await prisma.$queryRaw<{ global_role: string; onboardingCompleted: boolean; is_suspended: boolean }[]>`
        SELECT global_role, "onboardingCompleted", is_suspended FROM "User" WHERE id = ${session.user.id} LIMIT 1
    `

    const user = rows[0]
    if (!user) return NextResponse.json({ role: null }, { status: 404 })

    return NextResponse.json({
        role: user.global_role,
        onboardingCompleted: user.onboardingCompleted
    })
}
