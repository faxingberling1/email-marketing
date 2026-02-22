"use client"

import { useState } from "react"
import { Mail, Lock, Loader2, Activity, ShieldCheck, Zap, Shield, User, Copy, Check } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"

const TEST_CREDENTIALS = [
    {
        label: "Customer",
        role: "user",
        email: "test@example.com",
        password: "password123",
        icon: User,
        color: "from-indigo-500/10 to-sky-500/10 border-indigo-500/20",
        iconColor: "text-indigo-400",
        badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    },
    {
        label: "Super Admin",
        role: "super_admin",
        email: "superadmin@mailmind.ai",
        password: "superadmin123",
        icon: Shield,
        color: "from-rose-500/10 to-purple-500/10 border-rose-500/20",
        iconColor: "text-rose-400",
        badge: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    },
]

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [copied, setCopied] = useState<string | null>(null)
    const router = useRouter()

    // After sign-in, fetch the real DB role and redirect accordingly
    const resolveRedirect = async () => {
        try {
            const res = await fetch("/api/auth/me")
            if (!res.ok) {
                throw new Error(`Auth API returned ${res.status}`)
            }
            const { role } = await res.json()
            router.push(role === "super_admin" ? "/admin" : "/dashboard")
            router.refresh()
        } catch (err) {
            console.error(err)
            setErrorMsg("Redirection failed. Please refresh the page.")
            setLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setErrorMsg("Authentication failed. Check your credentials and try again.")
                setLoading(false)
            } else {
                await resolveRedirect()
            }
        } catch (err) {
            console.error(err)
            setErrorMsg("An unexpected error occurred during login.")
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        signIn("google", { callbackUrl: "/dashboard" })
    }

    const fillCredential = (cred: typeof TEST_CREDENTIALS[0]) => {
        setEmail(cred.email)
        setPassword(cred.password)
        setErrorMsg("")
    }

    const copyToClipboard = (text: string, key: string) => {
        navigator.clipboard?.writeText(text)
        setCopied(key)
        setTimeout(() => setCopied(null), 1500)
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
                        <h1 className="text-5xl font-bold outfit leading-tight">
                            Welcome Back to <br />
                            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Intelligent Growth</span>
                        </h1>
                        <p className="mt-4 text-xl text-slate-400">
                            Your AI engine is ready to optimize your campaigns and maximize engagement.
                        </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
                        className="flex gap-6 items-center">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            System Online
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            AI Engine: Operational
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
                        className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                            <div className="text-indigo-400 mb-1"><Zap className="h-5 w-5" /></div>
                            <div className="text-2xl font-bold outfit">+12.4%</div>
                            <div className="text-sm text-slate-400">Growth Forecast</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                            <div className="text-sky-400 mb-1"><Activity className="h-5 w-5" /></div>
                            <div className="text-xl font-bold mt-1 outfit">4:00 PM EST</div>
                            <div className="text-sm text-slate-400">Peak Energy Window</div>
                        </div>
                    </motion.div>

                    {/* Test credentials display — developer convenience */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                        <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.25em] mb-3">Dev Test Credentials</div>
                        <div className="space-y-3">
                            {TEST_CREDENTIALS.map(cred => {
                                const Icon = cred.icon
                                return (
                                    <div key={cred.role}
                                        role="button" tabIndex={0}
                                        onClick={() => fillCredential(cred)}
                                        onKeyDown={e => e.key === "Enter" && fillCredential(cred)}
                                        className={`w-full text-left bg-gradient-to-r ${cred.color} border rounded-xl p-4 transition-all hover:scale-[1.01] group cursor-pointer`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Icon className={`h-4 w-4 ${cred.iconColor}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cred.badge}`}>{cred.label}</span>
                                            </div>
                                            <span className="text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors font-bold">Click to fill →</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <div className="text-[9px] text-slate-700 font-black uppercase tracking-widest mb-0.5">Email</div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-mono text-slate-400 truncate">{cred.email}</span>
                                                    <button onClick={e => { e.stopPropagation(); copyToClipboard(cred.email, cred.role + "-email") }}
                                                        className="shrink-0 text-slate-700 hover:text-slate-300 transition-colors">
                                                        {copied === cred.role + "-email" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] text-slate-700 font-black uppercase tracking-widest mb-0.5">Password</div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs font-mono text-slate-400">{cred.password}</span>
                                                    <button onClick={e => { e.stopPropagation(); copyToClipboard(cred.password, cred.role + "-pass") }}
                                                        className="shrink-0 text-slate-700 hover:text-slate-300 transition-colors">
                                                        {copied === cred.role + "-pass" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Secured with Enterprise Encryption</div>
                    <div>GDPR Compliant</div>
                </div>
            </div>

            {/* Right — auth form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10">
                <div className="lg:hidden flex flex-col items-center mb-10 text-center space-y-4">
                    <h1 className="text-3xl font-bold outfit tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 text-sm">Your AI engine is ready.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px] bg-slate-900/40 backdrop-blur-xl p-8 lg:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute inset-0 border-2 border-indigo-500/0 rounded-3xl group-hover:border-indigo-500/20 transition-colors duration-500 pointer-events-none" />

                    <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
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

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group/input">
                                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 group-focus-within/input:text-indigo-400 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 pl-12 text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                                        placeholder="Enter secure access key"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                    <><Loader2 className="h-5 w-5 animate-spin" /><span>Signing in…</span></>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>

                            <div className="relative flex items-center py-2">
                                <div className="flex-grow border-t border-white/5"></div>
                                <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase tracking-widest">Or</span>
                                <div className="flex-grow border-t border-white/5"></div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white text-slate-900 py-4 text-sm font-black transition-all hover:bg-slate-100 active:scale-[0.98] shadow-sm disabled:opacity-50"
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

                        <div className="flex flex-col sm:flex-row items-center justify-between text-sm mt-6 pt-6 border-t border-white/5 gap-4">
                            <Link href="/forgot-password" className="text-slate-400 hover:text-indigo-400 transition-colors">
                                Forgot Password?
                            </Link>
                            <span className="text-slate-500 hidden sm:inline">•</span>
                            <div className="text-slate-400">
                                Don't have an account? <Link href="/signup" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Create one</Link>
                            </div>
                        </div>
                    </form>
                </motion.div>

                {/* Mobile: test credentials */}
                <div className="lg:hidden mt-8 w-full max-w-[420px] space-y-3">
                    <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.25em] text-center mb-2">Dev Test Credentials</div>
                    {TEST_CREDENTIALS.map(cred => {
                        const Icon = cred.icon
                        return (
                            <div key={cred.role}
                                role="button" tabIndex={0}
                                onClick={() => fillCredential(cred)}
                                onKeyDown={e => e.key === "Enter" && fillCredential(cred)}
                                className={`w-full text-left bg-gradient-to-r ${cred.color} border rounded-xl p-3 transition-all cursor-pointer`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <Icon className={`h-3.5 w-3.5 ${cred.iconColor}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${cred.badge}`}>{cred.label}</span>
                                    <span className="text-[10px] text-slate-600 ml-auto">Tap to fill</span>
                                </div>
                                <div className="text-xs font-mono text-slate-500">{cred.email} · {cred.password}</div>
                            </div>
                        )
                    })}
                </div>

                <div className="lg:hidden mt-8 flex flex-col items-center gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Secured with Enterprise Encryption</div>
                    <div>GDPR Compliant</div>
                </div>
            </div>
        </div>
    )
}
