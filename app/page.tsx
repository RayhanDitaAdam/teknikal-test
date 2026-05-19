"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { User, Pemesanan, Vehicle, LogEntry } from "@/lib/types";
import { statusConfig } from "@/lib/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoginDialog } from "@/components/shared/LoginDialog";
import { DashboardSection } from "@/components/template/DashboardSection";
import { PemesananFormSection } from "@/components/template/PemesananFormSection";
import { KendaraanSection } from "@/components/template/KendaraanSection";
import { ApprovalSection } from "@/components/template/ApprovalSection";
import { LogSection } from "@/components/template/LogSection";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [pemesanans, setPemesanans] = useState<Pemesanan[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginDialog, setLoginDialog] = useState(true);

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then(setUsers);
    fetchData();
  }, []);

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/pemesanan").then((r) => r.json()),
      fetch("/api/logs").then((r) => r.json()),
      fetch("/api/vehicles").then((r) => r.json()),
    ]).then(([pemesananData, logsData, vehiclesData]) => {
      setPemesanans(pemesananData);
      setLogs(logsData);
      setVehicles(vehiclesData);
    }).finally(() => setLoading(false));
  }, []);

  const dismissLogin = async (user: User) => {
    setCurrentUser(user);
    setLoginDialog(false);
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, aksi: "LOGIN", detail: `User ${user.nama} (${user.role}) masuk ke sistem` }),
      });
    } catch {}
  };

  const exportToExcel = async () => {
    const data = pemesanans.map((p) => ({
      "Nama Pemesan": p.namaPemesan,
      Departemen: p.departemen,
      Driver: p.driver?.nama || "-",
      Kendaraan: p.vehicle ? `${p.vehicle.nama} (${p.vehicle.plat})` : "-",
      "Approver 1": p.approver1.nama,
      "Approver 2": p.approver2.nama,
      "Tgl Mulai": format(new Date(p.tanggalMulai), "dd/MM/yyyy"),
      "Tgl Selesai": format(new Date(p.tanggalSelesai), "dd/MM/yyyy"),
      Tujuan: p.tujuan,
      "Jarak (km)": p.jarakKm || "-",
      Penumpang: p.jumlahPenumpang,
      Status: statusConfig[p.status]?.label || p.status,
      Dibuat: format(new Date(p.createdAt), "dd/MM/yyyy HH:mm"),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pemesanan");
    XLSX.writeFile(wb, `laporan_pemesanan_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`);
    if (currentUser) {
      fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, aksi: "EXPORT_EXCEL", detail: `Export ${data.length} data pemesanan ke Excel` }),
      }).catch(() => {});
    }
  };

  const adminUsers = users.filter((u) => u.role === "admin");
  const driverUsers = users.filter((u) => u.role === "driver");
  const approverUsers = users.filter((u) => u.role === "approver");
  const canApprove1 = currentUser?.role === "approver" || currentUser?.role === "admin";
  const canApprove2 = currentUser?.role === "approver" || currentUser?.role === "admin";

  return (
    <>
      {loginDialog && <LoginDialog users={users} onSelect={dismissLogin} />}

      <AppLayout currentUser={currentUser} activeTab={activeTab} onTabChange={setActiveTab} onLoginOpen={() => setLoginDialog(true)}>
        {activeTab === "dashboard" && (
          <DashboardSection pemesanans={pemesanans} vehicles={vehicles} exportToExcel={exportToExcel} />
        )}

        {activeTab === "pemesanan" && (
          <PemesananFormSection
            adminUsers={adminUsers}
            driverUsers={driverUsers}
            approverUsers={approverUsers}
            vehicles={vehicles}
            pemesanans={pemesanans}
            currentUser={currentUser}
            onSuccess={fetchData}
          />
        )}

        {activeTab === "kendaraan" && (
          <KendaraanSection vehicles={vehicles} pemesanans={pemesanans} onRefresh={fetchData} />
        )}

        {activeTab === "approval" && (
          <ApprovalSection
            pemesanans={pemesanans}
            currentUser={currentUser}
            canApprove1={canApprove1}
            canApprove2={canApprove2}
            onRefresh={fetchData}
          />
        )}

        {activeTab === "logs" && (
          <LogSection logs={logs} loading={loading} />
        )}
      </AppLayout>
    </>
  );
}
