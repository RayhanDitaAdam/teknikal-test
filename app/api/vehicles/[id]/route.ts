import { NextRequest, NextResponse } from "next/server";
import { prisma, createLog } from "@/lib/db";

function computeStatus(v: { kilometer: number; lastServiceKm: number | null; serviceIntervalKm: number }): string {
  const nextService = (v.lastServiceKm || 0) + v.serviceIntervalKm;
  const remaining = nextService - v.kilometer;
  if (remaining <= 0) return "danger";
  if (remaining <= 2000) return "service";
  return "aman";
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      serviceLogs: { orderBy: { tanggal: "desc" } },
      pemesanans: {
        include: { pemohon: { select: { nama: true } }, driver: { select: { nama: true } } },
        orderBy: { createdAt: "desc" }, take: 10,
      },
    },
  });

  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const withStatus = { ...vehicle, status: computeStatus(vehicle) };
  return NextResponse.json(withStatus);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updateData: any = {};

    if (body.nama !== undefined) updateData.nama = body.nama;
    if (body.plat !== undefined) updateData.plat = body.plat;
    if (body.tipe !== undefined) updateData.tipe = body.tipe;
    if (body.kepemilikan !== undefined) updateData.kepemilikan = body.kepemilikan;
    if (body.kilometer !== undefined) updateData.kilometer = parseInt(body.kilometer);
    if (body.kmPerLiter !== undefined) updateData.kmPerLiter = parseFloat(body.kmPerLiter);
    if (body.serviceIntervalKm !== undefined) updateData.serviceIntervalKm = parseInt(body.serviceIntervalKm);
    if (body.oilChangeIntervalKm !== undefined) updateData.oilChangeIntervalKm = parseInt(body.oilChangeIntervalKm);
    if (body.jumlah !== undefined) updateData.jumlah = parseInt(body.jumlah);

    if (body.aksi === "service_done") {
      const newKm = vehicle.kilometer;
      updateData.lastServiceKm = newKm;
      updateData.lastService = new Date();
      await prisma.vehicleServiceLog.create({
        data: {
          vehicleId: id, tipe: "service", tanggal: new Date(),
          kilometer: newKm, deskripsi: body.deskripsi || "Service rutin",
          biaya: body.biaya ? parseFloat(body.biaya) : null,
        },
      });
    }

    if (body.aksi === "oil_change") {
      const newKm = vehicle.kilometer;
      updateData.lastOilChangeKm = newKm;
      updateData.lastOilChange = new Date();
      await prisma.vehicleServiceLog.create({
        data: {
          vehicleId: id, tipe: "oil_change", tanggal: new Date(),
          kilometer: newKm, deskripsi: body.deskripsi || "Ganti oli",
          biaya: body.biaya ? parseFloat(body.biaya) : null,
        },
      });
    }

    if (body.aksi === "fuel") {
      await prisma.vehicleServiceLog.create({
        data: {
          vehicleId: id, tipe: "fuel", tanggal: new Date(),
          kilometer: vehicle.kilometer, deskripsi: body.deskripsi || "Isi BBM",
          biaya: body.biaya ? parseFloat(body.biaya) : null,
        },
      });
      updateData.lastFuelRefill = new Date();
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: updateData,
      include: { serviceLogs: { orderBy: { tanggal: "desc" }, take: 5 } },
    });

    const result = { ...updated, status: computeStatus(updated) };
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.vehicleServiceLog.deleteMany({ where: { vehicleId: id } });
  await prisma.vehicle.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}