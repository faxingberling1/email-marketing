#!/usr/bin/env ts-node
/**
 * src/scripts/seed-super-admin.ts
 *
 * CLI script to promote a user to super_admin by email.
 * This is the ONLY sanctioned way to create a super_admin.
 * Never expose this functionality in a UI or API endpoint.
 *
 * Usage:
 *   npx ts-node -e "require('./src/scripts/seed-super-admin')" your@email.com
 *   -- OR --
 *   npx tsx src/scripts/seed-super-admin.ts your@email.com
 */

import { PrismaClient, GlobalRole } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2]

    if (!email) {
        console.error("❌ Usage: npx tsx src/scripts/seed-super-admin.ts <email>")
        process.exit(1)
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        console.error(`❌ No user found with email: ${email}`)
        process.exit(1)
    }

    if (user.global_role === GlobalRole.super_admin) {
        console.log(`ℹ️  User ${email} is already a super_admin. No changes made.`)
        process.exit(0)
    }

    await prisma.user.update({
        where: { email },
        data: { global_role: GlobalRole.super_admin },
    })

    console.log(`✅ Successfully promoted ${email} to super_admin.`)
    console.log(`   User ID: ${user.id}`)
    console.log(`   Sign in at /login and navigate to /admin`)
}

main()
    .catch(err => {
        console.error("Fatal:", err)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
