"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Mail,
    Lock,
    User,
    Loader2,
    Sparkles,
    CheckCircle2,
    Activity,
    Zap,
    ShieldCheck,
    ArrowRight,
    Building2,
    Check
} from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/app/auth/actions"
import { LandingHeader } from "@/components/LandingHeader"

export default function SignupPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [company, setCompany] = useState("")
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()

    const getPasswordStrength = (pass: string) => {
        if (!pass) return { score: 0, label: "Strength insufficient", color: "bg-slate-800" }
        let score = 0
        if (pass.length >= 8) score++
        if (/[A-Z]/.test(pass)) score++
        if (/[0-9]/.test(pass)) score++
        if (/[^A-Za-z0-9]/.test(pass)) score++

        if (score === 4) return { score: 4, label: "Encryption stable", color: "bg-emerald-500 shadow-sm shadow-emerald-500/50" }
        if (score >= 2) return { score: 3, label: "Medium security", color: "bg-amber-500" }
        return { score: 1, label: "Strength insufficient. Add symbols for encryption stability.", color: "bg-rose-500" }
    }

    const passStrength = getPasswordStrength(password)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")

        if (password !== confirmPassword) {
            setErrorMsg("Authentication keys do not match.")
            return
        }

        if (!agreedToTerms) {
            setErrorMsg("Legal authorization required. Please accept Terms & Privacy.")
            return
        }

        if (password.length < 8) {
            setErrorMsg("Strength insufficient. Minimum 8 characters required.")
            return
        }

        setLoading(true)

        try {
            await registerUser({ email, password, name, company })

            // Auto login
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                router.push("/login")
            } else {
                // Should redirect to onboarding automatically if middleware is set, 
                // but we'll force it just in case
                router.push("/onboarding")
                router.refresh()
            }
        } catch (error: any) {
            if (error.message.includes("exists")) {
                setErrorMsg("Signal detected. Account already registered.")
            } else {
                setErrorMsg(error.message || "Interference detected. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = () => {
        setLoading(true)
        signIn("google", { callbackUrl: "/onboarding" })
    }

    return (
        <div className="flex min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-hidden relative pt-20">
            <LandingHeader />

            {/* Background Mesh Gradients */}
            <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Left Side (AI Value Panel) - Hidden on Mobile */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative z-10 border-r border-white/5 bg-slate-950/20 backdrop-blur-3xl">

                <div className="space-y-10 max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl font-extrabold outfit leading-[1.1] tracking-tight">
                            Start Growing with <br />
                            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                                Intelligent Automation
                            </span>
                        </h1>
                        <p className="mt-6 text-xl text-slate-400 leading-relaxed font-medium">
                            AI-generated campaigns. Predictive analytics. Automated optimization. Join the elite brands scaling with precision.
                        </p>
                    </motion.div>

                    {/* Feature Bullets */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="grid gap-6"
                    >
                        {[
                            { title: "AI Subject Line Generator", icon: Sparkles },
                            { title: "Real-Time Engagement Forecast", icon: Activity },
                            { title: "Smart Segmentation", icon: Zap },
                            { title: "Automated Sequences", icon: Loader2 }
                        ].map((item, i) => (
                            <div key={item.title} className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <span className="text-lg font-bold text-slate-200">{item.title}</span>
                                <Check className="h-5 w-5 text-emerald-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </motion.div>

                    {/* Live AI Preview / Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group"
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                AI Engine Ready
                            </div>
                            <Activity className="h-5 w-5 text-indigo-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-3xl font-black outfit">+12%</div>
                                <div className="text-sm text-slate-400 font-bold">Forecasted Growth</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black outfit">4:00 PM</div>
                                <div className="text-sm text-slate-400 font-bold">Peak Send Time (EST)</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Trust Signals */}
                <div className="flex items-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Enterprise Encryption</div>
                    <div>GDPR Compliant</div>
                    <div>AI-Powered Infrastructure</div>
                </div>
            </div>

            {/* Right Side (Signup Form) */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[480px] space-y-8"
                >
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-3xl font-black outfit">Create Account</h2>
                        <p className="text-slate-400 font-medium">14-Day Free Trial — No Credit Card Required</p>
                    </div>

                    <div className="glass p-8 lg:p-10 rounded-[40px] border border-white/10 shadow-2xl relative group bg-slate-900/40">
                        {/* Glow effect */}
                        <div className="absolute inset-0 border-2 border-indigo-500/0 rounded-[40px] group-hover:border-indigo-500/15 transition-colors duration-500 pointer-events-none" />

                        <form onSubmit={handleSignup} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                            placeholder="Alex Murphy"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Company Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                                        <input
                                            type="text"
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                            placeholder="Omni Consumer"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="a.murphy@ocp.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Security Key (Password)</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Verify Key</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 pl-12 text-white placeholder-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password Strength */}
                                {password && (
                                    <div className="px-1 space-y-2">
                                        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] font-black">
                                            <span className="text-slate-600">Encryption Stability</span>
                                            <span className={passStrength.score === 4 ? "text-emerald-400" : passStrength.score >= 2 ? "text-amber-400" : "text-rose-400"}>
                                                {passStrength.label}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1, 2, 3, 4].map((s) => (
                                                <div
                                                    key={s}
                                                    className={`h-1 rounded-full transition-all duration-500 ${s <= passStrength.score ? passStrength.color : "bg-white/5"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-start gap-3 px-1">
                                <div className="relative flex items-center mt-1">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="peer h-4 w-4 bg-slate-900 border border-white/10 rounded focus:ring-0 focus:ring-offset-0 accent-indigo-500 transition-all cursor-pointer opacity-0 absolute"
                                    />
                                    <div className={`h-4 w-4 border border-white/10 rounded flex items-center justify-center transition-all ${agreedToTerms ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-900'}`}>
                                        {agreedToTerms && <Check className="h-3 w-3 text-white" />}
                                    </div>
                                </div>
                                <label htmlFor="terms" className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed cursor-pointer select-none">
                                    I authorize MailMind to initialize my workstation. I agree to the
                                    <Link href="/terms" className="text-indigo-400 hover:text-white mx-1">Terms of Service</Link>
                                    and
                                    <Link href="/privacy" className="text-indigo-400 hover:text-white ml-1">Privacy Protocol</Link>.
                                </label>
                            </div>

                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold text-center"
                                >
                                    {errorMsg}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-[20px] text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span>Initializing AI Engine...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create My AI Account</span>
                                        <ArrowRight className="h-6 w-6" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-8">
                            <div className="h-px flex-grow bg-white/5" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">OR</span>
                            <div className="h-px flex-grow bg-white/5" />
                        </div>

                        <button
                            onClick={handleGoogleSignup}
                            disabled={loading}
                            className="w-full bg-white text-slate-950 font-black py-4 rounded-[20px] text-sm transition-all hover:bg-slate-100 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>

                    <p className="text-center text-slate-500 font-bold text-sm">
                        Already have an account? <Link href="/login" className="text-indigo-400 hover:text-white transition-colors">Sign In</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
