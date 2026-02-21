"use client"

import { useState } from "react"
import { CheckCircle2, Zap, Shield, Sparkles, Building2, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { createCheckoutSession } from "@/app/(dashboard)/billing/actions"

const PLANS = [
    {
        id: "starter",
        name: "Starter",
        priceMonthly: 29,
        priceMonthlyId: "price_starter_monthly", // Placeholder
        priceYearly: 24,
        priceYearlyId: "price_starter_yearly", // Placeholder
        icon: Zap,
        color: "text-sky-400",
        bg: "bg-sky-500/10",
        borderColor: "border-sky-500/20",
        features: ["1,000 Contacts", "10,000 Emails/mo", "300 AI Credits", "Basic Analytics"],
    },
    {
        id: "growth",
        name: "Growth",
        priceMonthly: 79,
        priceMonthlyId: "price_growth_monthly", // Placeholder
        priceYearly: 64,
        priceYearlyId: "price_growth_yearly", // Placeholder
        icon: Sparkles,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20",
        popular: true,
        features: ["10,000 Contacts", "75,000 Emails/mo", "2,000 AI Credits", "Advanced Segmentation", "A/B Testing"],
    },
    {
        id: "pro",
        name: "Professional",
        priceMonthly: 199,
        priceMonthlyId: "price_pro_monthly", // Placeholder
        priceYearly: 159,
        priceYearlyId: "price_pro_yearly", // Placeholder
        icon: Shield,
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        features: ["25,000 Contacts", "200,000 Emails/mo", "6,000 AI Credits", "API Access", "Predictive Analytics"],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        priceMonthly: 599,
        priceMonthlyId: "price_enterprise_monthly", // Placeholder
        priceYearly: 479,
        priceYearlyId: "price_enterprise_yearly", // Placeholder
        icon: Globe,
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        borderColor: "border-purple-500/20",
        features: ["1M+ Contacts", "10M+ Emails/mo", "100,000 AI Credits", "Dedicated Manager", "SLA Support"],
    }
]

export function PlanSelector({ currentPlan }: { currentPlan: string }) {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

    const handleSelectPlan = async (priceId: string, planId: string) => {
        setLoadingPlan(planId)
        try {
            const result = await createCheckoutSession(priceId)
            if (result.url) {
                window.location.href = result.url
            } else {
                alert("Failed to create checkout session")
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred")
        } finally {
            setLoadingPlan(null)
        }
    }

    return (
        <div className="space-y-12">
            {/* Cycle Toggle */}
            <div className="flex justify-center">
                <div className="bg-slate-900 border border-white/5 p-1 rounded-2xl flex items-center gap-1 shadow-2xl">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${billingCycle === "monthly" ? "bg-white text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${billingCycle === "yearly" ? "bg-white text-slate-950 shadow-lg" : "text-slate-500 hover:text-white"
                            }`}
                    >
                        Yearly
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            -20%
                        </span>
                    </button>
                </div>
            </div>

            {/* Plan Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {PLANS.map((plan) => {
                    const isCurrent = currentPlan.toLowerCase() === plan.id
                    const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly
                    const priceId = billingCycle === "monthly" ? plan.priceMonthlyId : plan.priceYearlyId
                    const isLoading = loadingPlan === plan.id

                    return (
                        <div
                            key={plan.id}
                            className={`relative rounded-3xl p-8 transition-all duration-500 group border ${plan.popular ? "bg-indigo-600/5 border-indigo-500/30 shadow-2xl shadow-indigo-500/10" : "bg-slate-900/40 border-white/5 hover:border-white/10"
                                } ${isCurrent ? "ring-2 ring-indigo-500 ring-offset-4 ring-offset-slate-950" : ""}`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    Most Popular
                                </div>
                            )}

                            <div className={`h-12 w-12 rounded-2xl ${plan.bg} flex items-center justify-center mb-6 border ${plan.borderColor} group-hover:scale-110 transition-transform`}>
                                <plan.icon className={`h-6 w-6 ${plan.color}`} />
                            </div>

                            <h3 className="text-xl font-black text-white outfit mb-1">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-white outfit">${price}</span>
                                <span className="text-sm font-bold text-slate-500">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feat) => (
                                    <div key={feat} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span className="text-xs font-bold text-slate-400">{feat}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleSelectPlan(priceId, plan.id)}
                                disabled={isCurrent || isLoading}
                                className={`w-full py-4 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 ${isCurrent
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : isLoading
                                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                            : plan.popular
                                                ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-500/20 active:scale-95"
                                                : "bg-white/5 text-white border border-white/10 hover:bg-white/10 active:scale-95"
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2 animate-pulse">Initializing...</span>
                                ) : isCurrent ? "Active Plan" : isCurrent ? "Upgrade Now" : "Select Plan"}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
