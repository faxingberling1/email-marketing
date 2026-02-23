"use client"

import { useState, useMemo } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Dot
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { Activity, Clock, Users, BrainCircuit } from "lucide-react"
import { cn } from "@/lib/utils"

interface EngagementChartProps {
    data: any[]
    peakEngagement: {
        time: string
        segment: string
        reason: string
    }
}

export function EngagementChart({
    data = [],
    peakEngagement = {
        time: "Calculating...",
        segment: "All Segments",
        reason: "Analysis in progress"
    }
}: EngagementChartProps) {
    const [filter, setFilter] = useState<'7D' | '30D' | 'ALL'>('7D')
    const [activeTab, setActiveTab] = useState<'engagement' | 'retention'>('engagement')

    const filteredData = useMemo(() => {
        if (!data) return []
        if (filter === '7D') return data.slice(-7)
        if (filter === '30D') return data.slice(-30)
        return data
    }, [data, filter])

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{label}</p>
                    <div className="space-y-1.5">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-8">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-xs font-bold text-slate-300">{entry.name}</span>
                                </div>
                                <span className="text-xs font-black text-white">{entry.value}%</span>
                            </div>
                        ))}
                    </div>
                    {payload[0]?.payload.isForecast && (
                        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2">
                            <BrainCircuit className="h-3 w-3 text-indigo-400" />
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">AI Prediction</span>
                        </div>
                    )}
                </div>
            )
        }
        return null
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 rounded-3xl border border-white/5 bg-slate-900/50 p-8 backdrop-blur-sm relative overflow-hidden group"
        >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-indigo-400" />
                        <h2 className="text-lg font-black text-white tracking-tight italic uppercase">Engagement Hub</h2>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                        <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            Open Rate
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                            Click Rate
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                    {(['7D', '30D', 'ALL'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={cn(
                                "px-5 py-2 text-[10px] font-black rounded-xl transition-all relative overflow-hidden",
                                filter === t
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[320px] w-full relative group/chart">
                {/* SVG Glow Filter Definition */}
                <svg className="hidden">
                    <defs>
                        <filter id="glow-indigo" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                </svg>

                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="gradientOpen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gradientClick" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Peak Engagement Marker */}
                        <ReferenceLine
                            x={filteredData[Math.floor(filteredData.length * 0.6)]?.date}
                            stroke="rgba(99,102,241,0.2)"
                            strokeDasharray="5 5"
                        />

                        <Area
                            type="monotone"
                            dataKey="openRate"
                            name="Open Rate"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#gradientOpen)"
                            style={{ filter: 'url(#glow-emerald)' }}
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey="clickRate"
                            name="Click Rate"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#gradientClick)"
                            style={{ filter: 'url(#glow-indigo)' }}
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {/* Peak Insights Panel */}
                <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Clock className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Peak Performance</p>
                        <p className="text-xs font-bold text-white mb-0.5">{peakEngagement.time}</p>
                        <p className="text-[9px] text-slate-500 leading-tight">
                            High interest from <span className="text-slate-300 font-bold">{peakEngagement.segment}</span>. {peakEngagement.reason}.
                        </p>
                    </div>
                </div>

                {/* AI Opportunity Panel */}
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Live AI Forecast</p>
                        <p className="text-xs font-bold text-white mb-0.5">+4.2% Expected</p>
                        <p className="text-[9px] text-slate-500 leading-tight">
                            Momentum indicates a positive trend for the coming week. Maintain current cadence.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
