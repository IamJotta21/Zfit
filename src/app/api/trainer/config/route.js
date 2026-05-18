import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
export async function PUT(req) {
    try {
        const body = await req.json();
        const { userId, logoUrl, brandColorPrimary, brandColorSecondary, autoBlockDelayDays, customRpeEnabled } = body;
        const config = await prisma.trainerConfig.upsert({
            where: { userId },
            update: {
                logoUrl,
                brandColorPrimary,
                brandColorSecondary,
                autoBlockDelayDays,
                customRpeEnabled
            },
            create: {
                userId,
                logoUrl,
                brandColorPrimary,
                brandColorSecondary,
                autoBlockDelayDays,
                customRpeEnabled
            }
        });
        return NextResponse.json({ success: true, data: config });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
