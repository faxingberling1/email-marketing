import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function seedDemoAccounts() {
    const passwordHash = await bcrypt.hash("demo_password_123", 10);
    const tiers = ['starter', 'growth', 'pro', 'enterprise'] as const;

    const results = [];

    for (const tier of tiers) {
        const email = `${tier}@mailmind.demo`;
        const name = `${tier.charAt(0).toUpperCase() + tier.slice(1)} Demo Dashboard`;

        // 1. Create Workspace
        const workspace = await (prisma as any).workspace.upsert({
            where: { id: `ws_demo_${tier}` }, // Predictable ID for testing
            update: {
                subscription_plan: tier,
                subscription_status: 'active',
                ai_credits_remaining: tier === 'starter' ? 300 : tier === 'growth' ? 2000 : tier === 'enterprise' ? 100000 : 6000,
                email_limit_remaining: tier === 'starter' ? 10000 : tier === 'growth' ? 75000 : tier === 'enterprise' ? 10000000 : 200000,
            },
            create: {
                id: `ws_demo_${tier}`,
                name: `${tier.toUpperCase()} MISSION CONTROL`,
                subscription_plan: tier,
                subscription_status: 'active',
                ai_credits_remaining: tier === 'starter' ? 300 : tier === 'growth' ? 2000 : tier === 'enterprise' ? 100000 : 6000,
                email_limit_remaining: tier === 'starter' ? 10000 : tier === 'growth' ? 75000 : tier === 'enterprise' ? 10000000 : 200000,
            }
        });

        // 2. Create User
        const user = await (prisma as any).user.upsert({
            where: { email },
            update: {
                workspaceId: workspace.id,
                subscriptionPlan: tier,
            },
            create: {
                id: `user_demo_${tier}`,
                email,
                name,
                password: passwordHash,
                workspaceId: workspace.id,
                subscriptionPlan: tier,
                global_role: 'user',
            }
        });

        // 3. Ensure Membership
        await (prisma as any).workspaceMember.upsert({
            where: {
                workspaceId_userId: {
                    workspaceId: workspace.id,
                    userId: user.id
                }
            },
            update: { role: 'owner' },
            create: {
                workspaceId: workspace.id,
                userId: user.id,
                role: 'owner'
            }
        });

        results.push({ email, tier, workspaceId: workspace.id });
    }

    return results;
}
