"use client"

import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
    title: string
    value: string | number
    subValue?: string
    icon: LucideIcon
    trend?: {
        value: string
        isUp: boolean
    }
    gradient: string
}

export function MetricCard({ title, value, subValue, icon: Icon, trend, gradient }: MetricCardProps) {
    return (
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group overflow-hidden relative">
            {/* Background Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.03] blur-3xl group-hover:opacity-[0.08] transition-opacity`} />

            <div className="flex items-start justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-black/20`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                {trend && (
                    <div className={`text-[10px] font-black px-2 py-1 rounded-full border ${trend.isUp
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : "text-rose-400 bg-rose-500/10 border-rose-500/20"
                        }`}>
                        {trend.isUp ? "↑" : "↓"} {trend.value}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{title}</div>
                <div className="text-2xl font-black text-white outfit">{value}</div>
                {subValue && (
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">
                        {subValue}
                    </div>
                )}
            </div>
        </div>
    )
}
