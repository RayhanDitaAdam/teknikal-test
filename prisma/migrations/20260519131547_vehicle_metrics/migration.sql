/*
  Warnings:

  - You are about to drop the column `nextServiceKm` on the `Vehicle` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "plat" TEXT NOT NULL,
    "tipe" TEXT NOT NULL DEFAULT 'angkutan_orang',
    "kepemilikan" TEXT NOT NULL DEFAULT 'milik',
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
INSERT INTO "new_Vehicle" ("createdAt", "id", "kepemilikan", "kilometer", "lastFuelRefill", "lastOilChange", "lastService", "nama", "plat", "status", "tipe", "updatedAt") SELECT "createdAt", "id", "kepemilikan", "kilometer", "lastFuelRefill", "lastOilChange", "lastService", "nama", "plat", "status", "tipe", "updatedAt" FROM "Vehicle";
DROP TABLE "Vehicle";
ALTER TABLE "new_Vehicle" RENAME TO "Vehicle";
CREATE UNIQUE INDEX "Vehicle_plat_key" ON "Vehicle"("plat");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
