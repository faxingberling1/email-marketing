"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    MessageSquare,
    X,
    Send,
    Zap,
    Sparkles,
    Activity,
    Bot,
    User,
    Loader2,
    ChevronRight,
    BrainCircuit,
    Maximize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { sendBotMessage } from "@/app/(dashboard)/help/actions"

export function SupportBot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<any[]>([
        { role: 'bot', text: 'Tactical Support System Synchronized. How can I augment your mission today?', timestamp: 'Now' }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: 'Now' }])
        setIsTyping(true)

        try {
            const response = await sendBotMessage(userMsg)
            setMessages(prev => [...prev, {
                role: 'bot',
                text: response.message,
                suggestions: response.suggestions,
                confidence: response.confidence,
                timestamp: 'Now'
            }])
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: 'Orbital connection interrupted. Retrying sync...', timestamp: 'Now' }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-10 right-10 h-16 w-16 rounded-[2rem] bg-indigo-500 text-white flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:scale-110 transition-all z-50 border-4 border-slate-950"
                    >
                        <Bot className="h-8 w-8" />
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-10 right-10 w-[400px] h-[600px] rounded-[3rem] border border-white/10 bg-slate-950/90 backdrop-blur-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 bg-indigo-500/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                    <BrainCircuit className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Neural Support Node</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none">V4-SYNTH ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                                    <Maximize2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "flex gap-4 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div className={cn(
                                        "h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center border",
                                        msg.role === 'user' ? "bg-white/5 border-white/10 text-slate-400" : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                    )}>
                                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </div>
                                    <div className="space-y-3">
                                        <div className={cn(
                                            "p-4 rounded-2xl text-[11px] font-bold leading-relaxed uppercase tracking-widest border",
                                            msg.role === 'user' ? "bg-slate-900/60 border-white/5 text-slate-300" : "bg-indigo-500/5 border-indigo-500/10 text-white"
                                        )}>
                                            {msg.text}
                                        </div>
                                        {msg.confidence && (
                                            <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">
                                                <Activity className="h-3 w-3" /> Synthesis Confidence: {(msg.confidence * 100).toFixed(0)}%
                                            </div>
                                        )}
                                        {msg.suggestions && (
                                            <div className="flex flex-wrap gap-2">
                                                {msg.suggestions.map((s: string) => (
                                                    <button key={s} className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[8px] font-black text-indigo-400 uppercase tracking-widest transition-all">
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 mr-auto max-w-[85%]">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                        <Bot className="h-4 w-4" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                                        <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-white/5 bg-slate-900/20 backdrop-blur-xl">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="AUGMENT YOUR MISSION..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    className="w-full bg-slate-950 border border-white/5 group-hover:border-indigo-500/30 rounded-2xl pl-5 pr-14 py-4 text-[10px] font-black text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-[0.2em]"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    <Send className="h-4 w-4 translate-x-0.5 -translate-y-0.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
