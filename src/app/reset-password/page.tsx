"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Lock, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"
import { resetPassword } from "./actions"

function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match")
            return
        }
        if (password.length < 8) {
            setErrorMsg("Password must be at least 8 characters")
            return
        }
        if (!token || !email) {
            setErrorMsg("Invalid reset link")
            return
        }

        setLoading(true)
        const res = await resetPassword(password, token, email)
        setLoading(false)

        if (res.success) {
            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 3000)
        } else {
            setErrorMsg(res.error || "An error occurred")
        }
    }

    if (success) {
        return (
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center py-4">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold outfit text-white">Password Updated</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Your password has been successfully reset. Redirecting you to login...
                </p>
                <Link href="/login" className="w-full relative mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-4 text-sm font-bold text-white transition-all hover:bg-white/10">
                    Return to Login Now
                </Link>
            </div>
        )
    }

    return (
        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">New Password</label>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                        <input
                            type="password"
                            required
                            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 pl-12 text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                    <div className="relative group/input">
                        <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                        <input
                            type="password"
                            required
                            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 pl-12 text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm text-center">
                    {errorMsg}
                </div>
            )}

            <div className="pt-2 flex flex-col gap-4">
                <button
                    type="submit"
                    disabled={loading || !token || !email}
                    className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-4 text-sm font-bold text-white transition-all hover:to-indigo-400 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 overflow-hidden"
                >
                    {loading ? (
                        <><Loader2 className="h-5 w-5 animate-spin" /><span>Resetting...</span></>
                    ) : (
                        <span>Update Password</span>
                    )}
                </button>
            </div>
        </form>
    )
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-hidden relative pt-20">
            <LandingHeader />

            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Left — branding */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10 border-r border-white/5 bg-slate-950/50 backdrop-blur-3xl">
                <div className="space-y-8 max-w-lg">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <h1 className="text-5xl font-bold outfit leading-tight">
                            Create New <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Credentials</span>
                        </h1>
                        <p className="mt-4 text-xl text-slate-400">
                            Please set a strong, unique password to secure your MailMind instance.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right — auth form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="lg:hidden flex flex-col items-center mb-10 text-center space-y-4">
                    <h1 className="text-3xl font-bold outfit tracking-tight">Set New Password</h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px] bg-slate-900/40 backdrop-blur-xl p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 border-2 border-indigo-500/0 rounded-3xl group-hover:border-indigo-500/20 transition-colors duration-500 pointer-events-none" />

                    <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-indigo-500" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </motion.div>
            </div>
        </div>
    )
}
