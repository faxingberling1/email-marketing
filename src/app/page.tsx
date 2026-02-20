"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Send,
  BarChart3,
  Zap,
  Shield,
  ArrowRight,
  Mail,
  CheckCircle2,
  ChevronRight,
  User,
  Rocket
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LandingHeader } from "@/components/LandingHeader"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent -z-10" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Personalization at Scale
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold outfit leading-tight mb-8"
          >
            Emails that actually <br />
            <span className="gradient-text">get opened.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          >
            Leverage advanced AI to generate personalized content, optimize send times, and
            segment your audience with surgical precision.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/signup" className="group flex items-center gap-2 bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
              Start Free Trial
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/demo" className="flex items-center gap-2 text-slate-400 hover:text-white px-8 py-4 font-bold transition-colors">
              Quick Demo Access
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>

        {/* Platform Tutorial Section */}
        <section id="demo" className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold outfit mb-4">See AEM.AI in <span className="text-indigo-500">Action.</span></h2>
              <p className="text-slate-400">Experience how AI transforms your marketing workflow in seconds.</p>
            </div>
            <PlatformTutorial />
          </div>
        </section>

        {/* Hero Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="max-w-5xl mx-auto mt-24 px-6 relative"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] -z-10" />
          <div className="glass rounded-3xl border border-white/10 p-4 shadow-2xl">
            <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-[16/10] flex">
              <div className="w-48 border-r border-white/5 p-4 flex flex-col gap-4">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg" />
                {[1, 2, 3, 4].map(i => <div key={i} className="h-2 w-full bg-white/5 rounded" />)}
              </div>
              <div className="flex-1 p-8 grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-32 w-full bg-white/5 rounded-2xl" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-1/2 bg-white/5 rounded" />
                </div>
                <div className="space-y-4">
                  <div className="h-32 w-full bg-white/5 rounded-2xl" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-4 w-1/2 bg-white/5 rounded" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold outfit mb-4">Everything you need to <span className="text-indigo-500">scale.</span></h2>
            <p className="text-slate-400">Advanced tools simplified by artificial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "AI Generation", desc: "Instantly create high-converting subject lines and email body content tailored to your brand.", icon: Sparkles, color: "text-indigo-400" },
              { title: "Smart Segmentation", desc: "Let AI analyze behavior to grouping contacts based on their likelihood to convert.", icon: Zap, color: "text-emerald-400" },
              { title: "Predictive Analytics", desc: "Know the exact best time to send emails for maximum engagement rate.", icon: BarChart3, color: "text-blue-400" },
              { title: "Global Delivery", desc: "Enterprise-grade infrastructure ensures your emails land in the inbox, every time.", icon: Send, color: "text-purple-400" },
              { title: "Privacy First", desc: "GDPR and CCPA compliant data handling with end-to-end encryption.", icon: Shield, color: "text-rose-400" },
              { title: "Automated Flows", desc: "Sequence that trigger based on user interaction, running 24/7 on autopilot.", icon: Mail, color: "text-amber-400" },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass p-8 rounded-3xl border border-white/5 hover:border-indigo-500/20 transition-all bg-gradient-to-br from-white/[0.02] to-transparent"
              >
                <div className={cn("h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6", feature.color)}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold outfit mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold outfit mb-4">Transparent Pricing.</h2>
            <p className="text-slate-400">Scale as you grow. No hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Starter", price: "0", desc: "Perfect for exploring.", features: ["1,000 Emails / mo", "Basic AI Content", "Contact Mgmt", "Standard Support"] },
              { name: "Pro", price: "49", desc: "Our most popular plan.", features: ["10,000 Emails / mo", "Unlimited AI Gen", "Smart Segments", "Priority Support"], popular: true },
              { name: "Scale", price: "199", desc: "For high-volume brands.", features: ["100k+ Emails / mo", "Predictive Sending", "API Access", "Dedicated Success Mgr"] },
            ].map((plan, i) => (
              <div
                key={i}
                className={cn(
                  "glass p-8 rounded-3xl flex flex-col relative overflow-hidden",
                  plan.popular ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-white/5"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold outfit mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-xs mb-6">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold outfit">${plan.price}</span>
                  <span className="text-slate-500 text-sm">/month</span>
                </div>
                <div className="space-y-4 mb-10 flex-1">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {f}
                    </div>
                  ))}
                </div>
                <button className={cn(
                  "w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg",
                  plan.popular
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                    : "bg-white/5 hover:bg-white/10 text-white"
                )}>
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/5 -z-10" />
        <div className="max-w-4xl mx-auto px-6">
          <div className="glass p-12 md:p-20 rounded-[40px] border border-white/10 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 -z-10" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black outfit leading-tight">
                Ready to transform your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">email marketing?</span>
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
                Join 500+ brands using AI to automate growth and skyrocket their engagement rates.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/signup" className="group flex items-center gap-3 bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-xl hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5">
                  Get Started for Free
                  <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-slate-500 text-sm font-medium">
                  No credit card required. Cancel anytime.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 w-6 bg-indigo-600 rounded flex items-center justify-center">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold outfit tracking-tight">
                AEM<span className="text-indigo-500">.AI</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              Making enterprise-grade AI marketing accessible to brands that want to grow without limits.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/40">Product</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Campaigns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Automation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/40">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-xs font-medium">
          &copy; 2026 AEM.AI. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
function PlatformTutorial() {
  const [step, setStep] = useState(0)
  const steps = [
    { title: "Define Goal", desc: "Start by telling the AI who you are targeting and what you want to achieve.", highlight: "Marketing to SaaS founders" },
    { title: "Generate Content", desc: "Our AI constructs high-conversational subject lines and body copy automatically.", highlight: "Subject: Scaling your MRR..." },
    { title: "Segment Audience", desc: "Automatically identify high-intent users based on real-time behavior tracking.", highlight: "Segment: 140 High Intent" },
    { title: "Launch & Track", desc: "Send with confidence and watch real-time open rates climb with predictive timing.", highlight: "Open Rate: 42.8%" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % steps.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        {steps.map((s, i) => (
          <div
            key={i}
            className={cn(
              "p-6 rounded-2xl border transition-all duration-500 cursor-pointer",
              step === i ? "bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20" : "bg-transparent border-white/5 hover:border-white/10"
            )}
            onClick={() => setStep(i)}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                step === i ? "bg-indigo-500 text-white" : "bg-slate-900 text-slate-500"
              )}>
                {i + 1}
              </div>
              <div>
                <h3 className={cn("font-bold outfit", step === i ? "text-white" : "text-slate-500")}>{s.title}</h3>
                {step === i && <p className="text-sm text-slate-400 mt-1">{s.desc}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative glass p-4 rounded-3xl min-h-[400px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <div className="bg-slate-950 rounded-2xl p-8 border border-white/5 shadow-2xl relative">
              {step === 0 && (
                <div className="space-y-4">
                  <div className="h-2 w-1/2 bg-indigo-500/20 rounded" />
                  <div className="h-4 w-full bg-white/5 rounded" />
                  <div className="h-4 w-3/4 bg-white/5 rounded" />
                  <div className="mt-8 p-4 rounded-xl bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 font-mono text-xs">
                    "Write an email for B2B SaaS founders about our new API optimization feature..."
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                    <span>AI Generating...</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 space-y-3">
                    <div className="h-2 w-3/4 bg-indigo-400/30 rounded" />
                    <div className="h-2 w-full bg-white/10 rounded" />
                    <div className="h-2 w-full bg-white/10 rounded" />
                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="relative h-48 flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(j => (
                      <motion.div
                        key={j}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: j * 0.2 }}
                        className="h-12 w-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center"
                      >
                        <User className="h-6 w-6 text-indigo-400" />
                      </motion.div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Segment: Ultra-High Engagement
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="h-8 w-24 bg-white/5 rounded" />
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-slate-500">Opens</p>
                      <p className="text-xl font-bold text-white">42.8%</p>
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <p className="text-[10px] text-indigo-400 font-bold">Optimization</p>
                      <p className="text-xs text-slate-300">+12% Uplift</p>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: "70%" }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
