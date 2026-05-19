import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vehicle } from "@/lib/types";

export function ServiceModal({ vehicle, tipe, open, onOpenChange, onSuccess }: { vehicle: Vehicle; tipe: string; open: boolean; onOpenChange: (o: boolean) => void; onSuccess: () => void }) {
  const [desc, setDesc] = useState("");
  const [biaya, setBiaya] = useState("");

  const label = tipe === "service_done" ? "Service Selesai" : tipe === "oil_change" ? "Ganti Oli" : "Isi BBM";

  const handleSubmit = async () => {
    try {
      await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aksi: tipe, deskripsi: desc, biaya }),
      });
      onOpenChange(false);
      setDesc("");
      setBiaya("");
      onSuccess();
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onOpenChange(false); setDesc(""); setBiaya(""); } }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-sm">{label}</DialogTitle>
          <DialogDescription>{vehicle.nama} - {vehicle.plat}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Deskripsi</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="Catatan..." />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Biaya (opsional)</Label>
            <Input type="number" value={biaya} onChange={(e) => setBiaya(e.target.value)} placeholder="Rp" />
          </div>
          <Button onClick={handleSubmit} className="w-full">Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
