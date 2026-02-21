import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { logAdminAction } from "@/lib/audit"

export const POST = withAdminGuard(async (req: NextRequest, adminUser) => {
    // Log the end of the session
    await logAdminAction({
        actorId: adminUser.id || 'system',
        action: "IMPERSONATION_ENDED",
        target: { type: "system", id: "impersonation" },
        metadata: { adminEmail: adminUser.email },
        req
    })

    const adminUrl = new URL("/admin/workspaces", req.url)
    const response = NextResponse.redirect(adminUrl)

    response.cookies.delete("impersonation_token")
    response.cookies.delete("admin_impersonating_workspace_id")
    response.cookies.delete("admin_impersonating_workspace_name")

    return response
})
