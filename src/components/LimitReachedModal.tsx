"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Zap, Send, Users, ArrowRight, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface LimitReachedModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'ai' | 'email' | 'contact'
    title: string
    description: string
    limit?: string
}

export function LimitReachedModal({
    isOpen,
    onClose,
    type,
    title,
    description,
    limit
}: LimitReachedModalProps) {
    const router = useRouter()

    const icons = {
        ai: <Zap className="h-6 w-6 text-amber-400" />,
        email: <Send className="h-6 w-6 text-indigo-400" />,
        contact: <Users className="h-6 w-6 text-emerald-400" />
    }

    const accents = {
        ai: "bg-amber-400/10 text-amber-400",
        email: "bg-indigo-400/10 text-indigo-400",
        contact: "bg-emerald-400/10 text-emerald-400"
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl"
                >
                    {/* Background Glow */}
                    <div className={cn(
                        "absolute -top-24 -left-24 h-48 w-48 rounded-full blur-[80px] opacity-20",
                        type === 'ai' ? "bg-amber-500" : type === 'email' ? "bg-indigo-500" : "bg-emerald-500"
                    )} />

                    <button
                        onClick={onClose}
                        className="absolute right-6 top-6 rounded-full p-2 text-slate-500 hover:bg-white/5 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className={cn(
                            "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner",
                            accents[type]
                        )}>
                            {icons[type]}
                        </div>

                        <h2 className="mb-2 text-2xl font-black text-white tracking-tight">
                            {title}
                        </h2>

                        <p className="mb-8 text-sm font-medium text-slate-400 leading-relaxed">
                            {description}
                            {limit && (
                                <span className="block mt-2 font-bold text-slate-300">
                                    Current Limit: {limit}
                                </span>
                            )}
                        </p>

                        <div className="grid w-full gap-3">
                            <button
                                onClick={() => router.push('/billing')}
                                className="group flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-black text-white transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-600/20"
                            >
                                Upgrade Your Plan
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button
                                onClick={onClose}
                                className="rounded-xl border border-white/5 bg-white/5 px-6 py-4 text-sm font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>

                    {/* Pro Tip */}
                    <div className="mt-8 rounded-2xl bg-slate-950/50 p-4 border border-white/5">
                        <p className="text-[10px] text-slate-500 flex gap-2">
                            <AlertTriangle className="h-3 w-3 flex-shrink-0 text-amber-500/50" />
                            <span>
                                <strong>Pro Tip:</strong> Business and Enterprise plans include unlimited {type === 'ai' ? 'AI generations' : type === 'email' ? 'email sends' : 'contacts'} and higher deliverability rates.
                            </span>
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}
