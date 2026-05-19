import { Vehicle } from "./types";

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
