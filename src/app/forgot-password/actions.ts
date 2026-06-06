"use server"

import { prisma } from "@/lib/db"
import { randomBytes } from "crypto"
import { sendEmail } from "@/lib/resend"

export async function forgotPassword(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return { success: true }
        }

        // Generate token
        const token = randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

        // Save token
        await (prisma as any).passwordResetToken.upsert({
            where: { email },
            update: { token, expires },
            create: { email, token, expires }
        })

        // Send email
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

        await sendEmail({
            to: email,
            from: "security@resend.dev", // Should be verified domain in production
            subject: "MailMind - Password Reset Request",
            text: `You requested a password reset. Click here to reset: ${resetUrl}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>MailMind Security</h2>
                    <p>We received a request to reset the password for your account.</p>
                    <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
                    <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 16px; margin-bottom: 24px;">Reset Password</a>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
            campaignId: "system-auth"
        })

        return { success: true }
    } catch (error) {
        console.error("Forgot password error:", error)
        return { success: false, error: "An unexpected error occurred" }
    }
}
