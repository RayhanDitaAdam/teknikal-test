-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "plat" TEXT NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'angkutan_orang',
    "kepemilikan" TEXT NOT NULL DEFAULT 'milik',
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'aman',
    "kilometer" INTEGER NOT NULL DEFAULT 0,
    "kmPerLiter" REAL NOT NULL DEFAULT 10,
    "serviceIntervalKm" INTEGER NOT NULL DEFAULT 10000,
    "oilChangeIntervalKm" INTEGER NOT NULL DEFAULT 5000,
    "lastServiceKm" INTEGER,
    "lastOilChangeKm" INTEGER,
    "lastService" DATETIME,
    "lastOilChange" DATETIME,
    "lastFuelRefill" DATETIME,
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

-- CreateTable
CREATE TABLE "Pemesanan" (
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

-- CreateTable
CREATE TABLE "LogAktivitas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "pemesananId" TEXT,
    "aksi" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LogAktivitas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LogAktivitas_pemesananId_fkey" FOREIGN KEY ("pemesananId") REFERENCES "Pemesanan" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plat_key" ON "Vehicle"("plat");
