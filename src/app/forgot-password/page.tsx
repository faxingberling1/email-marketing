"use client"

import { useState } from "react"
import { Mail, Loader2, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        // Simulating a network request for password reset
        setTimeout(() => {
            setLoading(false)
            setSuccess(true)
        }, 1500)
    }

    return (
        <div className="flex min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-hidden relative pt-20">
            <LandingHeader />

            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Left — branding */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10 border-r border-white/5 bg-slate-950/50 backdrop-blur-3xl">
                <div className="space-y-8 max-w-lg">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
                            <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
                            Return to Command Center
                        </Link>
                        <h1 className="text-5xl font-bold outfit leading-tight">
                            Regain Access to <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">MailMind</span>
                        </h1>
                        <p className="mt-4 text-xl text-slate-400">
                            Secure your account. We'll send an encrypted verification link to reset your administrative credentials.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right — auth form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="lg:hidden flex flex-col items-center mb-10 text-center space-y-4">
                    <h1 className="text-3xl font-bold outfit tracking-tight">Recovery Protocol</h1>
                    <p className="text-slate-400 text-sm">Regain access to your MailMind instance.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px] bg-slate-900/40 backdrop-blur-xl p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 border-2 border-indigo-500/0 rounded-3xl group-hover:border-indigo-500/20 transition-colors duration-500 pointer-events-none" />

                    {!success ? (
                        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Account Email</label>
                                    <div className="relative group/input">
                                        <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 pl-12 text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                            placeholder="commander@enterprise.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                    disabled={loading}
                                    className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-4 text-sm font-bold text-white transition-all hover:to-indigo-400 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-70 overflow-hidden"
                                >
                                    {loading ? (
                                        <><Loader2 className="h-5 w-5 animate-spin" /><span>Initiating Recovery…</span></>
                                    ) : (
                                        <span>Send Verification Link</span>
                                    )}
                                </button>
                            </div>

                            <div className="flex sm:hidden items-center justify-center text-sm mt-6 pt-6 border-t border-white/5 gap-4">
                                <Link href="/login" className="text-slate-400 hover:text-indigo-400 transition-colors">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center py-4">
                            <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                                <Mail className="h-8 w-8 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold outfit">Verification Sent</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                We've dispatched a recovery link to <span className="text-white font-medium">{email}</span>. Please check your inbox and follow the secure instructions.
                            </p>
                            <Link href="/login" className="w-full relative mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-4 text-sm font-bold text-white transition-all hover:bg-white/10">
                                Return to Deployment Login
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
