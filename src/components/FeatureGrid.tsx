"use client"

import { motion } from "framer-motion"
import { Sparkles, BarChart3, Zap, Target, Users, Layout, Activity, Globe, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
    {
        title: "AI-Powered Campaigns",
        desc: "Automatically generate subject lines, email copy, and templates optimized for engagement.",
        icon: Sparkles,
        color: "indigo"
    },
    {
        title: "Real-Time Analytics",
        desc: "Track open rate, click rate, engagement trends, and AI insights in real-time.",
        icon: BarChart3,
        color: "blue"
    },
    {
        title: "Segmentation & AI Clusters",
        desc: "Automatically segment contacts using AI behavior prediction for high conversion.",
        icon: Users,
        color: "purple"
    },
    {
        title: "Automation & Sequences",
        desc: "Set up email workflows with AI recommendations for optimal timing and actions.",
        icon: Zap,
        color: "emerald"
    },
    {
        title: "Retargeting & Optimization",
        desc: "AI recommends re-engagement strategies for hyper-engaged or underperforming segments.",
        icon: Target,
        color: "rose"
    },
    {
        title: "Templates Library",
        desc: "Pre-built AI templates, fully customizable and optimized for engagement.",
        icon: Layout,
        color: "cyan"
    },
    {
        title: "Peak Engagement Forecast",
        desc: "AI predicts the best time to send emails for maximum open rates.",
        icon: Activity,
        color: "indigo"
    },
    {
        title: "Multi-Language Support",
        desc: "Generate email content in multiple languages with tone customization.",
        icon: Globe,
        color: "purple"
    },
    {
        title: "Integrations",
        desc: "CRM, Zapier, Google Sheets, and more.",
        icon: ShieldCheck,
        color: "emerald"
    },
]

const colorMap = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:text-blue-300 group-hover:bg-blue-500/20 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:text-purple-300 group-hover:bg-purple-500/20 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 group-hover:text-emerald-300 group-hover:bg-emerald-500/20 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20 group-hover:text-rose-300 group-hover:bg-rose-500/20 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:text-cyan-300 group-hover:bg-cyan-500/20 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
}

export function FeatureGrid() {
    return (
        <section id="features" className="py-32 relative">
            {/* Background Grid Elements */}
            <div className="absolute inset-0 bg-slate-950/50 -z-20" />
            <div className="absolute inset-x-0 h-[1px] top-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black outfit mb-6 tracking-tight">
                            Core Competitive <span className="text-indigo-500">Features.</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                            Advanced tools, simplified by artificial intelligence.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5, type: "spring", stiffness: 50 }}
                            className="group relative p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 hover:border-white/10 transition-all overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                            <div className={cn(
                                "h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-500 mb-8 relative z-10",
                                colorMap[feature.color as keyof typeof colorMap]
                            )}>
                                <feature.icon className="h-6 w-6" />
                            </div>

                            <h3 className="text-xl font-bold outfit mb-4 text-white group-hover:text-indigo-400 transition-colors relative z-10">
                                {feature.title}
                            </h3>

                            <p className="text-slate-400 text-sm leading-relaxed font-medium relative z-10">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
