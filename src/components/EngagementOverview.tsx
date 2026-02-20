"use client"

import { motion } from "framer-motion"
import {
    Activity,
    TrendingUp,
    MousePointer2,
    Mail,
    Users,
    Clock,
    Zap,
    BarChart3,
    ArrowUpRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Trend {
    date: string
    opens: number
    clicks: number
}

interface EngagementOverviewProps {
    data: {
        openRate: string
        clickRate: string
        bounceRate: string
        unsubscribeRate: string
        trends: Trend[]
        peakWindow: string
    }
}

export function EngagementOverview({ data }: EngagementOverviewProps) {
    const maxOpens = Math.max(...data.trends.map(t => t.opens))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Orbital Engagement Telemetry</h3>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                    <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                    Real-time Signal
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Avg. Open Rate', value: data.openRate, icon: Mail, color: 'indigo', trend: '+2.4%' },
                    { label: 'Avg. Click Rate', value: data.clickRate, icon: MousePointer2, color: 'emerald', trend: '+1.8%' },
                    { label: 'Bounce Rate', value: data.bounceRate, icon: Zap, color: 'amber', trend: '-0.1%' },
                    { label: 'Unsubscribe', value: data.unsubscribeRate, icon: Users, color: 'rose', trend: 'Stable' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-5 rounded-3xl border border-white/5 bg-slate-900/40 relative overflow-hidden group"
                    >
                        <div className={cn(
                            "absolute -right-4 -top-4 h-16 w-16 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity",
                            stat.color === 'indigo' ? "bg-indigo-400" :
                                stat.color === 'emerald' ? "bg-emerald-400" :
                                    stat.color === 'amber' ? "bg-amber-400" : "bg-rose-400"
                        )} />

                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={cn(
                                "h-4 w-4",
                                stat.color === 'indigo' ? "text-indigo-400" :
                                    stat.color === 'emerald' ? "text-emerald-400" :
                                        stat.color === 'amber' ? "text-amber-400" : "text-rose-400"
                            )} />
                            <span className={cn(
                                "text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest",
                                stat.trend.includes('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
                            )}>
                                {stat.trend}
                            </span>
                        </div>

                        <div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h4 className="text-xl font-black text-white tracking-widest leading-none">{stat.value}</h4>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden h-72 flex flex-col">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest">7D Engagement Trend</h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Volume Surveillance Logic</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Opens</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Clicks</span>
                        </div>
                    </div>
                </div>

                {/* Trend Chart (CSS based) */}
                <div className="flex-1 flex items-end justify-between gap-1 mt-4 relative">
                    {data.trends.map((t, i) => (
                        <div key={t.date} className="flex-1 flex flex-col items-center group gap-2">
                            <div className="flex items-end gap-[2px] w-full h-32 relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(t.opens / maxOpens) * 100}%` }}
                                    className="flex-1 bg-indigo-500/40 rounded-t-sm group-hover:bg-indigo-500 transition-colors relative"
                                >
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-500/20 to-transparent" />
                                </motion.div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(t.clicks / maxOpens) * 100}%` }}
                                    className="flex-1 bg-emerald-500/40 rounded-t-sm group-hover:bg-emerald-500 transition-colors relative"
                                >
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-500/20 to-transparent" />
                                </motion.div>
                            </div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{t.date}</span>
                        </div>
                    ))}
                    {/* Horizontal Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 py-2">
                        {[1, 2, 3].map(j => <div key={j} className="w-full h-[1px] bg-slate-700 border-t border-dashed border-slate-700" />)}
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-3xl border border-indigo-500/10 bg-indigo-500/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-0.5">Peak Activity Synchronization</p>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">{data.peakWindow}</h4>
                    </div>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all">
                    Sync Campaigns <TrendingUp className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}
