"use client"

import { useState } from "react"
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LandingHeader } from "@/components/LandingHeader"
import { registerUser } from "@/app/auth/actions"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (result?.error) {
            alert("Invalid email or password")
        } else {
            router.push("/dashboard")
            router.refresh()
        }
        setLoading(false)
    }

    const handleSignUp = async () => {
        if (!email || !password) {
            alert("Please enter both email and password")
            return
        }
        setLoading(true)
        try {
            await registerUser({ email, password })
            // Auto login after sign up
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                alert("Account created, but failed to auto-login. Please sign in manually.")
            } else {
                router.push("/onboarding")
                router.refresh()
            }
        } catch (error: any) {
            alert(error.message)
        }
        setLoading(false)
    }

    const handleDemoLogin = async () => {
        setLoading(true)
        const demoEmail = "demo@example.com"
        const demoPassword = "password123"

        // Attempt sign in
        const result = await signIn("credentials", {
            email: demoEmail,
            password: demoPassword,
            redirect: false,
        })

        if (result?.error) {
            // Auto-register demo account if it doesn't exist
            try {
                await registerUser({
                    email: demoEmail,
                    password: demoPassword,
                    name: "Demo User",
                    onboardingCompleted: true
                })

                // Try signing in again
                await signIn("credentials", {
                    email: demoEmail,
                    password: demoPassword,
                    callbackUrl: "/dashboard"
                })
            } catch (error: any) {
                alert(`Demo Access Error: ${error.message}`)
            }
        } else {
            router.push("/dashboard")
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 pt-20 transition-all duration-700">
            <LandingHeader />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10" />

            <div className="w-full max-w-md space-y-8 glass p-10 rounded-3xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/40">
                        <Mail className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white outfit">Welcome Back</h1>
                    <p className="mt-2 text-slate-400">Sign in to manage your AI campaigns</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="email"
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 pl-10 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 pl-10 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                        </button>

                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-950 px-2 text-slate-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            disabled={loading}
                            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4 text-sm font-black text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-600/20"
                        >
                            <Sparkles className="h-4 w-4" />
                            LAUNCH DASHBOARD
                        </button>

                        <div className="h-[1px] bg-white/5 my-2" />

                        <button
                            type="button"
                            onClick={handleSignUp}
                            className="w-full rounded-xl border border-slate-800 py-3 text-sm font-bold text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
                        >
                            Create Account
                        </button>
                    </div>
                </form>

                <p className="text-center text-xs text-slate-600">
                    By signing in, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    )
}
