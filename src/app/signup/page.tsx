"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    Sparkles,
    Loader2,
    ShieldCheck,
    CheckCircle2,
    Zap,
    ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/app/auth/actions"
import { LandingHeader } from "@/components/LandingHeader"

export default function SignupPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const router = useRouter()

    // Password strength logic
    const getPasswordStrength = () => {
        if (!password) return 0
        let strength = 0
        if (password.length > 6) strength += 1
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1
        return strength
    }

    const strength = getPasswordStrength()

    const handleNext = () => {
        if (step === 1 && email.includes("@")) {
            setStep(2)
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleDemoAccess = async () => {
        setLoading(true)
        try {
            const demoEmail = "demo@example.com"
            const demoPassword = "password123"

            try {
                await registerUser({
                    email: demoEmail,
                    password: demoPassword,
                    name: "Demo User",
                    onboardingCompleted: true
                })
            } catch (e) { }

            const result = await signIn("credentials", {
                email: demoEmail,
                password: demoPassword,
                redirect: false,
            })

            if (result?.error) throw new Error(result.error)

            router.push("/dashboard")
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        }
        setLoading(false)
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await registerUser({ email, password, name })

            // Auto login
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                alert("Account created, but failed to auto-login. Please sign in manually.")
                router.push("/login")
            }
            if (result?.ok) {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (error: any) {
            alert(error.message)
        }
        setLoading(false)
    }

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 overflow-hidden">
            <LandingHeader />

            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="w-full max-w-lg mt-20">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="glass p-12 rounded-[40px] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden"
                        >
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest"
                                >
                                    <Sparkles className="h-3 w-3" /> New Journey
                                </motion.div>
                                <h1 className="text-4xl font-extrabold text-white outfit leading-tight">
                                    Let's build your <br />
                                    <span className="gradient-text">marketing engine.</span>
                                </h1>
                                <p className="text-slate-400">Join the elite brands scaling with surgical AI precision.</p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        autoFocus
                                        className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 p-6 pl-14 text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-xl"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && email.includes("@") && handleNext()}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={!email.includes("@")}
                                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-5 text-lg font-bold text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-indigo-600/20"
                            >
                                Continue <ChevronLeft className="h-5 w-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <div className="flex flex-col gap-4 text-center">
                                <p className="text-xs text-slate-600">
                                    Already have an account? <Link href="/login" className="text-indigo-400 hover:underline">Sign In</Link>
                                </p>
                                <button
                                    onClick={handleDemoAccess}
                                    className="text-[10px] uppercase tracking-widest font-black text-slate-500 hover:text-indigo-400 transition-colors py-2"
                                >
                                    2) Skip everything and just take me to dashboard &rarr;
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95, x: -50 }}
                            className="glass p-12 rounded-[40px] border border-white/10 shadow-2xl space-y-8"
                        >
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold group"
                            >
                                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
                            </button>

                            <div className="space-y-4">
                                <h2 className="text-4xl font-extrabold text-white outfit leading-tight">
                                    Secure your <br />
                                    <span className="gradient-text">account access.</span>
                                </h2>
                                <p className="text-slate-400">Enterprise-grade security, simplified.</p>
                            </div>

                            <form onSubmit={handleSignup} className="space-y-6 pt-4">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 p-6 pl-14 text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all text-xl"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 p-6 pl-14 text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none transition-all text-xl"
                                            placeholder="Create Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    {/* Password Strength Visual */}
                                    <div className="px-1 space-y-3">
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-black">
                                            <span className="text-slate-500">Security Strength</span>
                                            <span className={strength >= 3 ? "text-emerald-500" : strength >= 2 ? "text-amber-500" : "text-rose-500"}>
                                                {strength >= 4 ? "Unbreakable" : strength >= 3 ? "Strong" : strength >= 2 ? "Medium" : "Weak"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1, 2, 3, 4].map((s) => (
                                                <div
                                                    key={s}
                                                    className={`h-1.5 rounded-full transition-all duration-500 ${s <= strength
                                                        ? strength >= 3 ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-amber-500"
                                                        : "bg-slate-800"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || password.length < 6}
                                    className="relative group flex w-full items-center justify-center gap-3 rounded-2xl bg-white p-6 text-xl font-black text-slate-950 transition-all hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 overflow-hidden shadow-2xl"
                                >
                                    {loading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <span className="relative z-10 flex items-center gap-2">
                                            Launch My Platform <Zap className="h-5 w-5 fill-slate-950" />
                                        </span>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Micro-Interaction Tip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-12 flex flex-col items-center gap-4 text-center"
                >
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-950 bg-slate-800" />
                        ))}
                    </div>
                    <p className="text-slate-500 text-xs">
                        Join <span className="text-white font-bold">500+ developers</span> & marketers <br />
                        automating their growth today.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
