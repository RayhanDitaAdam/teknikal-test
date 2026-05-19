-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "plat" TEXT NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'angkutan_orang',
    "kepemilikan" TEXT NOT NULL DEFAULT 'milik',
    "status" TEXT NOT NULL DEFAULT 'tersedia',
    "kilometer" INTEGER NOT NULL DEFAULT 0,
    "lastService" DATETIME,
    "lastOilChange" DATETIME,
    "lastFuelRefill" DATETIME,
    "nextServiceKm" INTEGER NOT NULL DEFAULT 10000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VehicleServiceLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "kilometer" INTEGER NOT NULL,
    "deskripsi" TEXT,
    "biaya" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VehicleServiceLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pemesanan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pemohonId" TEXT NOT NULL,
    "driverId" TEXT,
    "vehicleId" TEXT,
    "approver1Id" TEXT NOT NULL,
    "approver2Id" TEXT NOT NULL,
    "namaPemesan" TEXT NOT NULL,
    "departemen" TEXT NOT NULL,
    "tanggalMulai" DATETIME NOT NULL,
    "tanggalSelesai" DATETIME NOT NULL,
    "tujuan" TEXT NOT NULL,
    "jarakKm" REAL,
    "jumlahPenumpang" INTEGER NOT NULL,
    "keterangan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending_level_1',
    "catatanApprover1" TEXT,
    "catatanApprover2" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pemesanan_pemohonId_fkey" FOREIGN KEY ("pemohonId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pemesanan_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pemesanan_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pemesanan_approver1Id_fkey" FOREIGN KEY ("approver1Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pemesanan_approver2Id_fkey" FOREIGN KEY ("approver2Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pemesanan" ("approvedAt", "approver1Id", "approver2Id", "catatanApprover1", "catatanApprover2", "createdAt", "departemen", "driverId", "id", "jumlahPenumpang", "keterangan", "namaPemesan", "pemohonId", "status", "tanggalMulai", "tanggalSelesai", "tujuan", "updatedAt") SELECT "approvedAt", "approver1Id", "approver2Id", "catatanApprover1", "catatanApprover2", "createdAt", "departemen", "driverId", "id", "jumlahPenumpang", "keterangan", "namaPemesan", "pemohonId", "status", "tanggalMulai", "tanggalSelesai", "tujuan", "updatedAt" FROM "Pemesanan";
DROP TABLE "Pemesanan";
ALTER TABLE "new_Pemesanan" RENAME TO "Pemesanan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plat_key" ON "Vehicle"("plat");
