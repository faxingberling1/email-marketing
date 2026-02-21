import { NextRequest, NextResponse } from "next/server";
import { withAdminGuard } from "@/lib/admin-guard";
import { seedDemoAccounts } from "@/lib/demo-seeder";

export const POST = withAdminGuard(async (req: NextRequest) => {
    try {
        const results = await seedDemoAccounts();
        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error("Demo Seeding Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
