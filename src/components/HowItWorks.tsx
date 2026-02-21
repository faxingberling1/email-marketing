"use client"

import { motion } from "framer-motion"
import { UploadCloud, Sparkles, Zap, Activity, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

import { LandingCmsHowItWorks } from "../app/admin/cms/tabs/HowItWorksTab"

const DEFAULT_HOW: LandingCmsHowItWorks = {
    headingLine1: "How It ",
    headingLine2: "Works.",
    subtitle: "From data sync to tactical optimization in five automated steps.",
    steps: [
        {
            title: "Import Contacts",
            desc: "Upload CSV or sync from your CRM",
            icon: "UploadCloud",
            highlight: "Data Synced"
        },
        {
            title: "Launch AI",
            desc: "Templates and email suggestions ready for your segments",
            icon: "Sparkles",
            highlight: "AI Ready"
        },
        {
            title: "Create Campaign",
            desc: "AI recommends subject line, content, and send time",
            icon: "Zap",
            highlight: "Campaign Built"
        },
        {
            title: "Initialize Sequence",
            desc: "Schedule emails and let AI optimize performance",
            icon: "Activity",
            highlight: "Sequence Live"
        },
        {
            title: "Track & Optimize",
            desc: "Real-time analytics and AI recommendations for next action",
            icon: "Activity",
            highlight: "Continuous Uplift"
        }
    ]
}

import { Database, LineChart, Settings, RefreshCw, Send } from "lucide-react"
const ICONS: any = { UploadCloud, Sparkles, Zap, Activity, Database, LineChart, Settings, RefreshCw, Send }

export function HowItWorks({ content }: { content?: LandingCmsHowItWorks }) {
    const data = content || DEFAULT_HOW

    return (
        <section id="how-it-works" className="py-32 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white outfit mb-6">
                            {data.headingLine1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">{data.headingLine2}</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                            {data.subtitle}
                        </p>
                    </motion.div>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[4.5rem] left-12 right-12 h-0.5 bg-white/5 z-0" />
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="hidden lg:block absolute top-[4.5rem] left-12 right-12 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 origin-left z-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 relative z-10">
                        {data.steps.map((step, i) => {
                            const Icon = ICONS[step.icon] || Activity
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 0.5, type: "spring", stiffness: 50 }}
                                    className="relative flex flex-col items-center text-center group"
                                >
                                    {/* Step Number / Icon Node */}
                                    <div className="h-20 w-20 rounded-2xl bg-slate-900 text-slate-500 border-2 border-slate-800 flex flex-col items-center justify-center mb-8 relative group-hover:border-indigo-500 group-hover:text-indigo-400 transition-all duration-500 shadow-xl group-hover:shadow-indigo-500/20 group-hover:-translate-y-2 group-hover:scale-110">
                                        <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-black border-4 border-slate-950 shadow-[0_0_10px_rgba(79,70,229,0.5)]">
                                            {i + 1}
                                        </div>
                                        <Icon className="h-8 w-8" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold outfit mb-4 text-white group-hover:text-indigo-300 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6 px-4">
                                        {step.desc}
                                    </p>

                                    {/* Highlight Chip */}
                                    <div className="mt-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors">
                                        <ChevronRight className="h-3 w-3" />
                                        {step.highlight}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
