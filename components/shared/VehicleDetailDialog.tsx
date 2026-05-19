import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vehicle } from "@/lib/types";
import { computeStatus, sisaKm, statusBadge, statusLabel } from "@/lib/vehicle-utils";
import { serviceLabel } from "@/lib/types";
import { format } from "date-fns";

export function VehicleDetailDialog({
  vehicle, open, onOpenChange, onServiceAction,
}: {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onServiceAction: (vehicle: Vehicle, tipe: string) => void;
}) {
  if (!vehicle) return null;
  const s = computeStatus(vehicle);
  const sisa = sisaKm(vehicle);
  const biayaBensin = vehicle.kmPerLiter > 0 ? Math.round(1 / vehicle.kmPerLiter * 15000) : 0;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onOpenChange(false); }}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            {vehicle.nama}
            <Badge variant="outline" className="text-xs">{vehicle.plat}</Badge>
            <Badge variant="outline" className={`text-[10px] ${statusBadge(s)}`}>{statusLabel[s] || s}</Badge>
          </DialogTitle>
          <DialogDescription>
            {vehicle.tipe === "angkutan_orang" ? "Angkutan Orang" : "Angkutan Barang"} · {vehicle.kepemilikan === "milik" ? "Milik Perusahaan" : "Sewa"}
            {s === "danger" && <span className="text-red-500 font-medium ml-2">🚫 Tidak bisa disewakan</span>}
            {s === "service" && <span className="text-yellow-500 font-medium ml-2">⚠ Hanya perjalanan pendek</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <div className="p-2 rounded-lg bg-muted/40 text-center">
            <p className="text-[10px] text-muted-foreground">KM</p>
            <p className="font-semibold text-xs">{vehicle.kilometer.toLocaleString()}</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 text-center">
            <p className="text-[10px] text-muted-foreground">Bensin</p>
            <p className="font-semibold text-xs">{vehicle.kmPerLiter} km/L</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 text-center">
            <p className="text-[10px] text-muted-foreground">Ganti Oli tiap</p>
            <p className="font-semibold text-xs">{vehicle.oilChangeIntervalKm.toLocaleString()} km</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 text-center">
            <p className="text-[10px] text-muted-foreground">Service tiap</p>
            <p className="font-semibold text-xs">{vehicle.serviceIntervalKm.toLocaleString()} km</p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 text-center">
            <p className="text-[10px] text-muted-foreground">Sisa service</p>
            <p className={`font-semibold text-xs ${s === "danger" ? "text-red-600" : s === "service" ? "text-yellow-600" : "text-green-600"}`}>
              {sisa > 0 ? `${sisa.toLocaleString()} km` : "LEWAT"}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-muted/40 text-center">
            <p className="text-[10px] text-muted-foreground">Biaya/km</p>
            <p className="font-semibold text-xs">Rp {biayaBensin.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="xs" variant="outline" className="text-green-600 border-green-200"
            onClick={() => { onServiceAction(vehicle, "service_done"); }}>
            Service Selesai
          </Button>
          <Button size="xs" variant="outline" className="text-blue-600 border-blue-200"
            onClick={() => { onServiceAction(vehicle, "oil_change"); }}>
            Ganti Oli
          </Button>
          <Button size="xs" variant="outline" className="text-orange-600 border-orange-200"
            onClick={() => { onServiceAction(vehicle, "fuel"); }}>
            Isi BBM
          </Button>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Riwayat Service</h4>
          <div className="overflow-x-auto max-h-48 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Tanggal</TableHead>
                  <TableHead className="text-xs">Tipe</TableHead>
                  <TableHead className="text-xs">KM</TableHead>
                  <TableHead className="text-xs">Deskripsi</TableHead>
                  <TableHead className="text-xs text-right">Biaya</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicle.serviceLogs?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground text-xs py-6">Belum ada riwayat</TableCell></TableRow>
                ) : (
                  vehicle.serviceLogs?.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs">{format(new Date(log.tanggal), "dd/MM/yy")}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{serviceLabel[log.tipe] || log.tipe}</Badge></TableCell>
                      <TableCell className="text-xs">{log.kilometer.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">{log.deskripsi || "-"}</TableCell>
                      <TableCell className="text-xs text-right">{log.biaya ? `Rp ${log.biaya.toLocaleString()}` : "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
