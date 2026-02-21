import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getTierLimits } from "@/lib/tiers";
import { CreditCard, Zap, Mail, Users, CheckCircle2, AlertCircle, ArrowRight, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PlanSelector } from "@/components/billing/PlanSelector";
import { AddonSelector } from "@/components/billing/AddonSelector";
import { ManageSubscriptionButtons } from "@/components/billing/ManageSubscriptionButtons";

export default async function BillingPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { workspace: true }
    });

    if (!user?.workspace) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                <AlertCircle className="h-12 w-12 text-slate-500 mb-4" />
                <h1 className="text-2xl font-black text-white outfit mb-2">No Workspace Found</h1>
                <p className="text-slate-400 max-w-md">You need an active workspace to view billing information.</p>
            </div>
        );
    }

    const ws = user.workspace as any;
    const limits = getTierLimits(ws.subscription_plan);

    const usage = [
        {
            name: "Audience Contacts",
            icon: Users,
            current: await prisma.contact.count({ where: { userId: user.id } }),
            limit: limits.contacts,
            color: "text-indigo-400",
            bg: "bg-indigo-500/10"
        },
        {
            name: "Monthly Emails",
            icon: Mail,
            current: ws.total_emails_sent, // This is all-time in schema, but we'll use it for now as placeholder
            limit: limits.emails_per_month,
            color: "text-sky-400",
            bg: "bg-sky-500/10"
        },
        {
            name: "AI Credits",
            icon: Zap,
            current: ws.total_ai_used,
            limit: limits.ai_credits_per_month,
            color: "text-amber-400",
            bg: "bg-amber-500/10"
        }
    ];

    return (
        <div className="space-y-12 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white outfit flex items-center gap-3">
                        <CreditCard className="h-10 w-10 text-indigo-400" />
                        Billing Control
                    </h1>
                    <p className="text-slate-500 text-sm font-bold mt-1">Scale your reach with AI-powered tiers and add-ons.</p>
                </div>
                <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-4 py-2 rounded-2xl">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Workspace Health:</span>
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Active</span>
                </div>
            </div>

            {/* Current Status Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="h-24 w-24 rounded-3xl bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10 rotate-12 transition-transform group-hover:rotate-6">
                            <CreditCard className="h-12 w-12 text-indigo-500/30" />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                Active Subscription
                            </span>
                        </div>

                        <div className="flex items-baseline gap-3 mb-2">
                            <h2 className="text-6xl font-black text-white outfit capitalize">
                                {ws.subscription_plan}
                            </h2>
                            <span className="text-slate-500 font-black text-lg outfit italic">Tier</span>
                        </div>

                        <p className="text-slate-400 font-medium mb-10 max-w-md leading-relaxed">
                            Your workspace is currently leveraging the <span className="text-white font-bold">{ws.subscription_plan}</span> infrastructure.
                            Next billing cycle begins on <span className="text-indigo-400 font-bold">March 1st, 2024</span>.
                        </p>

                        <ManageSubscriptionButtons />
                    </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Resource Consumption</h3>
                        <div className="space-y-8">
                            {usage.map((u) => (
                                <div key={u.name}>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-8 w-8 rounded-lg ${u.bg} flex items-center justify-center`}>
                                                <u.icon className={`h-4 w-4 ${u.color}`} />
                                            </div>
                                            <span className="text-xs font-black text-slate-300 uppercase tracking-wider">{u.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-black text-white">
                                                {((u.current / u.limit) * 100).toFixed(0)}%
                                            </div>
                                            <div className="text-[10px] text-slate-500 font-bold">
                                                {u.current.toLocaleString()} / {u.limit.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-850 rounded-full overflow-hidden border border-white/[0.03]">
                                        <div
                                            className={`h-full ${u.color.replace('text', 'bg')} rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.1)]`}
                                            style={{ width: `${Math.min(100, (u.current / u.limit) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Selection */}
            <section className="pt-12 border-t border-white/5">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-white outfit mb-2">Platform Tiers</h2>
                    <p className="text-slate-500 font-bold">Select the engine that fits your scale.</p>
                </div>
                <PlanSelector currentPlan={ws.subscription_plan} />
            </section>

            {/* Add-ons */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Zap className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white outfit">AI Credit Add-ons</h3>
                            <p className="text-slate-500 text-xs font-bold">Neural allocation for your workspace.</p>
                        </div>
                    </div>

                    <AddonSelector />
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                            <Mail className="h-6 w-6 text-sky-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white outfit">Email Volume Boost</h3>
                            <p className="text-slate-500 text-xs font-bold">Increase your monthly sending capacity.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { vol: "5,000 Emails", price: "$25", desc: "One-time seasonal boost." },
                            { vol: "25,000 Emails", price: "$99", desc: "For scaling your newsletter reach." },
                            { vol: "100,000 Emails", price: "$299", desc: "Major platform-wide outreach expansion." },
                        ].map(add => (
                            <div key={add.vol} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-sky-500/30 transition-all cursor-pointer">
                                <div>
                                    <div className="text-sm font-black text-white mb-1 tracking-tight">{add.vol}</div>
                                    <p className="text-[10px] text-slate-500 font-bold">{add.desc}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-white mb-2">{add.price}</div>
                                    <button className="px-4 py-2 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all">
                                        Purchase
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Invoices */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Transactional History
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                        Full invoice history and payment methods are managed via the Secure Stripe Portal.
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="px-8 py-5">Reference</th>
                                <th className="px-8 py-5">Issue Date</th>
                                <th className="px-8 py-5">Valuation</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {[
                                { id: "MM-2024-8842", date: "Feb 1, 2024", amount: "$79.00", status: "Processed" },
                                { id: "MM-2024-7129", date: "Jan 1, 2024", amount: "$79.00", status: "Processed" },
                                { id: "MM-2023-6621", date: "Dec 1, 2023", amount: "$29.00", status: "Processed" },
                            ].map((inv) => (
                                <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-5 text-sm font-black text-white tracking-widest uppercase italic">{inv.id}</td>
                                    <td className="px-8 py-5 text-sm font-bold text-slate-500">{inv.date}</td>
                                    <td className="px-8 py-5 text-sm font-black text-white">{inv.amount}</td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="h-9 w-9 inline-flex items-center justify-center bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all">
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
