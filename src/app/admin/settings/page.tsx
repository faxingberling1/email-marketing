"use client"

import { useState, useEffect } from "react"
import {
    BrainCircuit, Mail, Shield, Globe, Terminal,
    Save, RefreshCw, AlertTriangle, Key, Bell,
    Lock, Cpu, Trash2, ShieldAlert, ChevronDown, Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ConfirmModal } from "@/components/admin/ConfirmModal"
import { cn } from "@/lib/utils"

type Setting = {
    key: string
    value: string
    type: string
}

export default function SystemSettingsPage() {
    const [availableModels, setAvailableModels] = useState<any[]>([])
    const [settings, setSettings] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState<string | null>(null)
    const [confirming, setConfirming] = useState<string | null>(null)

    const load = async () => {
        setLoading(true)
        const [settingsRes, modelsRes] = await Promise.all([
            fetch("/api/admin/settings"),
            fetch("/api/admin/models")
        ])

        const settingsData = await settingsRes.json()
        const modelsData = await modelsRes.json()

        if (settingsRes.ok) {
            const mapped = settingsData.reduce((acc: any, s: Setting) => {
                acc[s.key] = s.type === "number" ? Number(s.value) : s.type === "boolean" ? s.value === "true" : s.value
                return acc
            }, {})
            setSettings(mapped)
        }
        if (modelsRes.ok) {
            setAvailableModels(modelsData)
        }
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const updateSetting = async (key: string, value: any) => {
        setSaving(key)
        const res = await fetch("/api/admin/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value })
        })
        if (res.ok) {
            setSettings(prev => ({ ...prev, [key]: value }))
        }
        setSaving(null)
    }

    if (loading) return <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Accessing Core Config...</div>

    return (
        <div className="max-w-4xl space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white outfit">System Settings</h1>
                <p className="text-slate-500 text-sm font-bold mt-1">Platform Throttling, Security &amp; AI Configuration</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white/50">

                {/* AI Configuration */}
                <SettingSection title="Neural Platform / AI" icon={BrainCircuit}>
                    <InputRow
                        label="Daily Token Ceiling"
                        hint="Max total tokens processed by platform / 24h"
                        value={settings["platform_token_ceiling"] ?? 1000000}
                        onChange={(val: number) => updateSetting("platform_token_ceiling", val)}
                        type="number"
                        loading={saving === "platform_token_ceiling"}
                    />
                    <InputRow
                        label="Default AI Credits"
                        hint="Assigned to new workspaces"
                        value={settings["default_ai_credits"] ?? 100}
                        onChange={(val: number) => updateSetting("default_ai_credits", val)}
                        type="number"
                        loading={saving === "default_ai_credits"}
                    />
                    <InputRow
                        label="Active Generative Model"
                        hint="Global model for all operations"
                        value={settings["active_ai_model"] ?? "gemini-1.5-flash-latest"}
                        onChange={(val: string) => updateSetting("active_ai_model", val)}
                        type="select"
                        options={availableModels.length > 0 ? availableModels.map(m => m.name) : ["gemini-1.5-flash-latest"]}
                        loading={saving === "active_ai_model"}
                    />
                </SettingSection>

                {/* Email Throttling */}
                <SettingSection title="Email Stack / Bounds" icon={Mail}>
                    <InputRow
                        label="Bounce Threshold"
                        hint="Auto-suspend threshold"
                        value={settings["bounce_threshold"] ?? 10}
                        onChange={(val: number) => updateSetting("bounce_threshold", val)}
                        type="number"
                        suffix="%"
                        loading={saving === "bounce_threshold"}
                    />
                    <InputRow
                        label="Default Hourly Limit"
                        hint="SMTP rate for new clusters"
                        value={settings["default_email_limit"] ?? 50}
                        onChange={(val: number) => updateSetting("default_email_limit", val)}
                        type="number"
                        loading={saving === "default_email_limit"}
                    />
                </SettingSection>

                {/* Infrastructure */}
                <SettingSection title="Global Infrastructure" icon={Globe}>
                    <InputRow
                        label="Central SMTP Host"
                        hint="Core mail server for system notifications"
                        value={settings["global_smtp_host"] ?? "smtp.mailmind.io"}
                        onChange={(val: string) => updateSetting("global_smtp_host", val)}
                        type="text"
                        loading={saving === "global_smtp_host"}
                    />
                    <InputRow
                        label="Data Retention Policy"
                        hint="Days to keep detailed activity logs"
                        value={settings["retention_policy_days"] ?? 90}
                        onChange={(val: number) => updateSetting("retention_policy_days", val)}
                        type="number"
                        suffix="DAYS"
                        loading={saving === "retention_policy_days"}
                    />
                </SettingSection>

                {/* Security Flags */}
                <SettingSection title="Platform Security" icon={ShieldAlert} danger>
                    <ToggleRow
                        label="Maintenance Mode"
                        hint="Block non-admin dashboard access"
                        value={settings["maintenance_mode"] ?? false}
                        onChange={() => setConfirming("maintenance_mode")}
                        loading={saving === "maintenance_mode"}
                    />
                    <ToggleRow
                        label="Require Super Admin 2FA"
                        hint="Enforce MFA for all elevated nodes"
                        value={settings["require_admin_2fa"] ?? true}
                        onChange={() => setConfirming("require_admin_2fa")}
                        loading={saving === "require_admin_2fa"}
                    />
                    <ToggleRow
                        label="Enforce Session Hard-Reset"
                        hint="Log out all users on role change"
                        value={settings["enforce_session_reset"] ?? false}
                        onChange={() => updateSetting("enforce_session_reset", !settings["enforce_session_reset"])}
                        loading={saving === "enforce_session_reset"}
                    />
                </SettingSection>

            </div>

            {/* Confirmations */}
            <ConfirmModal
                isOpen={!!confirming}
                onClose={() => setConfirming(null)}
                onConfirm={() => {
                    const key = confirming!
                    updateSetting(key, !settings[key])
                    setConfirming(null)
                }}
                title="Critical System Change"
                description={`You are about to modify ${confirming?.replace(/_/g, " ")}. This action is immediate and will be logged in the audit trail.`}
                confirmText="Proceed with Change"
                variant={confirming === "maintenance_mode" ? "danger" : "warning"}
            />
        </div>
    )
}

function SettingSection({ title, icon: Icon, children, danger }: { title: string; icon: any; children: React.ReactNode; danger?: boolean }) {
    return (
        <div className={cn(
            "bg-slate-900 border rounded-3xl shadow-xl",
            danger ? "border-rose-500/20" : "border-white/5"
        )}>
            <div className="px-6 py-4 flex items-center gap-3 border-b border-white/5 bg-white/[0.01] rounded-t-3xl">
                <Icon className={cn("h-4.5 w-4.5", danger ? "text-rose-500" : "text-indigo-400")} />
                <span className="text-xs font-black text-white uppercase tracking-widest">{title}</span>
            </div>
            <div className="divide-y divide-white/[0.03]">
                {children}
            </div>
        </div>
    )
}

function CustomSelect({ value, options, onChange, loading }: { value: string; options: string[]; onChange: (val: string) => void; loading?: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative min-w-[200px]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full flex items-center justify-between gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white transition-all hover:border-indigo-500/50 group",
                    isOpen && "border-indigo-500 ring-4 ring-indigo-500/10"
                )}
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span className="font-bold tracking-tight">{value}</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 4, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 w-full z-50 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2"
                        >
                            {options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onChange(option)
                                        setIsOpen(false)
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-3 text-[11px] font-bold transition-all hover:bg-white/5 flex items-center justify-between group",
                                        value === option ? "text-indigo-400 bg-indigo-500/5" : "text-slate-400"
                                    )}
                                >
                                    <span>{option}</span>
                                    {value === option && (
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

function InputRow({ label, hint, value, onChange, type, options, suffix, loading }: any) {
    return (
        <div className="px-6 py-5 flex items-center justify-between gap-8 hover:bg-white/[0.01] transition-all">
            <div className="flex-1">
                <div className="text-xs font-black text-white leading-none mb-1">{label}</div>
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{hint}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                {type === "number" && (
                    <div className="relative">
                        <input
                            type="number"
                            className="w-24 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                            defaultValue={value}
                            onBlur={e => onChange(Number(e.target.value))}
                        />
                        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-700">{suffix}</span>}
                    </div>
                )}
                {type === "text" && (
                    <input
                        type="text"
                        className="w-48 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        defaultValue={value}
                        onBlur={e => onChange(e.target.value)}
                    />
                )}
                {type === "select" && (
                    <CustomSelect
                        value={value}
                        options={options || []}
                        onChange={onChange}
                        loading={loading}
                    />
                )}
                {loading && <RefreshCw className="h-4 w-4 text-indigo-400 animate-spin" />}
            </div>
        </div>
    )
}

interface ToggleRowProps {
    label: string;
    hint: string;
    value: boolean;
    onChange: () => void;
    loading?: boolean;
}

function ToggleRow({ label, hint, value, onChange, loading }: ToggleRowProps) {
    // Assuming 'cn' is imported or defined elsewhere, as it's not in the provided snippet.
    const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

    return (
        <div className="px-6 py-5 flex items-center justify-between gap-8 hover:bg-white/[0.01] transition-all">
            <div className="flex-1">
                <div className="text-xs font-black text-white leading-none mb-1">{label}</div>
                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{hint}</div>
            </div>
            <button
                onClick={onChange}
                disabled={loading}
                className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    value ? "bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.5)]" : "bg-slate-800"
                )}
            >
                <div className={cn(
                    "absolute top-1 left-1 h-4 w-4 bg-white rounded-full transition-all",
                    value ? "translate-x-6" : "translate-x-0"
                )} />
            </button>
        </div>
    )
}
