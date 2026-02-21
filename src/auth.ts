import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { authConfig } from "./auth.config"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            onboardingCompleted: boolean
            subscriptionPlan: string
            global_role: string
            is_suspended: boolean
        } & DefaultSession["user"]
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user || !user.password) return null

                // Fetch role/suspension via raw query to bypass stale Prisma client types
                // (can happen when prisma generate is blocked by a running dev server DLL lock)
                const roleRows = await prisma.$queryRaw<{ global_role: string; is_suspended: boolean }[]>`
                    SELECT global_role, is_suspended FROM "User" WHERE id = ${user.id} LIMIT 1
                `
                const globalRole = roleRows[0]?.global_role ?? "user"
                const isSuspended = roleRows[0]?.is_suspended ?? false

                if (isSuspended) return null

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) return null

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    onboardingCompleted: user.onboardingCompleted,
                    subscriptionPlan: user.subscriptionPlan,
                    global_role: globalRole,
                    is_suspended: isSuspended,
                }
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.onboardingCompleted = (user as any).onboardingCompleted
                token.subscriptionPlan = (user as any).subscriptionPlan
                token.global_role = (user as any).global_role ?? "user"
                token.is_suspended = (user as any).is_suspended ?? false
            }
            // Fallback: if global_role is missing from token (e.g. Google OAuth first sign-in
            // or session created before this field existed), fetch from DB
            if (!token.global_role && token.id) {
                const rows = await prisma.$queryRaw<{ global_role: string }[]>`
                    SELECT global_role FROM "User" WHERE id = ${token.id as string} LIMIT 1
                `
                token.global_role = rows[0]?.global_role ?? "user"
            }
            if (trigger === "update" && session) {
                token.onboardingCompleted = session.onboardingCompleted
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.onboardingCompleted = token.onboardingCompleted as boolean
                session.user.subscriptionPlan = token.subscriptionPlan as string
                session.user.global_role = (token.global_role as string) ?? "user"
                session.user.is_suspended = (token.is_suspended as boolean) ?? false
            }
            return session
        }
    },
})
