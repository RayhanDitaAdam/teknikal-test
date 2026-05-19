import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const admin = await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: { nama: "Admin Utama", email: "admin@company.com", role: "admin" },
  });

  const approver1 = await prisma.user.upsert({
    where: { email: "approver1@company.com" },
    update: {},
    create: { nama: "Budi Santoso", email: "approver1@company.com", role: "approver" },
  });

  const approver2 = await prisma.user.upsert({
    where: { email: "approver2@company.com" },
    update: {},
    create: { nama: "Siti Rahmawati", email: "approver2@company.com", role: "approver" },
  });

  const driver1 = await prisma.user.upsert({
    where: { email: "driver1@company.com" },
    update: {},
    create: { nama: "Ahmad Supriyadi", email: "driver1@company.com", role: "driver" },
  });

  const driver2 = await prisma.user.upsert({
    where: { email: "driver2@company.com" },
    update: {},
    create: { nama: "Dodi Kurniawan", email: "driver2@company.com", role: "driver" },
  });

  const driver3 = await prisma.user.upsert({
    where: { email: "driver3@company.com" },
    update: {},
    create: { nama: "Rudi Hermawan", email: "driver3@company.com", role: "driver" },
  });

  console.log("Seeded 6 users");

  const v1 = await prisma.vehicle.create({
    data: {
      nama: "Toyota Avanza", plat: "B 1234 CD", tipe: "angkutan_orang", kepemilikan: "milik", jumlah: 2,
      kilometer: 45230, status: "aman", kmPerLiter: 12, serviceIntervalKm: 10000, oilChangeIntervalKm: 5000,
      lastServiceKm: 44000, lastOilChangeKm: 44000,
      lastService: new Date("2026-04-15"), lastOilChange: new Date("2026-04-15"), lastFuelRefill: new Date("2026-05-18"),
    },
  });

  const v2 = await prisma.vehicle.create({
    data: {
      nama: "Honda CRV", plat: "B 5678 EF", tipe: "angkutan_orang", kepemilikan: "milik", jumlah: 1,
      kilometer: 28300, status: "service", kmPerLiter: 10, serviceIntervalKm: 10000, oilChangeIntervalKm: 5000,
      lastServiceKm: 20000, lastOilChangeKm: 25000,
      lastService: new Date("2026-05-01"), lastOilChange: new Date("2026-05-01"), lastFuelRefill: new Date("2026-05-19"),
    },
  });

  const v3 = await prisma.vehicle.create({
    data: {
      nama: "Suzuki Ertiga", plat: "B 9012 GH", tipe: "angkutan_orang", kepemilikan: "sewa", jumlah: 3,
      kilometer: 18900, status: "aman", kmPerLiter: 11, serviceIntervalKm: 10000, oilChangeIntervalKm: 5000,
      lastServiceKm: 18500, lastOilChangeKm: 18000,
      lastService: new Date("2026-05-10"), lastOilChange: new Date("2026-04-20"), lastFuelRefill: new Date("2026-05-17"),
    },
  });

  const v4 = await prisma.vehicle.create({
    data: {
      nama: "Mitsubishi Pajero", plat: "B 3456 IJ", tipe: "angkutan_barang", kepemilikan: "milik", jumlah: 1,
      kilometer: 67800, status: "danger", kmPerLiter: 8, serviceIntervalKm: 10000, oilChangeIntervalKm: 5000,
      lastServiceKm: 60000, lastOilChangeKm: 60000,
      lastService: new Date("2026-03-20"), lastOilChange: new Date("2026-03-20"), lastFuelRefill: new Date("2026-05-10"),
    },
  });

  const v5 = await prisma.vehicle.create({
    data: {
      nama: "Isuzu Elf", plat: "B 7890 KL", tipe: "angkutan_barang", kepemilikan: "milik", jumlah: 1,
      kilometer: 89200, status: "service", kmPerLiter: 9, serviceIntervalKm: 10000, oilChangeIntervalKm: 5000,
      lastServiceKm: 81000, lastOilChangeKm: 81000,
      lastService: new Date("2026-04-28"), lastOilChange: new Date("2026-02-15"), lastFuelRefill: new Date("2026-05-15"),
    },
  });

  await prisma.vehicleServiceLog.createMany({
    data: [
      { vehicleId: v1.id, tipe: "service", tanggal: new Date("2026-04-15"), kilometer: 44000, deskripsi: "Service rutin 44000 km", biaya: 850000 },
      { vehicleId: v1.id, tipe: "oil_change", tanggal: new Date("2026-04-15"), kilometer: 44000, deskripsi: "Ganti oli mesin", biaya: 350000 },
      { vehicleId: v1.id, tipe: "fuel", tanggal: new Date("2026-05-18"), kilometer: 45100, deskripsi: "Isi bensin full tank", biaya: 450000 },
      { vehicleId: v1.id, tipe: "other", tanggal: new Date("2026-03-10"), kilometer: 42000, deskripsi: "Ganti ban depan", biaya: 1200000 },
      { vehicleId: v2.id, tipe: "service", tanggal: new Date("2026-05-01"), kilometer: 28000, deskripsi: "Service rutin 28000 km", biaya: 750000 },
      { vehicleId: v2.id, tipe: "oil_change", tanggal: new Date("2026-05-01"), kilometer: 28000, deskripsi: "Ganti oli & filter", biaya: 400000 },
      { vehicleId: v2.id, tipe: "fuel", tanggal: new Date("2026-05-19"), kilometer: 28200, deskripsi: "Isi bensin", biaya: 350000 },
      { vehicleId: v3.id, tipe: "service", tanggal: new Date("2026-05-10"), kilometer: 18500, deskripsi: "Service rutin 18500 km", biaya: 650000 },
      { vehicleId: v3.id, tipe: "oil_change", tanggal: new Date("2026-04-20"), kilometer: 18000, deskripsi: "Ganti oli", biaya: 300000 },
      { vehicleId: v3.id, tipe: "fuel", tanggal: new Date("2026-05-17"), kilometer: 18800, deskripsi: "Isi bensin", biaya: 300000 },
      { vehicleId: v4.id, tipe: "service", tanggal: new Date("2026-03-20"), kilometer: 67000, deskripsi: "Service besar 67000 km", biaya: 2500000 },
      { vehicleId: v4.id, tipe: "oil_change", tanggal: new Date("2026-03-20"), kilometer: 67000, deskripsi: "Ganti oli gardan", biaya: 500000 },
      { vehicleId: v4.id, tipe: "fuel", tanggal: new Date("2026-05-10"), kilometer: 67600, deskripsi: "Isi solar", biaya: 600000 },
      { vehicleId: v5.id, tipe: "service", tanggal: new Date("2026-04-28"), kilometer: 88500, deskripsi: "Service rutin 88500 km", biaya: 1800000 },
      { vehicleId: v5.id, tipe: "oil_change", tanggal: new Date("2026-02-15"), kilometer: 86000, deskripsi: "Ganti oli mesin", biaya: 450000 },
      { vehicleId: v5.id, tipe: "fuel", tanggal: new Date("2026-05-15"), kilometer: 89000, deskripsi: "Isi solar", biaya: 550000 },
    ],
  });

  console.log("Seeded 5 vehicles with service logs");

  const booking1 = await prisma.pemesanan.create({
    data: {
      pemohonId: admin.id, driverId: driver1.id, vehicleId: v1.id,
      approver1Id: approver1.id, approver2Id: approver2.id,
      namaPemesan: "Admin Utama", departemen: "IT",
      tanggalMulai: new Date("2026-05-20T08:00:00Z"), tanggalSelesai: new Date("2026-05-20T17:00:00Z"),
      tujuan: "Bandung", jarakKm: 150,
      jumlahPenumpang: 3, status: "approved", keterangan: "Meeting dengan client di Bandung", approvedAt: new Date(),
    },
  });

  const booking2 = await prisma.pemesanan.create({
    data: {
      pemohonId: admin.id, driverId: driver2.id, vehicleId: v2.id,
      approver1Id: approver1.id, approver2Id: approver2.id,
      namaPemesan: "Admin Utama", departemen: "Finance",
      tanggalMulai: new Date("2026-05-22T09:00:00Z"), tanggalSelesai: new Date("2026-05-22T16:00:00Z"),
      tujuan: "Surabaya", jarakKm: 780,
      jumlahPenumpang: 4, status: "pending_level_2", keterangan: "Audit keuangan cabang Surabaya",
    },
  });

  const booking3 = await prisma.pemesanan.create({
    data: {
      pemohonId: admin.id, driverId: driver3.id, vehicleId: v3.id,
      approver1Id: approver1.id, approver2Id: approver2.id,
      namaPemesan: "Admin Utama", departemen: "HRD",
      tanggalMulai: new Date("2026-05-25T07:00:00Z"), tanggalSelesai: new Date("2026-05-25T18:00:00Z"),
      tujuan: "Jakarta", jarakKm: 450,
      jumlahPenumpang: 2, status: "pending_level_1", keterangan: "Hari rekrutmen di Jakarta",
    },
  });

  const booking4 = await prisma.pemesanan.create({
    data: {
      pemohonId: admin.id, driverId: driver1.id, vehicleId: v1.id,
      approver1Id: approver1.id, approver2Id: approver2.id,
      namaPemesan: "Admin Utama", departemen: "IT",
      tanggalMulai: new Date("2026-05-10T08:00:00Z"), tanggalSelesai: new Date("2026-05-10T15:00:00Z"),
      tujuan: "Bogor", jarakKm: 50,
      jumlahPenumpang: 3, status: "rejected", catatanApprover1: "Jadwal bentrok dengan event lain",
    },
  });

  console.log("Seeded 4 bookings");

  await prisma.logAktivitas.createMany({
    data: [
      { userId: admin.id, pemesananId: booking1.id, aksi: "CREATE_PEMESANAN", detail: "Pemesanan baru: Admin Utama - Bandung (IT) - Pending Level 1" },
      { userId: approver1.id, pemesananId: booking1.id, aksi: "APPROVE_LEVEL_1", detail: "Disetujui oleh Approver 1 - Admin Utama (Bandung)" },
      { userId: approver2.id, pemesananId: booking1.id, aksi: "APPROVE_LEVEL_2", detail: "Disetujui oleh Approver 2 - Admin Utama (Bandung) - Selesai" },
      { userId: admin.id, pemesananId: booking2.id, aksi: "CREATE_PEMESANAN", detail: "Pemesanan baru: Admin Utama - Surabaya (Finance) - Pending Level 1" },
      { userId: approver1.id, pemesananId: booking2.id, aksi: "APPROVE_LEVEL_1", detail: "Disetujui oleh Approver 1 - Admin Utama (Surabaya)" },
      { userId: admin.id, pemesananId: booking3.id, aksi: "CREATE_PEMESANAN", detail: "Pemesanan baru: Admin Utama - Jakarta (HRD) - Pending Level 1" },
      { userId: admin.id, pemesananId: booking4.id, aksi: "CREATE_PEMESANAN", detail: "Pemesanan baru: Admin Utama - Bogor (IT) - Pending Level 1" },
      { userId: approver1.id, pemesananId: booking4.id, aksi: "REJECT_LEVEL_1", detail: "Ditolak oleh Approver 1 - Admin Utama (Bogor): Jadwal bentrok" },
      { userId: admin.id, aksi: "LOGIN", detail: "User Admin Utama (admin) masuk ke sistem" },
      { userId: approver1.id, aksi: "LOGIN", detail: "User Budi Santoso (approver) masuk ke sistem" },
    ],
  });

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });