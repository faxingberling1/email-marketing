"use client"

import { useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/app/auth/actions"
import { Sparkles, Loader2 } from "lucide-react"

export default function DemoRedirectPage() {
    const router = useRouter()

    useEffect(() => {
        async function handleDemoAccess() {
            try {
                const demoEmail = "demo@example.com"
                const demoPassword = "password123"

                // Ensure demo user exists with onboarding completed
                try {
                    await registerUser({
                        email: demoEmail,
                        password: demoPassword,
                        name: "Demo User",
                        onboardingCompleted: true
                    })
                } catch (e) {
                    // Ignore if already exists
                }

                const result = await signIn("credentials", {
                    email: demoEmail,
                    password: demoPassword,
                    redirect: false,
                })

                if (result?.error) throw new Error(result.error)

                router.push("/dashboard")
                router.refresh()
            } catch (error) {
                console.error("Demo access failed:", error)
                router.push("/login")
            }
        }

        handleDemoAccess()
    }, [router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white gap-6">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                <div className="relative glass h-20 w-20 rounded-2xl flex items-center justify-center border border-white/10">
                    <Sparkles className="h-10 w-10 text-indigo-400 animate-pulse" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-2xl font-bold outfit">Preparing Your Engine...</h1>
                <p className="text-slate-500 text-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Synchronizing demo environment
                </p>
            </div>
        </div>
    )
}
