import { useState, useEffect } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Vehicle } from "@/lib/types";
import { computeStatus } from "@/lib/vehicle-utils";

export function PemesananFormSection({
  adminUsers, driverUsers, approverUsers, vehicles, currentUser, onSuccess,
}: {
  adminUsers: User[]; driverUsers: User[]; approverUsers: User[]; vehicles: Vehicle[];
  currentUser: User | null; onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    pemohonId: currentUser?.id || "", driverId: "", vehicleId: "",
    approver1Id: "", approver2Id: "", namaPemesan: currentUser?.nama || "",
    departemen: "", tanggalMulai: "", tanggalSelesai: "", tujuan: "",
    jarakKm: "", jumlahPenumpang: "1", keterangan: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) setForm((f) => ({ ...f, pemohonId: currentUser.id, namaPemesan: currentUser.nama }));
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError(""); setSuccess(false);
    try {
      const res = await fetch("/api/pemesanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Gagal membuat pemesanan"); }
      setSuccess(true);
      setForm({ pemohonId: currentUser?.id || "", driverId: "", vehicleId: "", approver1Id: "", approver2Id: "", namaPemesan: currentUser?.nama || "", departemen: "", tanggalMulai: "", tanggalSelesai: "", tujuan: "", jarakKm: "", jumlahPenumpang: "1", keterangan: "" });
      onSuccess();
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  const updateField = (field: string, value: string | null) => {
    if (!value) return;
    setForm((f) => ({ ...f, [field]: value }));
    if (field === "approver1Id" && value === form.approver2Id) setForm((f) => ({ ...f, approver2Id: "" }));
    if (field === "approver2Id" && value === form.approver1Id) setForm((f) => ({ ...f, approver1Id: "" }));
    if (field === "tujuan" && value.length > 2) {
      setTimeout(async () => {
        try {
          const res = await fetch(`/api/distance?tujuan=${encodeURIComponent(value)}`);
          if (res.ok) { const data = await res.json(); setForm((f) => ({ ...f, jarakKm: data.jarakKm.toString() })); }
        } catch {}
      }, 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Car className="size-5" /> Form Pemesanan Kendaraan</CardTitle></CardHeader>
        <CardContent>
          {success && <Alert className="mb-4 bg-green-50 border-green-200 text-green-800"><AlertDescription>Pemesanan berhasil dibuat! Status: Pending Level 1</AlertDescription></Alert>}
          {error && <Alert className="mb-4 bg-red-50 border-red-200 text-red-800"><AlertDescription>{error}</AlertDescription></Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="namaPemesan">Nama Pemesan</Label><Input className="cursor-not-allowed" id="namaPemesan" value={form.namaPemesan} readOnly /></div>
              <div className="space-y-2"><Label htmlFor="departemen">Departemen</Label><Input id="departemen" placeholder="Contoh: IT, Finance, HRD" value={form.departemen} onChange={(e) => updateField("departemen", e.target.value)} required /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="tanggalMulai">Tanggal Mulai</Label><Input id="tanggalMulai" type="date" value={form.tanggalMulai} onChange={(e) => updateField("tanggalMulai", e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="tanggalSelesai">Tanggal Selesai</Label><Input id="tanggalSelesai" type="date" value={form.tanggalSelesai} onChange={(e) => updateField("tanggalSelesai", e.target.value)} required /></div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tujuan">Tujuan</Label>
              <Input id="tujuan" placeholder="Contoh: Bandung, Surabaya" value={form.tujuan} onChange={(e) => updateField("tujuan", e.target.value)} required />
              {form.jarakKm && <p className="text-xs text-muted-foreground mt-1">Jarak dari Jakarta: <span className="font-medium text-primary">{form.jarakKm} km</span></p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="jumlahPenumpang">Jumlah Penumpang</Label><Input id="jumlahPenumpang" type="number" min="1" value={form.jumlahPenumpang} onChange={(e) => updateField("jumlahPenumpang", e.target.value)} required /></div>
              <div className="space-y-2">
                <Label htmlFor="driverId">Pilih Driver</Label>
                <Select value={form.driverId} onValueChange={(v) => updateField("driverId", v)}>
                  <SelectTrigger><SelectValue>{driverUsers.find((d) => d.id === form.driverId)?.nama || "Pilih Driver"}</SelectValue></SelectTrigger>
                  <SelectContent>{driverUsers.map((d) => <SelectItem key={d.id} value={d.id}>{d.nama}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Pilih Kendaraan</Label>
              <Select value={form.vehicleId} onValueChange={(v) => updateField("vehicleId", v)}>
                <SelectTrigger><SelectValue>{vehicles.find((v) => v.id === form.vehicleId) ? `${vehicles.find((v) => v.id === form.vehicleId)!.nama} - ${vehicles.find((v) => v.id === form.vehicleId)!.plat}` : "Pilih Kendaraan"}</SelectValue></SelectTrigger>
                <SelectContent>{vehicles.filter((v) => computeStatus(v) !== "danger").map((v) => <SelectItem key={v.id} value={v.id}>{v.nama} - {v.plat} ({v.kilometer} km) {computeStatus(v) === "service" ? "⚠" : ""}</SelectItem>)}</SelectContent>
              </Select>
              {(() => {
                const v = vehicles.find((x) => x.id === form.vehicleId);
                if (!v) return null;
                const isService = computeStatus(v) === "service";
                const sisaKm = (v.lastServiceKm || 0) + v.serviceIntervalKm - v.kilometer;
                return (
                  <div className="text-xs mt-1 space-y-0.5">
                    <p className="text-muted-foreground">KM: {v.kilometer.toLocaleString()} | Bensin: {v.kmPerLiter} km/L | Sisa service: {sisaKm > 0 ? `${sisaKm.toLocaleString()} km` : "LEWAT"}</p>
                    {isService && form.jarakKm && parseInt(form.jarakKm) > 100 && <p className="text-yellow-600 font-medium">⚠ Status service - tidak disarankan perjalanan &gt;100 km</p>}
                  </div>
                );
              })()}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="approver1Id">Pilih Approver 1</Label>
                <Select value={form.approver1Id} onValueChange={(v) => updateField("approver1Id", v)}>
                  <SelectTrigger><SelectValue>{approverUsers.find((b) => b.id === form.approver1Id)?.nama || "Pilih Approver 1"}</SelectValue></SelectTrigger>
                  <SelectContent>{approverUsers.map((a) => <SelectItem key={a.id} value={a.id}>{a.nama}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="approver2Id">Pilih Approver 2</Label>
                <Select value={form.approver2Id} onValueChange={(v) => updateField("approver2Id", v)}>
                  <SelectTrigger><SelectValue>{approverUsers.find((b) => b.id === form.approver2Id)?.nama || "Pilih Approver 2"}</SelectValue></SelectTrigger>
                  <SelectContent>{approverUsers.map((a) => <SelectItem key={a.id} value={a.id}>{a.nama}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
              <Textarea id="keterangan" placeholder="Tambahan keterangan..." value={form.keterangan} onChange={(e) => updateField("keterangan", e.target.value)} rows={3} />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Menyimpan..." : "Submit Pemesanan"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
