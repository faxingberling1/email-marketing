"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, ArrowUpRight, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface QuotaAlertProps {
    type: 'ai' | 'email' | 'contact'
    remaining: number
    limit: number
    plan: string
}

export function QuotaAlert({ type, remaining, limit, plan }: QuotaAlertProps) {
    const [isVisible, setIsVisible] = useState(false)
    const percentage = (remaining / limit) * 100

    useEffect(() => {
        if (percentage < 15) setIsVisible(true)
    }, [percentage])

    if (!isVisible) return null

    const config = {
        ai: { label: "AI Credits", color: "from-indigo-500 to-purple-600" },
        email: { label: "Email Quota", color: "from-emerald-500 to-teal-600" },
        contact: { label: "Contact Limit", color: "from-amber-500 to-orange-600" }
    }[type]

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-xl px-4"
            >
                <div className="relative group">
                    <div className={cn(
                        "absolute -inset-1 blur-xl opacity-20 group-hover:opacity-40 transition-opacity bg-gradient-to-r",
                        config.color
                    )} />

                    <div className="relative flex items-center gap-4 bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                        <div className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                            config.color
                        )}>
                            <AlertCircle className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">
                                Critical {config.label} Alert
                            </h4>
                            <p className="text-xs text-slate-400 font-medium">
                                You have <span className="text-white font-bold">{remaining.toLocaleString()}</span> {config.label.toLowerCase()} left on your {plan} plan.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/billing"
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-2 transition-all group/btn"
                            >
                                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Upgrade</span>
                                <ArrowUpRight className="h-3 w-3 text-slate-500 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
                            </Link>

                            <button
                                onClick={() => setIsVisible(false)}
                                className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
