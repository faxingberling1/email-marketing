import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

const ADMIN_UI_PREFIX = "/admin"
const ADMIN_API_PREFIX = "/api/admin"

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth
    const user = req.auth?.user as any

    // ── Admin Security Enforcement (Edge Layer) ───────────────────────────
    if (pathname.startsWith(ADMIN_UI_PREFIX) || pathname.startsWith(ADMIN_API_PREFIX)) {
        const isApi = pathname.startsWith(ADMIN_API_PREFIX)

        if (!isLoggedIn) {
            if (isApi) return Response.json({ error: "Unauthenticated" }, { status: 401 })
            return Response.redirect(new URL("/login", req.url))
        }

        const role = user?.global_role
        const suspended = user?.is_suspended

        // Block suspended users or non-admins
        if (suspended || role !== "super_admin") {
            const errorMsg = suspended ? "Account suspended" : "Forbidden: super_admin role required"

            if (isApi) return Response.json({ error: errorMsg }, { status: 403 })
            return Response.redirect(new URL("/dashboard", req.url))
        }
    }
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
