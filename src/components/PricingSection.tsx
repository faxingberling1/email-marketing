"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Check,
    X,
    Zap,
    Star,
    ChevronDown,
    HelpCircle,
    ArrowRight,
    Sparkles,
    Shield,
    Infinity as InfinityIcon,
    Globe,
    Lock,
    BarChart3,
    Heart,
    Mail
} from "lucide-react"
import Link from "next/link"

import { LandingCmsPricing } from "../app/admin/cms/tabs/PricingTab"

const DEFAULT_PRICING: LandingCmsPricing = {
    headingLine1: "Pricing That ",
    headingLine2: "Scales",
    subtitle: "Simple Plans. Powerful AI. Predictable Costs.",
    plans: [
        {
            name: "Starter",
            id: "starter",
            price: "29",
            desc: "Best for founders & small lists",
            accent: "emerald",
            badge: "",
            features: [
                "Up to 1,000 contacts",
                "10,000 emails / month",
                "300 AI credits / month",
                "AI subject line generator",
                "Basic email generation",
                "Real-time analytics",
                "1 automation workflow",
                "Standard templates",
                "Email support"
            ],
            cta: "Start Free Trial",
            bestFor: "testing campaigns and small audiences"
        },
        {
            name: "Growth",
            id: "growth",
            price: "79",
            desc: "Built for scaling startups",
            accent: "blue",
            badge: "⭐ Most Popular",
            features: [
                "Up to 10,000 contacts",
                "75,000 emails / month",
                "2,000 AI credits / month",
                "Advanced AI email generation",
                "AI segmentation clustering",
                "Send-time optimization",
                "A/B testing",
                "Up to 10 automation workflows",
                "Retargeting sequences",
                "Multi-language email generation",
                "Priority support"
            ],
            cta: "Upgrade to Growth",
            bestFor: "growing teams optimizing engagement"
        },
        {
            name: "Pro",
            id: "pro",
            price: "149",
            desc: "For advanced marketers & performance teams",
            accent: "purple",
            badge: "",
            features: [
                "Up to 25,000 contacts",
                "200,000 emails / month",
                "6,000 AI credits / month",
                "Predictive performance forecasting",
                "AI churn risk detection",
                "Revenue trend insights",
                "Unlimited automation workflows",
                "API access",
                "Webhooks",
                "Custom branding",
                "Advanced analytics dashboard"
            ],
            cta: "Go Pro",
            bestFor: "data-driven teams scaling aggressively"
        },
        {
            name: "Enterprise",
            id: "enterprise",
            price: "Custom",
            desc: "For high-volume teams and enterprises",
            accent: "red",
            badge: "",
            features: [
                "Custom contact limits",
                "Dedicated AI allocation",
                "SLA uptime guarantee",
                "SSO integration",
                "Dedicated infrastructure",
                "Custom AI tuning",
                "Account manager",
                "Advanced compliance support"
            ],
            cta: "Contact Sales",
            bestFor: "high-volume teams and enterprises"
        }
    ],
    faqs: [
        {
            q: "What happens if I exceed AI credits?",
            a: "You can purchase add-ons or upgrade anytime. We'll notify you when you reach 80% and 100% of your limit."
        },
        {
            q: "What happens if I exceed email limit?",
            a: "You’ll receive a notification before your limit is reached. You can upgrade to a higher tier instantly to maintain your campaign schedule."
        },
        {
            q: "Do credits roll over?",
            a: "Plan credits reset monthly on your billing date. Add-on credits are valid for 60 days from purchase."
        }
    ]
}

const aiAddOns = [
    { credits: "500", price: "$10" },
    { credits: "2,000", price: "$35" },
    { credits: "5,000", price: "$75" }
]

const COMPARISON_FEATURES = [
    { name: "Contacts", starter: "1k", growth: "10k", pro: "25k" },
    { name: "Emails / Month", starter: "10k", growth: "75k", pro: "200k" },
    { name: "AI Credits", starter: "300", growth: "2,000", pro: "6,000" },
    { name: "AI Email Generator", starter: true, growth: true, pro: true },
    { name: "Smart Segmentation", starter: false, growth: true, pro: true },
    { name: "Send-Time Optimization", starter: false, growth: true, pro: true },
    { name: "Predictive Forecasting", starter: false, growth: false, pro: true },
    { name: "A/B Testing", starter: false, growth: true, pro: true },
    { name: "Automation Workflows", starter: "1", growth: "10", pro: "Unlimited" },
    { name: "API Access", starter: false, growth: false, pro: true },
    { name: "Priority Support", starter: false, growth: true, pro: true },
]

const colorMap: Record<string, { bar: string, checkBg: string, checkBorder: string, checkIcon: string }> = {
    emerald: {
        bar: "bg-emerald-500",
        checkBg: "bg-emerald-500/10",
        checkBorder: "border-emerald-500/20",
        checkIcon: "text-emerald-400"
    },
    blue: {
        bar: "bg-blue-500",
        checkBg: "bg-blue-500/10",
        checkBorder: "border-blue-500/20",
        checkIcon: "text-blue-400"
    },
    purple: {
        bar: "bg-purple-500",
        checkBg: "bg-purple-500/10",
        checkBorder: "border-purple-500/20",
        checkIcon: "text-purple-400"
    },
    red: {
        bar: "bg-red-500",
        checkBg: "bg-red-500/10",
        checkBorder: "border-red-500/20",
        checkIcon: "text-red-400"
    }
}

export function PricingSection({ content }: { content?: LandingCmsPricing }) {
    const data = content || DEFAULT_PRICING
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [isYearly, setIsYearly] = useState(false)

    return (
        <section id="pricing" className="py-32 relative bg-slate-950 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl md:text-6xl font-black outfit text-white tracking-tighter">
                            {data.headingLine1} <span className="gradient-text">{data.headingLine2}</span> With You
                        </h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                            {data.subtitle}
                        </p>
                    </motion.div>

                    {/* Annual Toggle */}
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold transition-colors ${!isYearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="relative w-14 h-7 bg-white/5 border border-white/10 rounded-full p-1 transition-all hover:border-indigo-500/50"
                        >
                            <motion.div
                                animate={{ x: isYearly ? 28 : 0 }}
                                className="w-5 h-5 bg-indigo-500 rounded-full shadow-lg"
                            />
                        </button>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold transition-colors ${isYearly ? 'text-white' : 'text-slate-500'}`}>Yearly</span>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/20">
                                Save 20%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                    {data.plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`
                                relative flex flex-col p-8 rounded-[32px] border transition-all duration-500 hover:scale-[1.02]
                                ${plan.id === 'growth'
                                    ? 'glass border-indigo-500/50 bg-indigo-500/5 shadow-[0_20px_50px_rgba(99,102,241,0.1)] ring-1 ring-indigo-500/20'
                                    : 'bg-slate-900/40 border-white/5 hover:border-white/10'}
                            `}
                        >
                            {plan.badge && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 whitespace-nowrap">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`h-2 w-12 rounded-full mb-6 ${colorMap[plan.accent]?.bar || 'bg-indigo-500'} shadow-[0_0_15px_rgba(255,255,255,0.1)]`} />
                                <h3 className="text-2xl font-black outfit text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-500 text-xs font-bold leading-relaxed mb-6">{plan.desc}</p>

                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white italic">
                                        {plan.price === 'Custom' ? '' : '$'}
                                        {plan.price === 'Custom' ? 'Custom' : isYearly ? Math.floor(parseInt(plan.price) * 0.8) : plan.price}
                                    </span>
                                    {plan.price !== 'Custom' && (
                                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ month</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 flex-1">
                                {plan.features.slice(0, 9).map((feature, j) => (
                                    <div key={j} className="flex items-start gap-3 group/item">
                                        <div className={`mt-1 h-4 w-4 rounded-md flex items-center justify-center ${colorMap[plan.accent]?.checkBg || 'bg-indigo-500/10'} border ${colorMap[plan.accent]?.checkBorder || 'border-indigo-500/20'}`}>
                                            <Check className={`h-3 w-3 ${colorMap[plan.accent]?.checkIcon || 'text-indigo-400'}`} />
                                        </div>
                                        <span className="text-slate-400 text-xs font-medium group-hover/item:text-slate-200 transition-colors">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/5 mt-auto">
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6 opacity-60">
                                    Best for: {plan.bestFor}
                                </p>
                                {plan.id === 'enterprise' ? (
                                    <Link href="/contact-sales" className="block">
                                        <button className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.03] active:scale-95 bg-white/5 text-white hover:bg-white/10 border border-white/5">
                                            {plan.cta}
                                        </button>
                                    </Link>
                                ) : (
                                    <button className={`
                                        w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.03] active:scale-95
                                        ${plan.id === 'growth'
                                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500'
                                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'}
                                    `}>
                                        {plan.cta}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* AI Credits Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Neural Assets</span>
                        </div>

                        <h2 className="text-4xl font-black outfit text-white leading-tight">
                            What Are <span className="gradient-text">AI Credits?</span>
                        </h2>

                        <p className="text-slate-400 font-medium leading-relaxed">
                            AI credits power intelligent features that give you a strategic advantage. Instead of unlimited usage, we provide a generous allocation that resets monthly, ensuring high performance for everyone.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Mail, label: "Email Generation" },
                                { icon: Sparkles, label: "Subject Optimization" },
                                { icon: BarChart3, label: "Predictive Forecasting" },
                                { icon: Globe, label: "Smart Segmentation" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <item.icon className="h-4 w-4 text-indigo-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Zap className="h-24 w-24 text-indigo-400" />
                        </div>

                        <h3 className="text-xl font-black text-white outfit mb-8 flex items-center gap-3">
                            AI Credit Add-Ons
                        </h3>

                        <div className="space-y-3">
                            {aiAddOns.map((addon, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-white/5 hover:border-indigo-500/30 transition-all group">
                                    <div className="flex flex-col">
                                        <span className="text-white font-black text-xl italic">{addon.credits} Credits</span>
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Neural allocation</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-2xl font-black text-indigo-400 outfit">{addon.price}</span>
                                        <button className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-indigo-600 transition-colors group-hover:scale-110">
                                            <ArrowRight className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            Credits reset monthly. Add-ons valid for 60 days. No surprise charges.
                        </p>
                    </motion.div>
                </div>

                {/* Comparison Table */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black outfit text-white mb-4">Feature Comparison</h2>
                        <p className="text-slate-500 font-medium">Drill down into the tactical specifics of each tier.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[800px] border border-white/5 rounded-[40px] bg-slate-900/40 backdrop-blur-xl overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Feature Infrastructure</th>
                                        <th className="p-8 text-center">
                                            <span className="text-sm font-black outfit text-white uppercase">Starter</span>
                                        </th>
                                        <th className="p-8 text-center bg-indigo-500/5">
                                            <span className="text-sm font-black outfit text-indigo-400 uppercase">Growth</span>
                                        </th>
                                        <th className="p-8 text-center">
                                            <span className="text-sm font-black outfit text-white uppercase">Pro</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON_FEATURES.map((feature, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-8 text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{feature.name}</td>
                                            <td className="p-8 text-center">
                                                {typeof feature.starter === 'boolean' ? (
                                                    feature.starter ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-slate-700 mx-auto" />
                                                ) : (
                                                    <span className="text-xs font-black text-white italic">{feature.starter}</span>
                                                )}
                                            </td>
                                            <td className="p-8 text-center bg-indigo-500/5">
                                                {typeof feature.growth === 'boolean' ? (
                                                    feature.growth ? <Check className="h-4 w-4 text-indigo-400 mx-auto" /> : <X className="h-4 w-4 text-slate-700 mx-auto" />
                                                ) : (
                                                    <span className="text-xs font-black text-indigo-400 italic">{feature.growth}</span>
                                                )}
                                            </td>
                                            <td className="p-8 text-center">
                                                {typeof feature.pro === 'boolean' ? (
                                                    feature.pro ? <Check className="h-4 w-4 text-purple-400 mx-auto" /> : <X className="h-4 w-4 text-slate-700 mx-auto" />
                                                ) : (
                                                    <span className="text-xs font-black text-white italic">{feature.pro}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-32">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            Intelligence Hub
                        </div>
                        <h2 className="text-4xl font-black outfit text-white mb-4">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {data.faqs.map((faq, i) => (
                            <div key={i} className="group">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className={`
                                        w-full p-8 rounded-[2rem] border transition-all text-left flex items-center justify-between
                                        ${openFaq === i
                                            ? 'bg-slate-900 border-white/20'
                                            : 'bg-slate-900/40 border-white/5 hover:border-white/10'}
                                    `}
                                >
                                    <span className="text-lg font-bold text-white pr-8">{faq.q}</span>
                                    <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-8 text-slate-400 font-medium leading-relaxed border-x border-b border-white/10 rounded-b-[2rem] -mt-8 pt-16 bg-slate-900/40">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Footer */}
                <div className="text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-slate-500 opacity-60">
                        <div className="flex items-center gap-3">
                            <Shield className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">14-Day Free Trial</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Lock className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">No Credit Card Required</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Heart className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Cancel Anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
