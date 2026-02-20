"use server"

import { signIn, signOut as nextSignOut } from "@/auth"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function signOut() {
    await nextSignOut({ redirectTo: "/" })
}

export async function registerUser(formData: any) {
    const { email, password, name, onboardingCompleted = true } = formData

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

    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name: name || null,
            onboardingCompleted,
        }
    })

    return user
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
