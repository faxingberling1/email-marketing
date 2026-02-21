"use client"

import Link from "next/link"
import { Mail, ArrowRight, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { LandingCmsHeader } from "../app/admin/cms/tabs/HeaderTab"

const DEFAULT_HEADER: LandingCmsHeader = {
    brandName: "Mail",
    brandHighlight: "Mind",
    navLinks: [
        { name: "Features", href: "/#features" },
        { name: "Intelligence", href: "/#intelligence" },
        { name: "Pricing", href: "/#pricing" },
        { name: "Resources", href: "/#resources" },
    ],
    signInText: "Sign In",
    getStartedText: "Get Started",
}

export function LandingHeader({ content }: { content?: LandingCmsHeader }) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const data = content || DEFAULT_HEADER

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center px-6 py-6`}
        >
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`
                    w-full max-w-7xl flex items-center justify-between px-6 py-3 rounded-2xl border transition-all duration-500
                    ${isScrolled
                        ? "glass border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-slate-950/80"
                        : "border-transparent bg-transparent"}
                `}
            >
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-2 group relative z-[51]">
                    <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-indigo-500/20">
                        <Mail className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-black outfit tracking-tighter text-white">
                        {data.brandName}<span className="gradient-text">{data.brandHighlight}</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-1">
                    {data.navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-all rounded-lg hover:bg-white/5 relative group"
                        >
                            {link.name}
                            <div className="absolute bottom-1 left-4 right-4 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="hidden md:block px-5 py-2 text-sm font-black text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        {data.signInText}
                    </Link>
                    <Link
                        href="/signup"
                        className="group flex items-center gap-2 bg-white text-slate-950 px-6 py-2.5 rounded-xl text-sm font-black transition-all hover:bg-slate-100 active:scale-95 shadow-xl shadow-indigo-500/10"
                    >
                        {data.getStartedText}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute top-full left-6 right-6 mt-2 glass rounded-3xl border border-white/10 bg-slate-950/95 overflow-hidden lg:hidden z-50 shadow-2xl"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            {data.navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-lg font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-between"
                                >
                                    {link.name}
                                    <ArrowRight className="h-4 w-4 opacity-30" />
                                </Link>
                            ))}
                            <div className="h-px bg-white/5 my-2" />
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-bold text-slate-400 hover:text-white transition-colors"
                            >
                                {data.signInText}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
