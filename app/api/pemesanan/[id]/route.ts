import { NextRequest, NextResponse } from "next/server";
import { prisma, createLog } from "@/lib/db";

const pemesananInclude = {
  pemohon: { select: { id: true, nama: true } },
  driver: { select: { id: true, nama: true } },
  vehicle: { select: { id: true, nama: true, plat: true } },
  approver1: { select: { id: true, nama: true } },
  approver2: { select: { id: true, nama: true } },
};

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { userId, action, catatan } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const pemesanan = await prisma.pemesanan.findUnique({ where: { id } });

  if (!pemesanan) {
    return NextResponse.json({ error: "Pemesanan not found" }, { status: 404 });
  }

  if (action === "approve_1") {
    if (pemesanan.status !== "pending_level_1") {
      return NextResponse.json({ error: "Invalid status for  this action" }, { status: 400 });
    }
    const updated = await prisma.pemesanan.update({
      where: { id },
      data: { status: "pending_level_2", catatanApprover1: catatan, approvedAt: new Date() },
      include: pemesananInclude,
    });
    await createLog(userId, "APPROVE_LEVEL_1", `Disetujui oleh Approver 1 - ${pemesanan.namaPemesan} (${pemesanan.tujuan})${catatan ? `: ${catatan}` : ""}`, id);
    return NextResponse.json(updated);
  }

  if (action === "reject_1") {
    if (pemesanan.status !== "pending_level_1") {
      return NextResponse.json({ error: "Invalid status for this action" }, { status: 400 });
    }
    const updated = await prisma.pemesanan.update({
      where: { id },
      data: { status: "rejected", catatanApprover1: catatan },
      include: pemesananInclude,
    });
    await createLog(userId, "REJECT_LEVEL_1", `Ditolak oleh Approver 1 - ${pemesanan.namaPemesan} (${pemesanan.tujuan})${catatan ? `: ${catatan}` : ""}`, id);
    return NextResponse.json(updated);
  }

  if (action === "approve_2") {
    if (pemesanan.status !== "pending_level_2") {
      return NextResponse.json({ error: "Invalid status for this action" }, { status: 400 });
    }
    const updated = await prisma.pemesanan.update({
      where: { id },
      data: { status: "approved", catatanApprover2: catatan },
      include: pemesananInclude,
    });
    await createLog(userId, "APPROVE_LEVEL_2", `Disetujui oleh Approver 2 - ${pemesanan.namaPemesan} (${pemesanan.tujuan}) - Selesai${catatan ? `: ${catatan}` : ""}`, id);
    return NextResponse.json(updated);
  }

  if (action === "reject_2") {
    if (pemesanan.status !== "pending_level_2") {
      return NextResponse.json({ error: "Invalid status for this action" }, { status: 400 });
    }
    const updated = await prisma.pemesanan.update({
      where: { id },
      data: { status: "rejected", catatanApprover2: catatan },
      include: pemesananInclude,
    });
    await createLog(userId, "REJECT_LEVEL_2", `Ditolak oleh Approver 2 - ${pemesanan.namaPemesan} (${pemesanan.tujuan})${catatan ? `: ${catatan}` : ""}`, id);
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}