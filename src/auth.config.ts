import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [], // Configured in auth.ts
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isProtectedRoute = nextUrl.pathname.startsWith('/dashboard') ||
                nextUrl.pathname.startsWith('/contacts') ||
                nextUrl.pathname.startsWith('/campaigns') ||
                nextUrl.pathname.startsWith('/settings')

            if (isProtectedRoute) {
                if (!isLoggedIn) return false // Redirect to login
                return true
            }

            if (isLoggedIn) {
                if (nextUrl.pathname === '/login') {
                    return Response.redirect(new URL('/dashboard', nextUrl))
                }
            }

            return true
        },
    },
} satisfies NextAuthConfig
