import { seedDemoAccounts } from "./src/lib/demo-seeder";

async function main() {
    console.log("Seeding Enterprise Demo Account...");
    await seedDemoAccounts();
    console.log("Seeding complete.");
    process.exit(0);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
