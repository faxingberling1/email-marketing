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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.global_role = (user as any).global_role
                token.is_suspended = (user as any).is_suspended
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.global_role = token.global_role as string
                session.user.is_suspended = token.is_suspended as boolean
            }
            return session
        }
    },
} satisfies NextAuthConfig
