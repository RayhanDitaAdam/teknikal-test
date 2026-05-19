import { NextRequest, NextResponse } from "next/server";
import { prisma, createLog } from "@/lib/db";

function computeStatus(v: { kilometer: number; lastServiceKm: number | null; serviceIntervalKm: number }): string {
  const nextService = (v.lastServiceKm || 0) + v.serviceIntervalKm;
  const remaining = nextService - v.kilometer;
  if (remaining <= 0) return "danger";
  if (remaining <= 2000) return "service";
  return "aman";
}

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      serviceLogs: { orderBy: { tanggal: "desc" }, take: 5 },
      _count: { select: { pemesanans: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = vehicles.map((v) => ({
    ...v,
    status: computeStatus(v),
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nama, plat, tipe, kepemilikan, jumlah, kilometer, kmPerLiter, serviceIntervalKm, oilChangeIntervalKm, lastServiceKm, lastOilChangeKm } = body;

  if (!nama || !plat) {
    return NextResponse.json({ error: "Nama dan plat wajib diisi" }, { status: 400 });
  }

  const data: any = {
    nama,
    plat,
    tipe: tipe || "angkutan_orang",
    kepemilikan: kepemilikan || "milik",
    jumlah: parseInt(jumlah || "1"),
    kilometer: parseInt(kilometer || "0"),
    kmPerLiter: parseFloat(kmPerLiter || "10"),
    serviceIntervalKm: parseInt(serviceIntervalKm || "10000"),
    oilChangeIntervalKm: parseInt(oilChangeIntervalKm || "5000"),
    lastServiceKm: lastServiceKm ? parseInt(lastServiceKm) : null,
    lastOilChangeKm: lastOilChangeKm ? parseInt(lastOilChangeKm) : null,
    status: "aman",
  };

  const vehicle = await prisma.vehicle.create({ data });

  return NextResponse.json(vehicle, { status: 201 });
}