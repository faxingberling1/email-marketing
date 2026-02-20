"use client"

import Link from "next/link"
import { Mail } from "lucide-react"

export function LandingHeader() {
    return (
        <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                        <Mail className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold outfit tracking-tight text-white">
                        AEM<span className="text-indigo-500">.AI</span>
                    </span>
                </Link>
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                    <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/#about" className="hover:text-white transition-colors">About</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                        Sign In
                    </Link>
                    <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    )
}
