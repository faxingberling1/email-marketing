import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    providers: [], // Configured in auth.ts
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login page on auth errors instead of native 500 page
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

            return true
        },
    },
} satisfies NextAuthConfig
