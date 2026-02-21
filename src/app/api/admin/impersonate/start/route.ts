// POST /api/admin/impersonate/start
// Sets an httpOnly cookie identifying the impersonated workspace.
// Does NOT swap the admin's session — the admin remains authenticated as themselves.
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { logAdminAction } from "@/lib/audit"
import { prisma } from "@/lib/db"

import { signImpersonationToken } from "@/lib/impersonation"

export const POST = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const body = await req.json()
    const { workspaceId } = body

    if (!workspaceId) {
        return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { id: true, name: true },
    })

    if (!workspace) {
        return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Create signed token
    const token = signImpersonationToken({
        adminId: adminUser.id || 'unknown',
        adminEmail: adminUser.email || 'unknown',
        workspaceId: workspace.id,
        workspaceName: workspace.name,
        expiresAt: Date.now() + (1000 * 60 * 60 * 2), // 2 hours
    })

    await logAdminAction({
        actorId: adminUser.id || 'system',
        action: "IMPERSONATION_STARTED",
        target: { type: "workspace", id: workspaceId },
        metadata: {
            workspaceName: workspace.name,
            adminEmail: adminUser.email,
            impersonationTokenHash: "active-signed-session"
        },
        req
    })

    const response = NextResponse.json({ ok: true, workspace })

    // Secure token cookie
    response.cookies.set("impersonation_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 2,
    })

    // Legacy/UI cookie (for banner only)
    response.cookies.set("admin_impersonating_workspace_name", workspace.name, {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 2,
    })

    return response
})
