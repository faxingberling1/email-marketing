#!/usr/bin/env tsx
/**
 * src/scripts/seed-test-users.ts
 *
 * Seeds two test users — one customer and one super_admin.
 * Safe to run multiple times (upserts).
 *
 * Usage:
 *   npx tsx src/scripts/seed-test-users.ts
 */

import { PrismaClient, GlobalRole } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const USERS = [
    {
        email: "test@example.com",
        name: "Test Customer",
        password: "password123",
        global_role: GlobalRole.user,
    },
    {
        email: "superadmin@mailmind.ai",
        name: "Super Admin",
        password: "superadmin123",
        global_role: GlobalRole.super_admin,
    },
]

async function main() {
    console.log("Seeding test users…\n")

    for (const u of USERS) {
        const hashed = await bcrypt.hash(u.password, 10)

        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                global_role: u.global_role,
                password: hashed,
                onboardingCompleted: true,
            },
            create: {
                email: u.email,
                name: u.name,
                password: hashed,
                global_role: u.global_role,
                onboardingCompleted: true,
                auth_provider: "credentials",
            },
        })

        console.log(`✅ [${u.global_role.padEnd(11)}] ${u.email}  (id: ${user.id})`)
        console.log(`   Password: ${u.password}`)
        console.log(`   Redirect: ${u.global_role === GlobalRole.super_admin ? "/admin" : "/dashboard"}\n`)
    }

    console.log("Done. Visit /login and use the credential cards to sign in.")
}

main()
    .catch(err => { console.error(err); process.exit(1) })
    .finally(() => prisma.$disconnect())
