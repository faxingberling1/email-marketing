// src/lib/admin-guard.ts
// Server-side guard — verifies global_role from the DATABASE, never trusts the JWT alone.
// Used by every /api/admin/* route handler.

import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"
import { GlobalRole } from "@prisma/client"

export class AdminGuardError extends Error {
    constructor(
        public readonly status: number,
        message: string
    ) {
        super(message)
        this.name = "AdminGuardError"
    }
}

export async function requireSuperAdmin() {
    const session = await auth()

    if (!session?.user?.id) {
        throw new AdminGuardError(401, "Unauthenticated")
    }

    // Always re-fetch from DB — never trust the JWT alone
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            email: true,
            name: true,
            global_role: true,
            is_suspended: true,
        },
    })

    if (!user) {
        throw new AdminGuardError(401, "User not found")
    }

    if (user.is_suspended) {
        throw new AdminGuardError(403, "Account suspended")
    }

    if (user.global_role !== GlobalRole.super_admin) {
        throw new AdminGuardError(403, "Forbidden: super_admin role required")
    }

    return user
}

/**
 * Wraps a route handler with the super admin guard + error handling.
 * Usage: export const GET = withAdminGuard(async (req, adminUser) => { ... })
 */
export function withAdminGuard(
    handler: (req: NextRequest, adminUser: Awaited<ReturnType<typeof requireSuperAdmin>>) => Promise<NextResponse>
) {
    return async (req: NextRequest) => {
        try {
            const adminUser = await requireSuperAdmin()
            return await handler(req, adminUser)
        } catch (err) {
            if (err instanceof AdminGuardError) {
                return NextResponse.json(
                    { error: err.message },
                    { status: err.status }
                )
            }
            console.error("[Admin] Unhandled error:", err)
            return NextResponse.json({ error: "Internal server error" }, { status: 500 })
        }
    }
}
