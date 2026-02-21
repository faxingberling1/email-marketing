import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const ADMIN_UI_PREFIX = "/admin"
const ADMIN_API_PREFIX = "/api/admin"

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // ── Admin Security Enforcement (Edge Layer) ───────────────────────────
    if (pathname.startsWith(ADMIN_UI_PREFIX) || pathname.startsWith(ADMIN_API_PREFIX)) {
        const isApi = pathname.startsWith(ADMIN_API_PREFIX)

        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        })

        if (!token?.id) {
            if (isApi) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })
            return NextResponse.redirect(new URL("/login", req.url))
        }

        const role = token.global_role as string | undefined
        const suspended = token.is_suspended as boolean | undefined

        // Block suspended users or non-admins
        if (suspended || role !== "super_admin") {
            const errorMsg = suspended ? "Account suspended" : "Forbidden: super_admin role required"

            if (isApi) return NextResponse.json({ error: errorMsg }, { status: 403 })
            return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        return NextResponse.next()
    }

    // ── Standard NextAuth guard for all other routes ──────────────────────
    return NextAuth(authConfig).auth(req as any)
}

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
