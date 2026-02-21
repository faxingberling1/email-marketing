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
            }
            return session
        }
    },
})
