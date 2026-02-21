"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Mail, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Plan {
    id: string
    name: string
    price: string
    period: string
    features: string[]
    recommended?: boolean
    color: string
}

const PLANS: Plan[] = [
    {
        id: "free",
        name: "Free",
        price: "$0",
        period: "Forever",
        features: ["1k Contacts", "5k Emails", "Basic Templates", "Support"],
        color: "slate"
    },
    {
        id: "starter",
        name: "Starter",
        price: "$29",
        period: "per month",
        features: ["5k Contacts", "25k Emails", "AI Copy Assistant", "Custom Branding"],
        color: "indigo"
    },
    {
        id: "growth",
        name: "Growth",
        price: "$79",
        period: "per month",
        features: ["25k Contacts", "Unlimited Emails", "A/B Testing", "Neural Send-Time"],
        recommended: true,
        color: "purple"
    },
    {
        id: "pro",
        name: "Pro",
        price: "$199",
        period: "per month",
        features: ["100k+ Contacts", "Priority AI Node", "Custom Workflows", "Dedicated Manager"],
        color: "emerald"
    }
]

interface PlanSelectorProps {
    currentPlan: string
}

export function PlanSelector({ currentPlan }: PlanSelectorProps) {
    const [selected, setSelected] = useState(currentPlan)

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {PLANS.map((plan) => (
                <div
                    key={plan.id}
                    onClick={() => setSelected(plan.id)}
                    className={cn(
                        "relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group flex flex-col",
                        selected === plan.id
                            ? `bg-${plan.color}-500/10 border-${plan.color}-500/40`
                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                    )}
                >
                    {plan.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                            AI Recommended
                        </div>
                    )}

                    <div className="mb-8">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">{plan.name}</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-white outfit">{plan.price}</span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{plan.period}</span>
                        </div>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Check className={cn("h-3.5 w-3.5 shrink-0 mt-0.5", selected === plan.id ? `text-${plan.color}-400` : "text-slate-700")} />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {currentPlan === plan.id ? (
                        <div className="w-full text-center py-4 bg-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/5 italic">
                            Currently Active
                        </div>
                    ) : (
                        <button className={cn(
                            "w-full py-4 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest transition-all",
                            selected === plan.id ? `bg-${plan.color}-500 shadow-xl shadow-${plan.color}-500/20` : "bg-white/5 hover:bg-white/10"
                        )}>
                            Upgrade Sequence
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}
