"use client"

import { motion } from "framer-motion"
import {
    Users,
    TrendingUp,
    TrendingDown,
    Zap,
    Target,
    ShieldCheck,
    AlertCircle,
    BrainCircuit
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Cluster {
    id: string
    name: string
    count: number
    growth: string
    color: 'indigo' | 'emerald' | 'rose' | 'amber'
}

interface SegmentClustersProps {
    clusters: Cluster[]
}

export function SegmentClusters({ clusters = [] }: SegmentClustersProps) {
    const getColorStyles = (color: string) => {
        switch (color) {
            case 'emerald': return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10"
            case 'rose': return "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/10"
            case 'amber': return "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/10"
            default: return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/10"
        }
    }

    const getIcon = (name: string) => {
        if (name.includes('Founder')) return Target
        if (name.includes('High')) return Zap
        if (name.includes('Churn')) return AlertCircle
        return Users
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Behavioral AI Clustering</h3>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Updated 5m ago</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {clusters.map((cluster, i) => {
                    const Icon = getIcon(cluster.name)
                    const isPositive = cluster.growth.startsWith('+')

                    return (
                        <motion.div
                            key={cluster.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={cn(
                                "group relative p-5 rounded-3xl border transition-all cursor-pointer overflow-hidden",
                                cluster.color === 'indigo' ? "bg-indigo-500/5 hover:border-indigo-500/30 border-white/5" :
                                    cluster.color === 'emerald' ? "bg-emerald-500/5 hover:border-emerald-500/30 border-white/5" :
                                        cluster.color === 'rose' ? "bg-rose-500/5 hover:border-rose-500/30 border-white/5" :
                                            "bg-amber-500/5 hover:border-amber-500/30 border-white/5"
                            )}
                        >
                            {/* Radial Glow Background */}
                            <div className={cn(
                                "absolute -right-8 -top-8 h-24 w-24 rounded-full blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500",
                                cluster.color === 'indigo' ? "bg-indigo-400" :
                                    cluster.color === 'emerald' ? "bg-emerald-400" :
                                        cluster.color === 'rose' ? "bg-rose-400" : "bg-amber-400"
                            )} />

                            <div className="flex items-start justify-between mb-6 relative z-10">
                                <div className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
                                    getColorStyles(cluster.color)
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest",
                                    isPositive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}>
                                    {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                                    {cluster.growth}
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-[12px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">
                                    {cluster.name}
                                </h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-white tracking-tighter">
                                        {cluster.count.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Records</span>
                                </div>
                            </div>

                            {/* Tactical HUD Marker */}
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="h-3 w-3 text-slate-500" />
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Health: Optimal</span>
                                </div>
                                <motion.div
                                    className="h-1 w-8 rounded-full bg-white/10 overflow-hidden"
                                >
                                    <motion.div
                                        animate={{ x: [-32, 32] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className={cn(
                                            "h-full w-4",
                                            cluster.color === 'indigo' ? "bg-indigo-400/40" :
                                                cluster.color === 'emerald' ? "bg-emerald-400/40" :
                                                    cluster.color === 'rose' ? "bg-rose-400/40" : "bg-amber-400/40"
                                        )}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
