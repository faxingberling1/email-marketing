import { NextRequest, NextResponse } from "next/server"
import { withAdminGuard } from "@/lib/admin-guard"
import { prisma } from "@/lib/db"

export const GET = withAdminGuard(async (req: NextRequest) => {
    // Use raw query for absolute resilience against missing model types
    const settings = await prisma.$queryRaw<any[]>`
        SELECT id, key, value, type, description
        FROM "SystemSetting"
        ORDER BY key ASC
    `
    return NextResponse.json(settings)
})

import { logAdminAction } from "@/lib/audit"

export const PATCH = withAdminGuard(async (req: NextRequest, adminUser) => {
    const { key, value } = await req.json()

    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 })

    const type = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string'
    const stringValue = String(value)

    // 1. Fetch old value for diff auditing
    const oldEntries = await prisma.$queryRaw<any[]>`
        SELECT value FROM "SystemSetting" WHERE key = ${key} LIMIT 1
    `
    const oldValue = oldEntries[0]?.value

    // 2. Raw Upsert for SystemSetting
    await prisma.$executeRaw`
        INSERT INTO "SystemSetting" (id, key, value, type, "updatedAt", "updatedById")
        VALUES (
            gen_random_uuid(), 
            ${key}, 
            ${stringValue}, 
            ${type}, 
            NOW(), 
            ${adminUser.id}
        )
        ON CONFLICT (key) DO UPDATE SET
            value = EXCLUDED.value,
            "updatedAt" = EXCLUDED."updatedAt",
            "updatedById" = EXCLUDED."updatedById"
    `

    // 3. High-fidelity Audit Log
    await logAdminAction({
        actorId: adminUser.id || 'system',
        action: key === 'maintenance_mode' ? 'MAINTENANCE_MODE_TOGGLED' : 'SYSTEM_SETTING_UPDATED',
        target: { type: 'system', id: key },
        metadata: {
            settingKey: key,
            oldValue,
            newValue: stringValue,
        },
        req
    })

    return NextResponse.json({ success: true, key, value })
})
