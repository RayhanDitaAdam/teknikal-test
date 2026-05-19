import { NextRequest, NextResponse } from "next/server";
import { prisma, createLog } from "@/lib/db";

export async function GET() {
  const pemesanans = await prisma.pemesanan.findMany({
    include: {
      pemohon: { select: { id: true, nama: true } },
      driver: { select: { id: true, nama: true } },
      vehicle: { select: { id: true, nama: true, plat: true } },
      approver1: { select: { id: true, nama: true } },
      approver2: { select: { id: true, nama: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(pemesanans);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pemohonId, driverId, vehicleId, approver1Id, approver2Id, namaPemesan, departemen, tanggalMulai, tanggalSelesai, tujuan, jarakKm, jumlahPenumpang, keterangan } = body;

  if (!pemohonId || !approver1Id || !approver2Id || !namaPemesan || !departemen || !tanggalMulai || !tanggalSelesai || !tujuan || !jumlahPenumpang) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const pemesanan = await prisma.pemesanan.create({
    data: {
      pemohonId,
      driverId,
      vehicleId,
      approver1Id,
      approver2Id,
      namaPemesan,
      departemen,
      tanggalMulai: new Date(tanggalMulai),
      tanggalSelesai: new Date(tanggalSelesai),
      tujuan,
      jarakKm: jarakKm ? parseFloat(jarakKm) : null,
      jumlahPenumpang: parseInt(jumlahPenumpang),
      keterangan,
      status: "pending_level_1",
    },
    include: {
      pemohon: { select: { nama: true } },
      vehicle: { select: { id: true, nama: true, plat: true } },
      approver1: { select: { nama: true } },
      approver2: { select: { nama: true } },
    },
  });

  await createLog(pemohonId, "CREATE_PEMESANAN", `Pemesanan baru: ${body.namaPemesan} - ${body.tujuan} (${body.departemen}) - Pending Level 1`, pemesanan.id);

  return NextResponse.json(pemesanan, { status: 201 });
}