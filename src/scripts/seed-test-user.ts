import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
    const email = "test@example.com"
    const password = "password123"
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log(`Seeding test user: ${email}...`)

    // 1. Ensure Workspace
    const workspace = await (prisma as any).workspace.upsert({
        where: { id: "test-workspace" },
        update: { name: "Test Workspace" },
        create: {
            id: "test-workspace",
            name: "Test Workspace"
        }
    })

    // 2. Upsert User
    await (prisma as any).user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            onboardingCompleted: true,
            subscriptionPlan: "pro",
            workspaceId: workspace.id
        },
        create: {
            email,
            password: hashedPassword,
            name: "Test User",
            onboardingCompleted: true,
            subscriptionPlan: "pro",
            workspaceId: workspace.id
        }
    })

    console.log("Test user seeded successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
