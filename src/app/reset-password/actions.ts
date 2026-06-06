"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function resetPassword(password: string, token: string, email: string) {
    try {
        if (!password || !token || !email) {
            return { success: false, error: "Missing required fields" }
        }

        // Verify token
        const resetToken = await (prisma as any).passwordResetToken.findUnique({
            where: { token, email }
        })

        if (!resetToken) {
            return { success: false, error: "Invalid or expired token" }
        }

        if (resetToken.expires < new Date()) {
            await (prisma as any).passwordResetToken.delete({ where: { id: resetToken.id } })
            return { success: false, error: "Token expired" }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Update user
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        })

        // Delete used token
        await (prisma as any).passwordResetToken.delete({ where: { id: resetToken.id } })

        return { success: true }
    } catch (error) {
        console.error("Reset password error:", error)
        return { success: false, error: "Failed to reset password" }
    }
}
