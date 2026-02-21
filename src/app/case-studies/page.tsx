"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LandingHeader } from "@/components/LandingHeader"
import { LandingFooter } from "@/components/LandingBlocks"
import {
    ArrowRight, TrendingUp, ChevronRight, Play, Star,
    Quote, Filter, BarChart3, Clock, Users, Zap,
    ShoppingCart, Monitor, Heart, Calendar, LineChart, GraduationCap,
    CheckCircle, ArrowUpRight
} from "lucide-react"
import { useState } from "react"

/* ─── DATA ─────────────────────────────────────────────────────────────── */

const industries = ["All Industries", "E-Commerce", "SaaS", "Healthcare", "Events", "FinTech", "EdTech"]

const caseStudies = [
    {
        id: "nexus-retail",
        company: "Nexus Retail Co.",
        industry: "E-Commerce",
        industryIcon: ShoppingCart,
        logo: "NR",
        color: "from-indigo-500 to-purple-600",
        accentColor: "indigo",
        featured: true,
        result: "+340%",
        metric: "Email Revenue",
        timeframe: "90 days",
        description:
            "How Nexus Retail transformed their abandoned cart sequences with AI-personalized subject lines, recovering $2.4M in lost revenue in a single quarter.",
        challenge:
            "Cart abandonment was costing Nexus Retail over $8M annually. Their generic recovery emails had a dismal 12% open rate, and their team lacked the bandwidth to manually personalize at scale.",
        solution:
            "MailMind's AI analyzed each shopper's browsing history, purchase patterns, and time-of-engagement data to generate hyper-personalized subject lines and dynamic body copy — all automatically. Three-touch recovery sequences were deployed within 24 hours of cart abandonment.",
        outcome:
            "Open rates jumped from 12% to 68.2% within the first month. Cart recovery revenue surpassed $2.4M in Q3 alone, representing a 340% increase year-over-year.",
        tags: ["Automation", "Personalization", "Recovery"],
        openRate: "68.2%",
        clickRate: "24.1%",
        revenue: "$2.4M",
        roiMultiple: "11×",
        timeToValue: "14 days",
        teamSize: "3 people",
        quote:
            "MailMind's AI rewrote our recovery strategy. We went from 12% open rates to nearly 70% — it's like having a world-class copywriter working 24/7.",
        author: "Sarah Chen",
        role: "VP of Digital Marketing",
        authorInitials: "SC",
        beforeAfter: [
            { label: "Open Rate", before: "12%", after: "68.2%", positive: true },
            { label: "Recovery Rate", before: "2.1%", after: "9.4%", positive: true },
            { label: "Revenue/Sequence", before: "$180K", after: "$800K", positive: true },
        ],
    },
    {
        id: "apex-saas",
        company: "Apex SaaS",
        industry: "SaaS",
        industryIcon: Monitor,
        logo: "AP",
        color: "from-sky-500 to-indigo-600",
        accentColor: "sky",
        featured: false,
        result: "+210%",
        metric: "Trial Conversions",
        timeframe: "60 days",
        description:
            "Apex SaaS used MailMind's predictive send-time optimization to reach leads at peak engagement windows, doubling their trial-to-paid conversion rate.",
        challenge:
            "Despite strong product-market fit, Apex was losing 78% of trial users before conversion. Nurture emails were sent at fixed times and had generic, one-size-fits-all content.",
        solution:
            "MailMind identified each trial user's peak engagement window and tailored activation email sequences based on in-product behavior — what features they'd used, where they'd dropped off, and what outcomes they'd achieved.",
        outcome:
            "Trial-to-paid conversions increased by 210% in 60 days. The sales cycle shortened by three weeks on average as leads arrived to sales calls already activated and informed.",
        tags: ["Send-Time AI", "Segmentation", "Nurture"],
        openRate: "54.7%",
        clickRate: "18.9%",
        revenue: "$890K",
        roiMultiple: "8×",
        timeToValue: "21 days",
        teamSize: "2 people",
        quote:
            "We cut our sales cycle by 3 weeks just by ensuring our nurture emails arrived when prospects were most receptive. The data doesn't lie.",
        author: "Marcus Webb",
        role: "Head of Growth",
        authorInitials: "MW",
        beforeAfter: [
            { label: "Trial Conversion", before: "6.2%", after: "19.2%", positive: true },
            { label: "Sales Cycle", before: "42 days", after: "21 days", positive: true },
            { label: "CAC", before: "$420", after: "$180", positive: true },
        ],
    },
    {
        id: "healthfirst",
        company: "HealthFirst Clinics",
        industry: "Healthcare",
        industryIcon: Heart,
        logo: "HF",
        color: "from-emerald-500 to-teal-600",
        accentColor: "emerald",
        featured: false,
        result: "+180%",
        metric: "Patient Re-engagement",
        timeframe: "45 days",
        description:
            "HealthFirst brought dormant patients back with HIPAA-compliant, deeply personalized re-engagement campaigns, achieving remarkable retention rates.",
        challenge:
            "HealthFirst had 42,000 dormant patients who hadn't scheduled an appointment in 18+ months. Strict HIPAA compliance requirements had previously made personalized outreach feel too risky.",
        solution:
            "MailMind's HIPAA-compliant segmentation engine identified lapsed patients by specialty and last visit date, generating personalized recall messages that respected compliance guardrails while still feeling human and relevant.",
        outcome:
            "Within 45 days, 18,000 dormant patients re-engaged, booking over $1.1M in appointments. The compliance module gave the team confidence to run continuous re-engagement campaigns.",
        tags: ["Compliance", "Re-engagement", "Retention"],
        openRate: "61.3%",
        clickRate: "22.4%",
        revenue: "$1.1M",
        roiMultiple: "14×",
        timeToValue: "10 days",
        teamSize: "1 person",
        quote:
            "The compliance guardrails gave us confidence to finally run aggressive re-engagement campaigns. Results exceeded every KPI we set.",
        author: "Dr. Priya Sharma",
        role: "CMO",
        authorInitials: "PS",
        beforeAfter: [
            { label: "Re-engagement Rate", before: "4%", after: "42%", positive: true },
            { label: "Appt. Recovery", before: "800/mo", after: "4,200/mo", positive: true },
            { label: "Compliance Flags", before: "3/month", after: "0", positive: true },
        ],
    },
    {
        id: "stellar-events",
        company: "Stellar Events",
        industry: "Events",
        industryIcon: Calendar,
        logo: "SE",
        color: "from-amber-500 to-orange-600",
        accentColor: "amber",
        featured: false,
        result: "+415%",
        metric: "Ticket Sales via Email",
        timeframe: "30 days",
        description:
            "Stellar Events generated 4× ticket sales through hyper-targeted countdown sequences and AI-generated urgency copy that felt personal, not pushy.",
        challenge:
            "Stellar was relying on social media for event promotion. Their email list was underutilized — a single blast per event was generating only 6% of total ticket sales.",
        solution:
            "MailMind built event-specific countdown sequences: announcement, social-proof mid-series, scarcity-trigger, and final-48-hour emails — each personalized by attendee history, genre preferences, and geographic proximity to each event.",
        outcome:
            "Email's share of ticket sales rose from 6% to 31% across 12 events. Four consecutive sellouts followed the first deployment. Total revenue attributable to email campaigns hit $3.2M.",
        tags: ["Urgency Sequences", "A/B Testing", "Copywriting AI"],
        openRate: "72.8%",
        clickRate: "31.2%",
        revenue: "$3.2M",
        roiMultiple: "22×",
        timeToValue: "7 days",
        teamSize: "2 people",
        quote:
            "Every event we've run since adopting MailMind has sold out. The AI knows exactly what message drives action at exactly the right time.",
        author: "Tyler Brooks",
        role: "Director of Partnerships",
        authorInitials: "TB",
        beforeAfter: [
            { label: "Email Share of Sales", before: "6%", after: "31%", positive: true },
            { label: "Avg. Open Rate", before: "18%", after: "72.8%", positive: true },
            { label: "Revenue per Event", before: "$120K", after: "$620K", positive: true },
        ],
    },
    {
        id: "luminary-finance",
        company: "Luminary Finance",
        industry: "FinTech",
        industryIcon: LineChart,
        logo: "LF",
        color: "from-rose-500 to-pink-600",
        accentColor: "rose",
        featured: false,
        result: "+290%",
        metric: "Lead Qualification Rate",
        timeframe: "75 days",
        description:
            "Luminary Finance used MailMind's behavioral scoring and dynamic segmentation to prioritize high-intent leads, dramatically improving sales efficiency.",
        challenge:
            "Luminary's sales team was spending 70% of their time on cold, unqualified leads sourced from gated content downloads. Email nurture was minimal — a weekly newsletter blast with no personalization.",
        solution:
            "MailMind implemented a behavioral lead scoring model tracking content consumption, email engagement depth, and return visit frequency. Leads crossing threshold scores entered accelerated high-touch sequences; lower-scored leads received steady nurture until ready.",
        outcome:
            "SQLs (Sales Qualified Leads) per month increased from 34 to 133. Average deal value increased 40% as sales conversations started with better-prepared prospects. $4.8M in pipeline generated over 75 days.",
        tags: ["Lead Scoring", "Dynamic Segments", "Compliance"],
        openRate: "49.1%",
        clickRate: "19.7%",
        revenue: "$4.8M",
        roiMultiple: "18×",
        timeToValue: "28 days",
        teamSize: "4 people",
        quote:
            "Our sales team now focuses only on warm, pre-qualified leads. MailMind does the heavy lifting of identifying who's actually ready to convert.",
        author: "Amanda Torres",
        role: "Growth Lead",
        authorInitials: "AT",
        beforeAfter: [
            { label: "SQLs / Month", before: "34", after: "133", positive: true },
            { label: "Avg. Deal Value", before: "$18K", after: "$25K", positive: true },
            { label: "Sales Time on Cold", before: "70%", after: "18%", positive: true },
        ],
    },
    {
        id: "edupath",
        company: "EduPath Online",
        industry: "EdTech",
        industryIcon: GraduationCap,
        logo: "EP",
        color: "from-violet-500 to-purple-600",
        accentColor: "violet",
        featured: false,
        result: "+520%",
        metric: "Course Enrollment",
        timeframe: "120 days",
        description:
            "EduPath Online leveraged AI-generated course recommendation emails to match learners with the right content, skyrocketing enrollment across all categories.",
        challenge:
            "EduPath's 180,000-member email list was receiving the same weekly course digest regardless of skill level, learning history, or interests. Unsubscribe rates were rising and enrollment from email had flatlined.",
        solution:
            "MailMind built a recommendation engine that mapped each subscriber's completed courses, browsing behavior, and stated goals to a curated 3-course recommendation email — generated fresh each week, personalized to each learner.",
        outcome:
            "Unsubscribe rates dropped 82%. Enrollment from email increased 520% over 120 days. The platform added $1.9M in subscription upgrades as learners accelerated through curricula.",
        tags: ["Recommendations", "Personalization", "Lifecycle"],
        openRate: "66.4%",
        clickRate: "28.3%",
        revenue: "$1.9M",
        roiMultiple: "9×",
        timeToValue: "18 days",
        teamSize: "1 person",
        quote:
            "When emails feel like they were written for exactly you, conversions are inevitable. MailMind makes that kind of personalization scalable.",
        author: "Leo Nakamura",
        role: "Product & Growth Manager",
        authorInitials: "LN",
        beforeAfter: [
            { label: "Email Enrollment", before: "820/mo", after: "5,084/mo", positive: true },
            { label: "Unsubscribe Rate", before: "2.8%", after: "0.5%", positive: true },
            { label: "Revenue from Email", before: "$34K/mo", after: "$211K/mo", positive: true },
        ],
    },
]

const platformStats = [
    { value: "2.3B+", label: "Emails Optimized", icon: Zap },
    { value: "94%", label: "Avg. Deliverability", icon: TrendingUp },
    { value: "$18M+", label: "Revenue Attributed", icon: BarChart3 },
    { value: "340+", label: "Companies Scaled", icon: Users },
]

const logos = [
    "Nexus Retail", "Apex SaaS", "HealthFirst", "Stellar Events",
    "Luminary Finance", "EduPath", "Vortex Media", "Pinnacle Health",
    "Storm Analytics", "Orbit Commerce",
]

/* ─── FEATURED CARD ─────────────────────────────────────────────────────── */
function FeaturedCard({ cs }: { cs: typeof caseStudies[0] }) {
    const Icon = cs.industryIcon
    return (
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="relative bg-slate-900/60 border border-white/5 rounded-[2rem] overflow-hidden hover:border-indigo-500/20 transition-all duration-500 group">
            <div className={`h-1.5 w-full bg-gradient-to-r ${cs.color}`} />

            <div className="p-8 md:p-12 grid md:grid-cols-2 gap-10 items-start">
                {/* Left */}
                <div>
                    {/* Company tag */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${cs.color} flex items-center justify-center text-white font-black text-base shadow-lg`}>
                            {cs.logo}
                        </div>
                        <div>
                            <div className="font-black text-white text-lg outfit leading-tight">{cs.company}</div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                <Icon className="h-3 w-3" />{cs.industry}
                            </div>
                        </div>
                        <span className="ml-auto px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                            Featured
                        </span>
                    </div>

                    <div className="mb-4">
                        <div className="text-6xl font-black outfit text-white">{cs.result}</div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{cs.metric} in {cs.timeframe}</div>
                    </div>

                    <p className="text-slate-300 font-medium leading-relaxed mb-6 text-[15px]">{cs.description}</p>

                    {/* Key metrics row */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {[
                            { label: "Open Rate", value: cs.openRate },
                            { label: "Click Rate", value: cs.clickRate },
                            { label: "Revenue", value: cs.revenue },
                        ].map(m => (
                            <div key={m.label} className="bg-white/[0.04] border border-white/5 rounded-xl p-3 text-center">
                                <div className="font-black text-white text-sm">{m.value}</div>
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{m.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {cs.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full">{tag}</span>
                        ))}
                    </div>

                    {/* Read more */}
                    <button className="group/btn flex items-center gap-2 text-indigo-400 hover:text-white font-black text-sm uppercase tracking-widest transition-colors">
                        Read Full Story <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Right — challenge / solution / outcome */}
                <div className="space-y-5">
                    {[
                        { label: "Challenge", text: cs.challenge, dot: "bg-rose-500" },
                        { label: "Solution", text: cs.solution, dot: "bg-indigo-500" },
                        { label: "Outcome", text: cs.outcome, dot: "bg-emerald-500" },
                    ].map(item => (
                        <div key={item.label} className="bg-white/[0.025] border border-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`h-2 w-2 rounded-full ${item.dot}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">{item.text}</p>
                        </div>
                    ))}

                    {/* Before / After */}
                    <div className="bg-white/[0.025] border border-white/5 rounded-2xl p-5">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Before vs. After</div>
                        <div className="space-y-3">
                            {cs.beforeAfter.map(ba => (
                                <div key={ba.label} className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 font-bold">{ba.label}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-slate-600 line-through font-bold">{ba.before}</span>
                                        <ArrowRight className="h-3 w-3 text-slate-700" />
                                        <span className="text-emerald-400 font-black">{ba.after}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="relative border border-white/5 rounded-2xl p-5 bg-white/[0.02]">
                        <Quote className="absolute top-4 right-4 h-5 w-5 text-indigo-500/20" />
                        <p className="text-slate-300 text-sm italic font-medium leading-relaxed mb-3">"{cs.quote}"</p>
                        <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${cs.color} flex items-center justify-center text-white font-black text-xs`}>{cs.authorInitials}</div>
                            <div>
                                <div className="text-xs font-black text-white">{cs.author}</div>
                                <div className="text-[10px] font-bold text-slate-600">{cs.role}</div>
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>
        </motion.div>
    )
}

/* ─── COMPACT CARD ──────────────────────────────────────────────────────── */
function CompactCard({ cs, index }: { cs: typeof caseStudies[0]; index: number }) {
    const [expanded, setExpanded] = useState(false)
    const Icon = cs.industryIcon
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: (index % 2) * 0.08 }}
            className="group bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/20 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/5"
        >
            <div className={`h-1 w-full bg-gradient-to-r ${cs.color}`} />
            <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${cs.color} flex items-center justify-center text-white font-black text-base shadow-lg`}>{cs.logo}</div>
                        <div>
                            <div className="font-black text-white text-base outfit">{cs.company}</div>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                <Icon className="h-3 w-3" />{cs.industry}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-white outfit">{cs.result}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cs.metric}</div>
                    </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed font-medium mb-5">{cs.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                    {[
                        { label: "Open Rate", value: cs.openRate },
                        { label: "Click Rate", value: cs.clickRate },
                        { label: "Revenue", value: cs.revenue },
                    ].map(m => (
                        <div key={m.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 text-center">
                            <div className="font-black text-white text-sm">{m.value}</div>
                            <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">{m.label}</div>
                        </div>
                    ))}
                </div>

                {/* Efficiency stats row */}
                <div className="flex items-center gap-4 mb-5 text-[11px] font-bold text-slate-600">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Value in {cs.timeToValue}</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" />ROI {cs.roiMultiple}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{cs.teamSize}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {cs.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-white/[0.04] border border-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">{tag}</span>
                    ))}
                </div>

                {/* Expandable detail */}
                <AnimatePresence>
                    {expanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden">
                            <div className="space-y-3 mb-5">
                                {[
                                    { label: "Challenge", text: cs.challenge, dot: "bg-rose-500" },
                                    { label: "Solution", text: cs.solution, dot: "bg-indigo-500" },
                                    { label: "Outcome", text: cs.outcome, dot: "bg-emerald-500" },
                                ].map(item => (
                                    <div key={item.label} className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <div className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                                        </div>
                                        <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.text}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Before / after table */}
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-5">
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">Before vs. After</div>
                                <div className="space-y-2.5">
                                    {cs.beforeAfter.map(ba => (
                                        <div key={ba.label} className="flex items-center justify-between text-xs">
                                            <span className="text-slate-500 font-bold">{ba.label}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-700 line-through font-bold">{ba.before}</span>
                                                <ArrowRight className="h-3 w-3 text-slate-700" />
                                                <span className="text-emerald-400 font-black">{ba.after}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quote + expand toggle */}
                <blockquote className="border-l-2 border-white/10 pl-4 mb-5">
                    <p className="text-slate-400 text-xs italic font-medium leading-relaxed">"{cs.quote}"</p>
                    <footer className="mt-1.5 text-[10px] text-slate-600 font-bold">— {cs.author}, {cs.role}</footer>
                </blockquote>

                <button onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors py-2 border border-white/5 rounded-xl hover:border-indigo-500/20 bg-white/[0.02] hover:bg-indigo-500/5">
                    {expanded ? "Collapse" : "Read Full Story"}
                    <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-90" : ""}`} />
                </button>
            </div>
        </motion.div>
    )
}

/* ─── TESTIMONIAL STRIP ─────────────────────────────────────────────────── */
const testimonials = [
    { quote: "We 3× our pipeline in 60 days. Our only regret is not starting sooner.", author: "Jamie Ko", role: "CMO, Vortex Media", initials: "JK", stars: 5 },
    { quote: "MailMind replaced three separate tools and cut our ops cost by $40K/year.", author: "Daniel Park", role: "Ops Lead, Pinnacle Health", initials: "DP", stars: 5 },
    { quote: "The AI copy is so good our subscribers think we have a dedicated writer per person.", author: "Reena Shah", role: "Marketing Dir., Orbit Commerce", initials: "RS", stars: 5 },
]

/* ─── PAGE ──────────────────────────────────────────────────────────────── */
export default function CaseStudiesPage() {
    const [activeIndustry, setActiveIndustry] = useState("All Industries")

    const featured = caseStudies.find(c => c.featured)!
    const rest = caseStudies
        .filter(c => !c.featured)
        .filter(c => activeIndustry === "All Industries" || c.industry === activeIndustry)

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <LandingHeader />

            {/* ── Hero ── */}
            <section className="relative pt-44 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10 blur-3xl" />
                <div className="absolute bottom-0 left-[10%] w-[500px] h-[300px] bg-purple-600/5 blur-[120px] -z-10" />

                <div className="max-w-5xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8">
                        <TrendingUp className="h-4 w-4" /> Real Companies. Verified Results.
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black outfit tracking-tighter text-white mb-6 leading-[1.05]">
                        Companies That <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
                            Scaled With MailMind
                        </span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
                        In-depth stories of how forward-thinking companies turned email into their highest-ROI growth channel — with exact numbers, before/after data, and the exact playbooks we ran.
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup"
                            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20">
                            Start Free Trial <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button
                            onClick={() => document.getElementById("studies")?.scrollIntoView({ behavior: "smooth" })}
                            className="flex items-center gap-2 text-slate-400 hover:text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all bg-white/5 hover:bg-white/10 border border-white/5">
                            <Play className="h-4 w-4" /> View Case Studies
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ── Platform Stats Bar ── */}
            <section className="py-12 border-y border-white/5 bg-slate-900/30">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {platformStats.map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                className="text-center group">
                                <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-3 group-hover:bg-indigo-500/20 transition-colors">
                                    <Icon className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div className="text-3xl font-black outfit text-white mb-1">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* ── Logo ticker strip ── */}
            <section className="py-10 border-b border-white/5 overflow-hidden">
                <div className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-6">
                    Trusted by 340+ High-Growth Companies
                </div>
                <div className="flex gap-12 overflow-hidden">
                    <motion.div className="flex gap-12 shrink-0"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
                        {[...logos, ...logos].map((logo, i) => (
                            <span key={i} className="text-slate-700 font-black text-sm uppercase tracking-widest whitespace-nowrap hover:text-slate-500 transition-colors cursor-default">
                                {logo}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Featured Case Study ── */}
            <section id="studies" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Featured Case Study</span>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <FeaturedCard cs={featured} />
                </div>
            </section>

            {/* ── Industry Filter + Cards ── */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto">
                    {/* Filter row */}
                    <div className="flex items-center gap-3 mb-10 flex-wrap">
                        <Filter className="h-4 w-4 text-slate-600" />
                        {industries.map(ind => (
                            <button key={ind} onClick={() => setActiveIndustry(ind)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${activeIndustry === ind
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/15"
                                    : "border-white/5 text-slate-500 hover:text-white hover:border-white/10 bg-white/[0.02]"
                                    }`}>
                                {ind}
                            </button>
                        ))}
                        <span className="ml-auto text-[11px] font-bold text-slate-600">{rest.length} {rest.length === 1 ? "story" : "stories"}</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {rest.length > 0 ? (
                            <motion.div key={activeIndustry} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {rest.map((cs, i) => <CompactCard key={cs.id} cs={cs} index={i} />)}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-24 text-slate-600 font-bold">
                                No case studies yet for this industry — check back soon.
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ── Testimonial Strip ── */}
            <section className="py-20 px-6 border-t border-white/5 bg-slate-900/20">
                <div className="max-w-7xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-center mb-12">
                        <h2 className="text-3xl font-black outfit text-white mb-3">What Our Customers Say</h2>
                        <p className="text-slate-500 font-medium">Unprompted. Unscripted. Real.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                className="bg-white/[0.03] border border-white/5 rounded-3xl p-7 hover:border-indigo-500/15 transition-all duration-300">
                                <div className="flex gap-0.5 mb-5">
                                    {Array.from({ length: t.stars }).map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <Quote className="h-6 w-6 text-indigo-500/20 mb-3" />
                                <p className="text-slate-300 font-medium leading-relaxed text-sm italic mb-6">"{t.quote}"</p>
                                <div className="flex items-center gap-3 border-t border-white/5 pt-5">
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">{t.initials}</div>
                                    <div>
                                        <div className="font-black text-white text-sm">{t.author}</div>
                                        <div className="text-[11px] font-bold text-slate-600">{t.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Results by the numbers ── */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                        <h2 className="text-3xl font-black outfit text-white mb-3">Proven Across Every Vertical</h2>
                        <p className="text-slate-500 font-medium">Average results across all MailMind customer segments.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            { label: "Avg. Open Rate Increase", value: "+312%", sub: "vs. pre-MailMind baseline", icon: TrendingUp, color: "text-indigo-400" },
                            { label: "Time to First Results", value: "14 days", sub: "median across all customers", icon: Clock, color: "text-emerald-400" },
                            { label: "Avg. ROI", value: "12×", sub: "revenue vs. platform cost", icon: BarChart3, color: "text-amber-400" },
                        ].map((item, i) => {
                            const Icon = item.icon
                            return (
                                <motion.div key={item.label}
                                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 text-center hover:border-indigo-500/15 transition-all">
                                    <Icon className={`h-6 w-6 ${item.color} mx-auto mb-4`} />
                                    <div className="text-5xl font-black outfit text-white mb-2">{item.value}</div>
                                    <div className="font-black text-slate-400 text-sm mb-1">{item.label}</div>
                                    <div className="text-xs font-bold text-slate-600">{item.sub}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ── What's included ── */}
            <section className="py-20 px-6 border-t border-white/5 bg-slate-900/20">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <h2 className="text-4xl font-black outfit text-white tracking-tighter mb-4">
                            Everything You Need to Replicate These Results
                        </h2>
                        <p className="text-slate-400 font-medium leading-relaxed mb-8">
                            MailMind gives every customer access to the same AI engine, the same infrastructure, and the same playbooks that powered every case study on this page.
                        </p>
                        <Link href="/signup"
                            className="group inline-flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-100 hover:scale-105 active:scale-95 shadow-xl">
                            Get Started Free <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="space-y-3">
                        {[
                            "AI-generated subject lines & copy",
                            "Predictive send-time optimization",
                            "Behavioral segmentation engine",
                            "A/B testing with automatic winner selection",
                            "GDPR / HIPAA / CAN-SPAM guardrails",
                            "Real-time deliverability monitoring",
                            "One-click integrations (Shopify, HubSpot, Salesforce)",
                            "Dedicated onboarding & campaign strategy support",
                        ].map((feature, i) => (
                            <motion.div key={feature}
                                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                                className="flex items-center gap-3 text-sm font-bold text-slate-300">
                                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                                {feature}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-28 px-6 border-t border-white/5">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
                        <ArrowUpRight className="h-7 w-7 text-indigo-400" />
                    </div>
                    <h2 className="text-5xl font-black outfit tracking-tighter text-white mb-4">
                        Write Your Own Success Story
                    </h2>
                    <p className="text-slate-400 font-medium mb-10 text-lg">
                        Join 340+ companies growing with MailMind. Free 14-day trial — no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/signup"
                            className="group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/25">
                            Start Free Trial <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact-sales"
                            className="flex items-center gap-2 text-slate-400 hover:text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all bg-white/5 hover:bg-white/10 border border-white/5">
                            Talk to Sales
                        </Link>
                    </div>
                </motion.div>
            </section>

            <LandingFooter />
        </div>
    )
}
