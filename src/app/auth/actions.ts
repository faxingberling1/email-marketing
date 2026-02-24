"use server"

import { signIn, signOut as nextSignOut, auth } from "@/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { generateAIEmailContent } from "@/lib/gemini"

export async function signOut() {
    await nextSignOut({ redirectTo: "/" })
}

export async function registerUser(formData: any) {
    const { email, password, name } = formData

    // 1. Fundamental Validation First
    if (!email || !password) {
        throw new Error("Missing email or password")
    }

    // 2. Password Strength Check (Before any DB queries)
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score < 2) {
        throw new Error("Password strength insufficient. Registration aborted.")
    }

    // 3. Check Existence
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Atomic Transaction: Create Workspace AND User
    return await prisma.$transaction(async (tx) => {
        // Create a default workspace
        const workspace = await (tx as any).workspace.create({
            data: {
                name: `${name || 'My'} Workspace`
            }
        })

        // Create user and link to workspace
        const user = await (tx as any).user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                onboardingCompleted: formData.onboardingCompleted ?? false,
                workspaceId: workspace.id
            }
        })

        return user
    })
}

/**
 * Ensures a user has an active workspace. If missing, auto-creates one.
 * Call this at the start of any server action / page that requires a workspace.
 * Returns the workspaceId (always).
 */
export async function ensureUserWorkspace(userId: string): Promise<string> {
    const users = await prisma.$queryRaw`SELECT "workspaceId", "name", "email" FROM "User" WHERE id = ${userId} LIMIT 1` as any[]
    const user = users?.[0]

    if (user?.workspaceId) return user.workspaceId

    // Auto-create a workspace for this user
    const workspaceId = `cl${Math.random().toString(36).substring(2, 11)}${Math.random().toString(36).substring(2, 11)}`;
    const workspaceName = `${user?.name || user?.email?.split('@')[0] || 'My'} Workspace`

    await prisma.$executeRaw`
        INSERT INTO "Workspace" ("id", "name", "ownerId", "updatedAt")
        VALUES (${workspaceId}, ${workspaceName}, ${userId}, NOW())
    `

    await prisma.$executeRaw`
        UPDATE "User"
        SET "workspaceId" = ${workspaceId}, "updatedAt" = NOW()
        WHERE "id" = ${userId}
    `

    console.log(`[ensureUserWorkspace] Auto-created workspace ${workspaceId} for user ${userId}`)
    return workspaceId
}


export async function completeOnboarding(formData: { goal?: string }) {
    console.log("[SERVER] completeOnboarding: Start", formData)
    const session = await auth()
    if (!session?.user?.id) {
        console.error("[SERVER] completeOnboarding: Unauthorized")
        throw new Error("Unauthorized")
    }

    // Mark Onboarding as Complete
    console.log("[SERVER] completeOnboarding: Updating user DB record...")
    await (prisma as any).user.update({
        where: { id: session.user.id },
        data: {
            onboardingCompleted: true
        }
    })
    console.log("[SERVER] completeOnboarding: Mark complete success")

    return { success: true }
}

export async function setupDemoUser() {
    console.log("[SERVER] setupDemoUser: Starting...")
    const demoEmail = "demo@example.com"
    const demoPassword = "password123"

    try {
        // 1. Ensure Workspace
        const workspace = await (prisma as any).workspace.upsert({
            where: { id: "demo-workspace" },
            update: { name: "Demo Workspace" },
            create: {
                id: "demo-workspace",
                name: "Demo Workspace"
            }
        })
        console.log("[SERVER] setupDemoUser: Workspace synced")

        // 2. Check user existence
        const existingUser = await prisma.user.findUnique({
            where: { email: demoEmail }
        })

        if (!existingUser) {
            console.log("[SERVER] setupDemoUser: Creating new demo user...")
            const hashedPassword = await bcrypt.hash(demoPassword, 10)
            await (prisma as any).user.create({
                data: {
                    email: demoEmail,
                    password: hashedPassword,
                    name: "Demo User",
                    onboardingCompleted: true,
                    workspaceId: workspace.id
                }
            })
        } else {
            console.log("[SERVER] setupDemoUser: Updating existing demo user...")
            await (prisma as any).user.update({
                where: { email: demoEmail },
                data: {
                    onboardingCompleted: true,
                    workspaceId: workspace.id
                }
            })
        }

        console.log("[SERVER] setupDemoUser: Complete")
        return { success: true }
    } catch (error: any) {
        console.error("[SERVER] setupDemoUser Error:", error.message)
        return { error: error.message }
    }
}

export async function loginUser(formData: any) {
    const { email, password } = formData
    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
