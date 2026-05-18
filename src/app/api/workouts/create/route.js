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
        const { trainerId, name, objective, exercises } = body;
        // Treino criado como biblioteca independente (isTemplate = true) e sem studentId inicial.
        const workout = await prisma.workout.create({
            data: {
                trainerId,
                name,
                objective,
                isTemplate: true,
                exercises: {
                    create: exercises.map((ex, index) => ({
                        exerciseName: ex.exerciseName,
                        setsCount: ex.setsCount,
                        repsOrRpe: ex.repsOrRpe,
                        restSeconds: ex.restSeconds,
                        videoUrl: ex.videoUrl,
                        orderIndex: index
                    }))
                }
            },
            include: {
                exercises: true
            }
        });
        return NextResponse.json({ success: true, data: workout });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
