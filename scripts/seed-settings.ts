import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding system settings...')

    const settings = [
        { key: 'active_ai_model', value: 'gemini-1.5-flash-latest', type: 'string', description: 'Currently active Google AI model for platform-wide use.' },
        { key: 'default_ai_credits', value: '100', type: 'number', description: 'Starting credits for new workspaces.' },
        { key: 'bounce_threshold', value: '10', type: 'number', description: 'Global bounce rate limit before auto-suspension.' },
        { key: 'default_email_limit', value: '50', type: 'number', description: 'Initial hourly email limit for new accounts.' }
    ]

    for (const s of settings) {
        await prisma.$executeRawUnsafe(`
      INSERT INTO "SystemSetting" (id, key, value, type, description, "updatedAt", "updatedById")
      VALUES (
        gen_random_uuid(),
        '${s.key}',
        '${s.value}',
        '${s.type}',
        '${s.description}',
        CURRENT_TIMESTAMP,
        (SELECT id FROM "User" WHERE global_role = 'super_admin' LIMIT 1)
      )
      ON CONFLICT (key) DO NOTHING
    `)
    }

    console.log('Seeding complete.')
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
