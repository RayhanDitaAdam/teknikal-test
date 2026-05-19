export type User = {
  id: string;
  nama: string;
  email: string;
  role: string;
};

export type VehicleServiceLog = {
  id: string;
  tipe: string;
  tanggal: string;
  kilometer: number;
  deskripsi?: string;
  biaya?: number;
};

export type Vehicle = {
  id: string;
  nama: string;
  plat: string;
  tipe: string;
  kepemilikan: string;
  jumlah: number;
  status: string;
  kilometer: number;
  kmPerLiter: number;
  serviceIntervalKm: number;
  oilChangeIntervalKm: number;
  lastService?: string;
  lastOilChange?: string;
  lastFuelRefill?: string;
  lastServiceKm?: number;
  lastOilChangeKm?: number;
  serviceLogs: VehicleServiceLog[];
  _count: { pemesanans: number };
};

export type Pemesanan = {
  id: string;
  namaPemesan: string;
  departemen: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  tujuan: string;
  jarakKm?: number;
  jumlahPenumpang: number;
  keterangan?: string;
  status: string;
  catatanApprover1?: string;
  catatanApprover2?: string;
  createdAt: string;
  pemohon: { id: string; nama: string };
  driver: { id: string; nama: string } | null;
  vehicle: { id: string; nama: string; plat: string } | null;
  approver1: { id: string; nama: string };
  approver2: { id: string; nama: string };
};

export type LogEntry = {
  id: string;
  aksi: string;
  detail: string;
  timestamp: string;
  user: { nama: string; role: string };
  pemesanan: { id: string; namaPemesan: string; tujuan: string; status: string } | null;
};

export const statusConfig: Record<string, { label: string; color: "default" | "secondary" | "destructive" | "outline" }> = {
  pending_level_1: { label: "Pending Level 1", color: "default" },
  pending_level_2: { label: "Pending Level 2", color: "secondary" },
  approved: { label: "Disetujui", color: "outline" },
  rejected: { label: "Ditolak", color: "destructive" },
};

export const RoleOrder: Record<string, number> = {
  admin: 1,
  approver: 2,
  driver: 3,
};

export const roleIcons: Record<string, string> = {
  admin: "Users",
  driver: "Truck",
  approver: "CheckCircle",
};

export const tipeIcons: Record<string, string> = {
  angkutan_orang: "Users",
  angkutan_barang: "Truck",
};

export const serviceLabel: Record<string, string> = {
  service_done: "Service Rutin",
  oil_change: "Ganti Oli",
  fuel: "Isi BBM",
  other: "Lainnya",
};
