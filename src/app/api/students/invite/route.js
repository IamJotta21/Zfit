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
        const { email, fullName, trainerId } = body;
        // In a real scenario, this would create an invite token and store it.
        // Here we just return a mock success response with the token link.
        const token = `invite-token-${Date.now()}`;
        const inviteLink = `https://repos.app/join/${token}`;
        return NextResponse.json({ success: true, inviteLink });
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
