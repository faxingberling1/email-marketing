"use client"

import { motion } from "framer-motion"
import { CheckCircle2, ChevronRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const tiers = [
    {
        name: "Starter",
        price: "$29",
        desc: "Essential intelligence for emerging brands.",
        features: [
            "Up to 1,000 contacts",
            "AI subject line generator",
            "Basic templates",
            "Real-time analytics"
        ],
        cta: "Get Started Free",
        popular: false
    },
    {
        name: "Growth",
        price: "$79",
        desc: "Advanced tactical control for scaling operations.",
        features: [
            "Up to 10,000 contacts",
            "AI sequences",
            "Automation triggers",
            "Advanced analytics"
        ],
        cta: "Get Started Free",
        popular: true
    },
    {
        name: "Pro",
        price: "$149",
        desc: "Unlimited strategic power for enterprise dominance.",
        features: [
            "Unlimited contacts",
            "Multi-language support",
            "Advanced AI recommendations",
            "Premium templates",
            "Integrations"
        ],
        cta: "Get Started Free",
        popular: false
    }
]

export function PricingTable() {
    return (
        <section id="pricing" className="py-32 relative overflow-hidden bg-slate-950">
            {/* Background Mesh Gradient */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white outfit mb-6">
                            Scalable <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Pricing.</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                            Clear and competitive pricing tiers.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.6, type: "spring" }}
                            className={cn(
                                "relative flex flex-col p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border transition-all duration-500 hover:-translate-y-2",
                                tier.popular
                                    ? "border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
                                    : "border-white/5 hover:border-white/10"
                            )}
                        >
                            {/* Popular Highlight */}
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    Most Popular Core
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-black outfit text-white mb-2">{tier.name}</h3>
                                <p className="text-slate-400 text-sm mb-6">{tier.desc}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-white">{tier.price}</span>
                                    <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">/mo</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Tactical Arsenal</div>
                                {tier.features.map(f => (
                                    <div key={f} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                                        <CheckCircle2 className={cn(
                                            "h-5 w-5 flex-shrink-0",
                                            tier.popular ? "text-indigo-400" : "text-emerald-500"
                                        )} />
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <button className={cn(
                                "group relative w-full overflow-hidden rounded-2xl py-4 font-black transition-all hover:scale-[1.02] active:scale-[0.98]",
                                tier.popular
                                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500"
                                    : "bg-white/5 text-white hover:bg-white/10"
                            )}>
                                <span className="relative z-10 flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase">
                                    {tier.cta}
                                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                {tier.popular && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
