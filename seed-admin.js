const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'superadmin@mailmind.ai';
    const password = 'superadmin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Seeding super-admin...');

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            global_role: 'super_admin',
            onboardingCompleted: true,
        },
        create: {
            email,
            password: hashedPassword,
            name: 'Super Admin',
            global_role: 'super_admin',
            onboardingCompleted: true,
        },
    });

    console.log(`Super-admin seeded: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
