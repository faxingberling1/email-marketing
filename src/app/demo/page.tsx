"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { setupDemoUser } from "@/app/auth/actions"
import { Sparkles, Loader2, AlertCircle } from "lucide-react"

export default function DemoRedirectPage() {
    const router = useRouter()
    const [status, setStatus] = useState("Initializing...")
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function handleDemoAccess() {
            try {
                console.log("[DEMO] Starting setup...")
                setStatus("Synchronizing neural state...")

                const result = await setupDemoUser()

                if (result?.error) {
                    throw new Error(result.error)
                }

                console.log("[DEMO] Setup complete")
                setStatus("Calibrating authentication...")

                // 2. Sign In
                console.log("[DEMO] Starting sign in...")
                const authResult = await signIn("credentials", {
                    email: "demo@example.com",
                    password: "password123",
                    redirect: false,
                })

                console.log("[DEMO] Sign in result:", authResult)

                if (authResult?.error) {
                    console.error("Sign in error:", authResult.error)
                    throw new Error(authResult.error)
                }

                setStatus("Synthesizing dashboard...")
                console.log("[DEMO] Redirecting to dashboard...")

                // Use window.location.href for a full reload to ensure new session is picked up by middleware
                window.location.href = "/dashboard"
            } catch (err: any) {
                console.error("Demo access process failed:", err)
                setError(err.message || "Unknown synchronization error")
                // Don't auto-redirect immediately so user can see the error
            }
        }

        handleDemoAccess()
    }, [router])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white gap-6">
            <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                <div className={`relative glass h-20 w-20 rounded-2xl flex items-center justify-center border transition-colors ${error ? 'border-red-500/50' : 'border-white/10'}`}>
                    {error ? (
                        <AlertCircle className="h-10 w-10 text-red-400" />
                    ) : (
                        <Sparkles className="h-10 w-10 text-indigo-400 animate-pulse" />
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 max-w-sm text-center px-6">
                <h1 className="text-2xl font-bold outfit">
                    {error ? "Synchronization Failed" : "Preparing Your Engine"}
                </h1>

                {error ? (
                    <div className="space-y-4">
                        <p className="text-red-400/80 text-sm font-bold bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-indigo-400 hover:text-white text-sm font-black uppercase tracking-widest transition-colors"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm flex items-center gap-2 font-medium">
                        <Loader2 className="h-4 w-4 animate-spin" /> {status}
                    </p>
                )}
            </div>
        </div>
    )
}
