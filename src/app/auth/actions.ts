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

    if (!email || !password) {
        throw new Error("Missing email or password")
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        throw new Error("User already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a default workspace first
    const workspace = await (prisma as any).workspace.create({
        data: {
            name: `${name || 'My'} Workspace`
        }
    })

    // Create user and link to workspace
    const user = await (prisma as any).user.create({
        data: {
            email,
            password: hashedPassword,
            name: name || null,
            onboardingCompleted: formData.onboardingCompleted ?? true,
            workspaceId: workspace.id
        }
    })

    return user
}

/**
 * Ensures a user has an active workspace. If missing, auto-creates one.
 * Call this at the start of any server action / page that requires a workspace.
 * Returns the workspaceId (always).
 */
export async function ensureUserWorkspace(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { workspaceId: true, name: true, email: true } as any
    }) as any

    if (user?.workspaceId) return user.workspaceId

    // Auto-create a workspace for this user
    const workspace = await (prisma as any).workspace.create({
        data: {
            name: `${user?.name || user?.email?.split('@')[0] || 'My'} Workspace`,
            ownerId: userId,
        }
    })

    await (prisma as any).user.update({
        where: { id: userId },
        data: { workspaceId: workspace.id }
    })

    console.log(`[ensureUserWorkspace] Auto-created workspace ${workspace.id} for user ${userId}`)
    return workspace.id
}


export async function completeOnboarding(formData: { goal: string }) {
    const session = await auth()
    if (!session?.user?.id) throw new Error("Unauthorized")

    const { goal } = formData

    // 1. Generate AI Content for First Campaign
    const prompt = `Generate a high-converting first email campaign subject and body for a new email marketing user whose goal is: ${goal}. 
    Return as JSON: { "subject": "...", "content": "..." }`

    const aiResponse = await generateAIEmailContent(prompt)
    let aiData = { subject: "Welcome to Intelligent Growth", content: "Start your first sequence here." }

    try {
        if (aiResponse) {
            // Basic parsing if Gemini returns JSON-like text
            const jsonStr = aiResponse.match(/\{[\s\S]*\}/)?.[0]
            if (jsonStr) aiData = JSON.parse(jsonStr)
        }
    } catch (e) {
        console.warn("Failed to parse Gemini JSON, using defaults")
    }

    // 2. Create Initial Campaign
    await (prisma as any).campaign.create({
        data: {
            userId: session.user.id,
            name: `Initial ${goal.charAt(0).toUpperCase() + goal.slice(1)} Campaign`,
            subject: aiData.subject,
            aiContent: aiData.content,
            status: "draft"
        }
    })

    // 3. Mark Onboarding as Complete
    await (prisma as any).user.update({
        where: { id: session.user.id },
        data: {
            onboardingCompleted: true
        }
    })

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
