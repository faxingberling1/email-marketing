"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Move,
    Trash2,
    Type,
    Image as ImageIcon,
    MousePointer2,
    Minus,
    Zap,
    Layout,
    Plus,
    ChevronUp,
    ChevronDown,
    Save,
    RotateCcw,
    Activity,
    Target,
    Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

import { TemplateNeuralHUD } from "./TemplateNeuralHUD"

interface Block {
    id: string
    type: 'text' | 'image' | 'button' | 'divider' | 'header'
    content: string
    style?: any
}

interface TemplateVisualEditorProps {
    initialBlocks?: Block[]
}

export function TemplateVisualEditor({ initialBlocks = [] }: TemplateVisualEditorProps) {
    const [blocks, setBlocks] = useState<Block[]>(initialBlocks.length > 0 ? initialBlocks : [
        { id: '1', type: 'header', content: 'VISIONARY PRODUCT UPDATE' },
        { id: '2', type: 'text', content: 'Your strategic growth starts here. Experience the next generation of marketing intelligence.' },
        { id: '3', type: 'button', content: 'ACTIVATE ORBIT' }
    ])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [showAI, setShowAI] = useState(false)

    const addBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            content: type === 'button' ? 'NEW ACTION' : type === 'divider' ? '' : 'NEW CREATIVE CONTENT'
        }
        setBlocks([...blocks, newBlock])
    }

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id))
        if (selectedId === id) setSelectedId(null)
    }

    const moveBlock = (id: string, direction: 'up' | 'down') => {
        const index = blocks.findIndex(b => b.id === id)
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return

        const newBlocks = [...blocks]
        const targetIndex = direction === 'up' ? index - 1 : index + 1
            ;[newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]]
        setBlocks(newBlocks)
    }

    return (
        <div className="flex h-full gap-8 relative overflow-hidden">
            {/* Control HUD */}
            <div className="w-80 shrink-0 space-y-6 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
                <div className="p-6 rounded-[2rem] border border-white/5 bg-slate-900/40 space-y-6">
                    <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-indigo-400" />
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Synthesis Blocks</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { type: 'header', icon: Target, label: 'Header' },
                            { type: 'text', icon: Type, label: 'Text' },
                            { type: 'image', icon: ImageIcon, label: 'Image' },
                            { type: 'button', icon: MousePointer2, label: 'Action' },
                            { type: 'divider', icon: Minus, label: 'Divider' },
                        ].map(tool => (
                            <button
                                key={tool.type}
                                onClick={() => addBlock(tool.type as Block['type'])}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all gap-2 group"
                            >
                                <tool.icon className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-[2rem] border border-indigo-500/10 bg-indigo-500/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-indigo-400" />
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Resonance</h3>
                        </div>
                        <button
                            onClick={() => setShowAI(!showAI)}
                            className="bg-indigo-500 p-1.5 rounded-lg text-white hover:scale-105 transition-transform"
                        >
                            <Sparkles className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                            <span>Engagement Score</span>
                            <span className="text-emerald-400 font-black">92%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[92%] bg-emerald-500" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                    <button className="flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-400 py-4 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all">
                        <Save className="h-4 w-4" /> COMMIT TO REPOSITORY
                    </button>
                    <button className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 py-4 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border border-white/5 transition-all">
                        <RotateCcw className="h-4 w-4" /> RESET CANVAS
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 rounded-[2.5rem] border border-white/5 bg-slate-950/20 p-12 relative overflow-y-auto custom-scrollbar">
                <div className="max-w-2xl mx-auto space-y-6">
                    <AnimatePresence>
                        {blocks.map((block) => (
                            <motion.div
                                key={block.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "group relative p-8 rounded-3xl transition-all",
                                    selectedId === block.id
                                        ? "ring-2 ring-indigo-500/50 bg-white/[0.03]"
                                        : "hover:bg-white/[0.01] border border-transparent hover:border-white/5"
                                )}
                                onClick={() => setSelectedId(block.id)}
                            >
                                {/* Block Controls */}
                                <div className="absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }} className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white"><ChevronUp className="h-4 w-4" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }} className="h-8 w-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white"><ChevronDown className="h-4 w-4" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 hover:bg-rose-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                                </div>

                                {/* Content Rendering */}
                                {block.type === 'header' && (
                                    <h2 className="text-3xl font-black text-white tracking-tight uppercase text-center">{block.content}</h2>
                                )}
                                {block.type === 'text' && (
                                    <p className="text-sm font-medium text-slate-400 leading-relaxed text-center">{block.content}</p>
                                )}
                                {block.type === 'button' && (
                                    <div className="flex justify-center">
                                        <button className="px-10 py-4 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                            {block.content}
                                        </button>
                                    </div>
                                )}
                                {block.type === 'image' && (
                                    <div className="aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-white/20">
                                        <ImageIcon className="h-8 w-8 text-slate-700" />
                                    </div>
                                )}
                                {block.type === 'divider' && (
                                    <div className="h-[1px] w-full bg-white/10" />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {blocks.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-6">
                            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                                <Layout className="h-8 w-8 text-slate-700" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Canvas Voids Detected</h4>
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Select synthesis blocks to begin orchestration.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* AI HUD Drawer */}
            <AnimatePresence>
                {showAI && (
                    <motion.div
                        initial={{ x: 400, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 400, opacity: 0 }}
                        className="w-96 shrink-0 h-full"
                    >
                        <TemplateNeuralHUD />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
