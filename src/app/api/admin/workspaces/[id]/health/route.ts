// PATCH /api/admin/workspaces/[id]/health
// Body: { health_status: "HEALTHY" | "RISKY" | "CRITICAL" | "SUSPENDED" }
import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { checkRateLimit } from "@/lib/rate-limit"
import { createAuditLog } from "@/lib/audit"
import { prisma } from "@/lib/db"

const VALID = ["HEALTHY", "RISKY", "CRITICAL", "SUSPENDED"]

export const PATCH = withAdminGuard(async (req: NextRequest, adminUser) => {
    const rl = checkRateLimit(adminUser.id)
    if (!rl.ok) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })

    const id = req.nextUrl.pathname.split("/")[4]
    const body = await req.json()
    const health = body.health_status

    if (!VALID.includes(health)) {
        return NextResponse.json({ error: `Invalid health_status. Must be one of: ${VALID.join(", ")}` }, { status: 400 })
    }

    const workspace = await (prisma as any).workspace.findUnique({ where: { id } })
    if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 })

    const updated = await (prisma as any).workspace.update({
        where: { id },
        data: { health_status: health } as any,
    })

    await createAuditLog({
        actorId: adminUser.id,
        action_type: "WORKSPACE_HEALTH_CHANGED",
        target_type: "workspace",
        target_id: id,
        metadata: {
            from: (workspace as any).health_status,
            to: health,
            workspaceName: (workspace as any).name
        },
    })

    return NextResponse.json({ workspace: updated })
})
