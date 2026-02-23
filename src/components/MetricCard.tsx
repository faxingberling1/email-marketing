"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, Sparkles, AlertCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
    name: string
    value: string
    change: string
    icon: LucideIcon
    sparkline: number[]
    aiSuggestion: string
    status: 'success' | 'warning' | 'danger'
    index: number
    progressBar?: {
        current: number
        total: number
        label: string
    }
}

export function MetricCard({
    name = "Metric",
    value = "0",
    change = "0%",
    icon: Icon = AlertCircle,
    sparkline = [0, 0, 0, 0, 0, 0, 0],
    aiSuggestion = "Analyzing...",
    status = "success",
    index = 0,
    progressBar
}: MetricCardProps) {
    const [isHovered, setIsHovered] = useState(false)
    const isPositive = change ? !change.startsWith('-') : true
    const progressPerc = progressBar && progressBar.total > 0
        ? Math.min(100, (progressBar.current / progressBar.total) * 100)
        : 0

    // Simple Sparkline Path Generator
    const getPath = (data: number[]) => {
        const min = Math.min(...data)
        const max = Math.max(...data)
        const range = max - min
        const width = 100
        const height = 30

        return data.map((val, i) => {
            const x = (i / (data.length - 1)) * width
            const y = height - ((val - min) / range) * height
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        }).join(' ')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-slate-900/80"
        >
            {/* Danger Pulse - Only if status is danger */}
            {status === 'danger' && (
                <motion.div
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-rose-500 pointer-events-none"
                />
            )}

            {/* Background Accent */}
            <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
                status === 'success' ? "bg-emerald-500" : status === 'warning' ? "bg-amber-500" : "bg-rose-500"
            )} />

            <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-300 transition-colors">
                    {name}
                </span>
                <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
                    status === 'success' ? "bg-emerald-500/10 text-emerald-400" : status === 'warning' ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400",
                    "group-hover:scale-110 group-hover:rotate-3",
                    status === 'danger' && "animate-pulse"
                )}>
                    <Icon className="h-4 w-4" />
                </div>
            </div>

            <div className="flex items-end justify-between relative z-10">
                <div className="flex-1">
                    <h3 className="text-3xl font-black text-white tracking-tight">
                        {value}
                    </h3>

                    {progressBar ? (
                        <div className="mt-4 space-y-1.5 pr-4">
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-slate-500">
                                <span>{progressBar.label}</span>
                                <span className={cn(progressPerc > 90 ? "text-rose-400" : "text-slate-400")}>
                                    {progressBar.current.toLocaleString()} / {progressBar.total.toLocaleString()}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPerc}%` }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className={cn(
                                        "h-full rounded-full",
                                        progressPerc > 95 ? "bg-rose-500" : progressPerc > 75 ? "bg-amber-500" : "bg-indigo-500"
                                    )}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className={cn(
                                "flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                                isPositive ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                            )}>
                                {isPositive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                                {change}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">vs last month</span>
                        </div>
                    )}
                </div>

                {/* Mini Sparkline */}
                {!progressBar && (
                    <div className="w-20 h-8 overflow-visible opacity-40 group-hover:opacity-100 transition-opacity duration-500">
                        <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                            <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                d={getPath(sparkline)}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={cn(
                                    status === 'success' ? "text-emerald-400" : status === 'warning' ? "text-amber-400" : "text-rose-400"
                                )}
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* AI Suggestion Area */}
            <AnimatePresence>
                {(isHovered || status === 'danger') && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                            <div className={cn(
                                "flex-shrink-0 h-4 w-4 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400",
                                status === 'warning' && "bg-amber-500/10 text-amber-400",
                                status === 'danger' && "bg-rose-500/10 text-rose-400"
                            )}>
                                {status === 'warning' ? <AlertCircle className="h-2.5 w-2.5" /> : status === 'danger' ? <AlertCircle className="h-2.5 w-2.5 animate-bounce" /> : <Sparkles className="h-2.5 w-2.5" />}
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 leading-tight italic">
                                AI: {aiSuggestion}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
