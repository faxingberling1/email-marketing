"use client"

import { useState, useEffect } from "react"
import {
    BarChart3, TrendingUp, Users, Zap,
    ArrowUpRight, ArrowDownRight, Activity,
    Shield, Building2, MousePointer2
} from "lucide-react"
import { MetricCard } from "@/components/admin/MetricCard"
import { motion } from "framer-motion"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { cn } from "@/lib/utils"

const SYSTEM_HEALTH_DATA = [
    { name: '00:00', load: 12 },
    { name: '04:00', load: 18 },
    { name: '08:00', load: 45 },
    { name: '12:00', load: 82 },
    { name: '16:00', load: 64 },
    { name: '20:00', load: 38 },
]

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white outfit">Executive Metrics</h1>
                <p className="text-slate-500 text-sm font-bold mt-1">High-fidelity Platform Intelligence</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="System Load"
                    value="42%"
                    subValue="GLOBAL GPU/CPU AVG"
                    icon={Activity}
                    trend={{ value: "5%", isUp: false }}
                    gradient="from-blue-500 to-indigo-600"
                />
                <MetricCard
                    title="Request Velocity"
                    value="1.2k"
                    subValue="REQS / MINUTE"
                    icon={Zap}
                    trend={{ value: "12%", isUp: true }}
                    gradient="from-amber-500 to-orange-600"
                />
                <MetricCard
                    title="Active Sessions"
                    value="842"
                    subValue="REAL-TIME USERS"
                    icon={Users}
                    gradient="from-emerald-500 to-teal-600"
                />
                <MetricCard
                    title="Platform Status"
                    value="Optimal"
                    subValue="SLA 99.99%"
                    icon={Shield}
                    gradient="from-indigo-500 to-purple-600"
                />
            </div>

            {/* Performance Visualization */}
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                    <BarChart3 className="h-12 w-12 text-white/5" />
                </div>

                <div className="mb-12">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] block mb-2 underline decoration-2 underline-offset-4">Performance Stack</span>
                    <h3 className="text-2xl font-black text-white outfit italic">SYSTEM LOAD DISTRIBUTION</h3>
                </div>

                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={SYSTEM_HEALTH_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="name" stroke="#ffffff15" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                            <YAxis stroke="#ffffff15" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                            <Tooltip
                                cursor={{ fill: '#ffffff05' }}
                                contentStyle={{ background: '#020617', border: '1px solid #ffffff10', borderRadius: '12px' }}
                            />
                            <Bar dataKey="load" radius={[6, 6, 0, 0]}>
                                {SYSTEM_HEALTH_DATA.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.load > 70 ? '#f43f5e' : entry.load > 40 ? '#6366f1' : '#10b981'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-indigo-500/20 transition-all">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Top Regions</h4>
                    <div className="space-y-4">
                        {[
                            { name: 'North America', p: 65, color: 'bg-indigo-500' },
                            { name: 'Europe', p: 25, color: 'bg-purple-500' },
                            { name: 'Asia Pacific', p: 10, color: 'bg-emerald-500' },
                        ].map(r => (
                            <div key={r.name} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-slate-400">
                                    <span>{r.name}</span>
                                    <span>{r.p}%</span>
                                </div>
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${r.p}%` }}
                                        className={cn("h-full", r.color)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-rose-500/[0.01] border border-rose-500/5 rounded-3xl hover:border-rose-500/20 transition-all">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="h-4 w-4 text-rose-500" />
                        <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">Active Alerts</h4>
                    </div>
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500 font-bold italic leading-relaxed">No high-criticality system alerts in the last 24 hours. All shields operational.</p>
                        <div className="pt-4 flex gap-2">
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500">DATABASE OK</span>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500">MODELS WARM</span>
                            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-500">SMTP STABLE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ShieldAlert({ className }: { className?: string }) {
    return <AlertOctagon className={className} />
}
import { AlertOctagon } from "lucide-react"
