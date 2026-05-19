import { Vehicle, Pemesanan } from "./types";

export function computeStatus(v: Vehicle): string {
  if (v.status && ["aman", "service", "danger"].includes(v.status)) return v.status;
  const next = (v.lastServiceKm || 0) + v.serviceIntervalKm;
  const sisa = next - v.kilometer;
  if (sisa <= 0) return "danger";
  if (sisa <= 2000) return "service";
  return "aman";
}

export function nextServiceKm(v: Vehicle): number {
  return (v.lastServiceKm || 0) + v.serviceIntervalKm;
}

export function sisaKm(v: Vehicle): number {
  return nextServiceKm(v) - v.kilometer;
}

export function needOilChange(v: Vehicle): boolean {
  const next = (v.lastOilChangeKm || 0) + v.oilChangeIntervalKm;
  return v.kilometer >= next;
}

export const statusBadge = (s: string) => {
  switch (s) {
    case "aman": return "text-green-600 border-green-200 bg-green-50";
    case "service": return "text-yellow-600 border-yellow-200 bg-yellow-50";
    case "danger": return "text-red-600 border-red-200 bg-red-50";
    default: return "";
  }
};

export const statusLabel: Record<string, string> = {
  aman: "Aman",
  service: "Perlu Service",
  danger: "Berbahaya",
};

export const statusColor = (s: string) => {
  switch (s) {
    case "aman": return "text-green-600 border-green-200 bg-green-50";
    case "service": return "text-yellow-600 border-yellow-200 bg-yellow-50";
    case "danger": return "text-red-600 border-red-200 bg-red-50";
    default: return "";
  }
};

function countBookedUnits(
  vehicleId: string,
  tanggalMulai: string,
  tanggalSelesai: string,
  pemesanans: Pemesanan[]
): number {
  const start = new Date(tanggalMulai);
  const end = new Date(tanggalSelesai);
  return pemesanans.filter((p) => {
    if (p.vehicle?.id !== vehicleId) return false;
    if (p.status === "rejected") return false;
    const pStart = new Date(p.tanggalMulai);
    const pEnd = new Date(p.tanggalSelesai);
    return start <= pEnd && end >= pStart;
  }).length;
}

export function isVehicleFullyBooked(
  vehicleId: string,
  tanggalMulai: string,
  tanggalSelesai: string,
  pemesanans: Pemesanan[],
  jumlah: number
): boolean {
  return countBookedUnits(vehicleId, tanggalMulai, tanggalSelesai, pemesanans) >= jumlah;
}

export function getAvailableCount(
  vehicleId: string,
  tanggalMulai: string,
  tanggalSelesai: string,
  pemesanans: Pemesanan[],
  jumlah: number
): number {
  return jumlah - countBookedUnits(vehicleId, tanggalMulai, tanggalSelesai, pemesanans);
}

export function getBookedCountsByDate(
  pemesanans: Pemesanan[],
  tanggalMulai: string,
  tanggalSelesai: string
): Map<string, number> {
  const start = new Date(tanggalMulai);
  const end = new Date(tanggalSelesai);
  const counts = new Map<string, number>();
  for (const p of pemesanans) {
    if (p.status === "rejected" || !p.vehicle) continue;
    const pStart = new Date(p.tanggalMulai);
    const pEnd = new Date(p.tanggalSelesai);
    if (start <= pEnd && end >= pStart) {
      counts.set(p.vehicle.id, (counts.get(p.vehicle.id) || 0) + 1);
    }
  }
  return counts;
}

export function isVehicleUnavailable(
  vehicleId: string,
  tanggalMulai: string,
  tanggalSelesai: string,
  pemesanans: Pemesanan[],
  jumlah: number
): boolean {
  return isVehicleFullyBooked(vehicleId, tanggalMulai, tanggalSelesai, pemesanans, jumlah);
}
