import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Liveness + DB readiness probe for Docker / uptime monitors
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "up" });
  } catch (err) {
    return NextResponse.json(
      { status: "error", db: "down", message: (err as Error).message },
      { status: 503 },
    );
  }
}
