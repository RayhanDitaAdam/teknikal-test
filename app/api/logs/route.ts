import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const logs = await prisma.logAktivitas.findMany({
    include: {
      user: { select: { id: true, nama: true, role: true } },
      pemesanan: { select: { id: true, namaPemesan: true, tujuan: true, status: true } },
    },
    orderBy: { timestamp: "desc" },
    take: 200,
  });
  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, aksi, detail, pemesananId } = body;

  if (!userId || !aksi || !detail) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const log = await prisma.logAktivitas.create({
    data: { userId, aksi, detail, pemesananId },
    include: {
      user: { select: { id: true, nama: true, role: true } },
      pemesanan: { select: { id: true, namaPemesan: true, tujuan: true, status: true } },
    },
  });

  return NextResponse.json(log, { status: 201 });
}