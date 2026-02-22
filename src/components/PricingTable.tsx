"use client"

import { motion } from "framer-motion"
import { CheckCircle2, ChevronRight, Zap, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useSession } from "next-auth/react"

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
        cta: "Upgrade to Growth",
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
        cta: "Go Unlimited",
        popular: false
    }
]

export function PricingTable() {
    const { data: session } = useSession()
    const [loadingTier, setLoadingTier] = useState<string | null>(null)

    const handleUpgrade = async (planName: string) => {
        if (!session?.user?.id) {
            alert("Authentication Required: Please log in to upgrade your protocol.")
            return
        }

        setLoadingTier(planName)
        try {
            const response = await fetch("/api/billing/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planName,
                    workspaceId: (session.user as any).workspaceId || session.user.id, // Fallback to user ID if workspace not found
                    userId: session.user.id,
                    customerEmail: session.user.email,
                }),
            })

            const data = await response.json()

            if (data.url) {
                window.location.href = data.url
            } else {
                throw new Error(data.error || "Failed to initiate tactical deployment.")
            }
        } catch (error: any) {
            alert(`Protocol Error: ${error.message}`)
        } finally {
            setLoadingTier(null)
        }
    }

    return (
        <section id="pricing" className="py-20 relative overflow-hidden bg-slate-950/50 rounded-[3rem] border border-white/5">
            {/* Background Mesh Gradient */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent -z-10" />

            <div className="max-w-7xl mx-auto px-6">
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

                            <button
                                onClick={() => handleUpgrade(tier.name)}
                                disabled={loadingTier === tier.name}
                                className={cn(
                                    "group relative w-full overflow-hidden rounded-2xl py-4 font-black transition-all hover:scale-[1.02] active:scale-[0.98]",
                                    tier.popular
                                        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500"
                                        : "bg-white/5 text-white hover:bg-white/10",
                                    loadingTier === tier.name && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2 text-xs tracking-[0.2em] uppercase">
                                    {loadingTier === tier.name ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            {tier.cta}
                                            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                                {tier.popular && !loadingTier && (
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
