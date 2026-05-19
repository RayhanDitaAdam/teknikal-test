import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vehicle } from "@/lib/types";

export function EditVehicleDialog({
  vehicle, open, onOpenChange, onSuccess,
}: {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    nama: "", plat: "", tipe: "angkutan_orang", kepemilikan: "milik",
    jumlah: "1", kilometer: "0", kmPerLiter: "10",
    serviceIntervalKm: "10000", oilChangeIntervalKm: "5000",
  });

  useEffect(() => {
    if (vehicle) {
      setForm({
        nama: vehicle.nama ?? "",
        plat: vehicle.plat ?? "",
        tipe: vehicle.tipe ?? "angkutan_orang",
        kepemilikan: vehicle.kepemilikan ?? "milik",
        jumlah: (vehicle.jumlah ?? 1).toString(),
        kilometer: (vehicle.kilometer ?? 0).toString(),
        kmPerLiter: (vehicle.kmPerLiter ?? 10).toString(),
        serviceIntervalKm: (vehicle.serviceIntervalKm ?? 10000).toString(),
        oilChangeIntervalKm: (vehicle.oilChangeIntervalKm ?? 5000).toString(),
      });
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle) return;
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        onOpenChange(false);
        onSuccess();
      }
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Edit Kendaraan</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Nama Kendaraan</Label><Input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Plat Nomor</Label><Input required value={form.plat} onChange={(e) => setForm({ ...form, plat: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Tipe</Label>
              <select value={form.tipe} onChange={(e) => setForm({ ...form, tipe: e.target.value })} className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm">
                <option value="angkutan_orang">Angkutan Orang</option>
                <option value="angkutan_barang">Angkutan Barang</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Kepemilikan</Label>
              <select value={form.kepemilikan} onChange={(e) => setForm({ ...form, kepemilikan: e.target.value })} className="h-8 w-full rounded-lg border border-input bg-transparent px-2 text-sm">
                <option value="milik">Milik Perusahaan</option>
                <option value="sewa">Sewa</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1"><Label className="text-xs">KM</Label><Input type="number" value={form.kilometer} onChange={(e) => setForm({ ...form, kilometer: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Bensin (km/L)</Label><Input type="number" step="0.1" value={form.kmPerLiter} onChange={(e) => setForm({ ...form, kmPerLiter: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Jumlah Unit</Label><Input type="number" min="1" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><Label className="text-xs">Service setiap (km)</Label><Input type="number" value={form.serviceIntervalKm} onChange={(e) => setForm({ ...form, serviceIntervalKm: e.target.value })} /></div>
            <div className="space-y-1"><Label className="text-xs">Ganti Oli setiap (km)</Label><Input type="number" value={form.oilChangeIntervalKm} onChange={(e) => setForm({ ...form, oilChangeIntervalKm: e.target.value })} /></div>
          </div>
          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
