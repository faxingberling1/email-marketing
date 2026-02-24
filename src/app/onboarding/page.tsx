"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    CheckCircle2,
    Globe,
    Users,
    Target,
    ArrowRight,
    Loader2,
    Sparkles,
    Upload,
    Mail,
    ChevronRight,
    Zap,
    TrendingUp,
    Rocket,
    BrainCircuit
} from "lucide-react"
import { useRouter } from "next/navigation"
import { LandingHeader } from "@/components/LandingHeader"
import { completeOnboarding } from "@/app/auth/actions"

type Step = 1 | 2 | 3 | 4

export default function OnboardingPage() {
    const [step, setStep] = useState<Step>(1)
    const [loading, setLoading] = useState(false)
    const [goal, setGoal] = useState("")
    const [domain, setDomain] = useState("")
    const router = useRouter()

    const nextStep = () => setStep((s) => (s + 1) as Step)

    const finishOnboarding = async () => {
        setLoading(true)
        console.log("[DIAG] Starting finishOnboarding with goal:", goal)
        try {
            const res = await completeOnboarding({ goal })
            console.log("[DIAG] finishOnboarding server result:", res)

            // Critical: Force a full browser redirect to ensure new session state is loaded
            window.location.href = "/dashboard"
        } catch (error: any) {
            console.error("[DIAG] Failed to finish onboarding:", error)
            alert(`Setup failed: ${error.message || "Unknown error"}. Attempting to enter dashboard anyway...`)
            window.location.href = "/dashboard"
        } finally {
            setLoading(false)
        }
    }

    const skipOnboarding = async () => {
        setLoading(true)
        console.log("[DIAG] Starting skipOnboarding...")
        try {
            const res = await completeOnboarding({})
            console.log("[DIAG] completeOnboarding result:", res)

            // Forces redirection to dashboard regardless of session state
            window.location.href = "/dashboard"
        } catch (error: any) {
            console.error("[DIAG] skipOnboarding error:", error)
            alert(`Error: ${error.message || "Unknown error during skip"}. Redirecting to dashboard anyway...`)
            window.location.href = "/dashboard"
        } finally {
            setLoading(false)
        }
    }

    const goals = [
        { id: "sales", title: "Increase Sales", desc: "AI-driven conversion optimization", icon: TrendingUp },
        { id: "audience", title: "Build Audience", desc: "Consistent engagement & growth", icon: Users },
        { id: "launch", title: "Product Launch", desc: "High-impact announcement sequences", icon: Rocket },
        { id: "newsletter", title: "Newsletter", desc: "Reliable communication & value", icon: Mail },
        { id: "reengage", title: "Re-engage", desc: "Win back inactive customers", icon: Zap },
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white relative flex flex-col pt-20 overflow-hidden">
            <LandingHeader />

            {/* Background elements */}
            <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[20%] w-[600px] h-[600px] bg-sky-600/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Progress Bar */}
            <div className="fixed top-20 left-0 w-full h-1 bg-white/5 z-50">
                <motion.div
                    initial={{ width: "25%" }}
                    animate={{ width: `${(step / 4) * 100}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
            </div>

            <main className="flex-grow flex items-center justify-center p-6 relative z-10">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="w-full max-w-2xl text-center space-y-12"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
                                    Step 01: Infrastructure
                                </div>
                                <h2 className="text-5xl font-black outfit tracking-tight">Connect Your Domain</h2>
                                <p className="text-slate-400 text-lg max-w-md mx-auto">Verify your sending identity to ensure 99.9% delivery rates and AI-optimized inboxing.</p>
                            </div>

                            <div className="glass p-8 rounded-[40px] border border-white/10 bg-slate-900/40 space-y-6">
                                <div className="relative">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500" />
                                    <input
                                        type="text"
                                        className="w-full bg-black/20 border border-white/10 rounded-3xl p-6 pl-16 text-xl text-white placeholder-slate-700 focus:border-indigo-500 focus:outline-none transition-all"
                                        placeholder="mail.yourcompany.com"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-left">
                                    <Sparkles className="h-6 w-6 text-indigo-400 shrink-0 mt-1" />
                                    <p className="text-sm text-slate-400">
                                        <span className="text-white font-bold">AI Tip:</span> Using a subdomain like <span className="text-indigo-400">mail.</span> protects your primary domain's reputation during high-volume spikes.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={nextStep}
                                className="group flex items-center gap-3 mx-auto px-10 py-5 bg-white text-slate-950 rounded-[24px] font-black text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                            >
                                Continue to Intelligence <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={nextStep}
                                className="text-slate-500 font-bold hover:text-white transition-colors block mx-auto disabled:opacity-50"
                            >
                                Setup domain later
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-2xl text-center space-y-12"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
                                    Step 02: Logistics
                                </div>
                                <h2 className="text-5xl font-black outfit tracking-tight">Sync Your Contacts</h2>
                                <p className="text-slate-400 text-lg max-w-md mx-auto">Upload your existing list. MailMind will automatically categorize and clean your data.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="glass p-10 rounded-[40px] border border-white/10 bg-slate-900/40 hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-col items-center gap-4">
                                    <div className="h-20 w-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                        <Upload className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-black text-xl">Upload CSV</div>
                                        <div className="text-sm text-slate-500">Drag & drop your files</div>
                                    </div>
                                </div>
                                <div className="glass p-10 rounded-[40px] border border-white/10 bg-slate-900/40 hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col items-center gap-4">
                                    <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="font-black text-xl">Add Manual</div>
                                        <div className="text-sm text-slate-500">Start with a few leads</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <button
                                    onClick={nextStep}
                                    className="group flex items-center gap-3 mx-auto px-10 py-5 bg-white text-slate-950 rounded-[24px] font-black text-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                                >
                                    Define Strategy <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="text-slate-500 font-bold hover:text-white transition-colors disabled:opacity-50"
                                >
                                    Skip this for now
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full max-w-4xl text-center space-y-12"
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
                                    Step 03: Intelligence
                                </div>
                                <h2 className="text-5xl font-black outfit tracking-tight">What's Your Main Goal?</h2>
                                <p className="text-slate-400 text-lg max-w-md mx-auto">Select a primary objective so the AI can tailor your initial campaigns and sequences.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {goals.map((g) => (
                                    <div
                                        key={g.id}
                                        onClick={() => setGoal(g.id)}
                                        className={`glass p-8 rounded-[32px] border transition-all cursor-pointer flex flex-col items-center gap-4 text-center group relative overflow-hidden ${goal === g.id
                                            ? "border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500"
                                            : "border-white/10 bg-slate-900/40 hover:border-white/20"
                                            }`}
                                    >
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${goal === g.id ? "bg-indigo-500 text-white" : "bg-white/5 text-indigo-400 group-hover:scale-110"
                                            }`}>
                                            <g.icon className="h-7 w-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-black text-lg">{g.title}</div>
                                            <div className="text-xs text-slate-500 font-bold tracking-tight">{g.desc}</div>
                                        </div>
                                        {goal === g.id && (
                                            <div className="absolute top-4 right-4 text-indigo-500">
                                                <CheckCircle2 className="h-5 w-5 fill-indigo-500 text-slate-950" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={nextStep}
                                disabled={!goal}
                                className="group flex items-center gap-3 mx-auto px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-2xl disabled:opacity-50"
                            >
                                Initialize AI Engine <BrainCircuit className="h-6 w-6" />
                            </button>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-2xl text-center space-y-12"
                        >
                            <div className="relative">
                                {/* Large AI Brain Visual */}
                                <div className="h-40 w-40 bg-indigo-500/20 rounded-full blur-[40px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                                <BrainCircuit className="h-32 w-32 text-indigo-400 mx-auto relative animate-bounce" />
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-4xl font-black outfit tracking-tight">Initializing Your AI Profile</h2>
                                <div className="max-w-md mx-auto space-y-4">
                                    <div className="flex items-center gap-4 text-left p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-sm font-bold text-slate-300">Analyzing industry growth patterns...</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-left p-4 bg-white/5 rounded-2xl border border-white/5 opacity-60">
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-sm font-bold text-slate-300">Synthesizing conversion-tuned copy...</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-left p-4 bg-white/5 rounded-2xl border border-white/5 opacity-30">
                                        <div className="h-2 w-2 rounded-full bg-sky-500" />
                                        <span className="text-sm font-bold text-slate-300">Generating campaign roadmap...</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={finishOnboarding}
                                disabled={loading}
                                className="group flex items-center gap-3 mx-auto px-12 py-6 bg-white text-slate-950 rounded-[30px] font-black text-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                            >
                                {loading ? <Loader2 className="h-7 w-7 animate-spin" /> : <>Enter Command Center <Rocket className="h-7 w-7" /></>}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
