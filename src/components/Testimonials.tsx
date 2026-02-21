"use client"

import { motion } from "framer-motion"
import { Star, Quote, ShieldCheck } from "lucide-react"

import { LandingCmsTestimonials } from "../app/admin/cms/tabs/TestimonialsTab"

const DEFAULT_TESTIMONIALS: LandingCmsTestimonials = {
    headingLine1: "Trusted by ",
    headingLine2: "Early Adopters.",
    companies: "Acme Corp, GlobalTech, Nexus, Quantum, Stark Ind",
    items: [
        {
            name: "Sarah Jenkins",
            role: "CMO, Nexus Tech",
            content: "AI Email Marketing helped us increase open rates by 38% in just one month!",
            avatar: "SJ"
        },
        {
            name: "David Chen",
            role: "Founder, Orbital SaaS",
            content: "The AI recommendations are like having a marketing assistant 24/7.",
            avatar: "DC"
        }
    ]
}

export function Testimonials({ content }: { content?: LandingCmsTestimonials }) {
    const data = content || DEFAULT_TESTIMONIALS

    return (
        <section className="py-32 relative overflow-hidden bg-slate-950">
            {/* Subtle Grid Background */}
            <div className="absolute inset-x-0 h-full top-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_100%)] pointer-events-none z-0" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white outfit mb-6">
                            {data.headingLine1} <span className="text-indigo-500">{data.headingLine2}</span>
                        </h2>
                    </motion.div>
                </div>

                {/* Logo Strip / Social Proof */}
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-50 grayscale mb-24">
                    {data.companies.split(',').map((company: string, i: number) => (
                        <div key={i} className="text-xl font-black outfit tracking-widest uppercase">{company.trim()}</div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.items.map((test, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, duration: 0.6, type: "spring" }}
                            className="relative p-8 rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:bg-slate-900/60 hover:border-indigo-500/20 transition-all duration-500 group overflow-hidden"
                        >
                            {/* Decorative Quote Icon Backing */}
                            <Quote className="absolute -top-6 -right-6 h-32 w-32 text-indigo-500/5 group-hover:text-indigo-500/10 transition-colors duration-500 -rotate-12" />

                            {/* Stars */}
                            <div className="flex items-center gap-1 mb-6">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                                ))}
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed font-meduim italic mb-8 relative z-10">
                                "{test.content}"
                            </p>

                            <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
                                    {test.avatar}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-wide">{test.name}</h4>
                                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{test.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
