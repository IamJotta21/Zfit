import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
export async function POST(req) {
    try {
        const body = await req.json();
        const { studentId, workoutId, feedbackLoadRating, energyLevel } = body;
        const workoutLog = await prisma.workoutLog.create({
            data: {
                studentId,
                workoutId,
                feedbackLoadRating,
                energyLevel
            }
        });
        return NextResponse.json({ success: true, data: workoutLog });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
