import { Car, Truck, Users, SquarePen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/lib/types";
import { computeStatus, sisaKm, needOilChange, statusBadge, statusLabel } from "@/lib/vehicle-utils";

const icons: Record<string, React.ReactNode> = {
  angkutan_orang: <Users className="size-4" />,
  angkutan_barang: <Truck className="size-4" />,
};

export function VehicleCard({ vehicle, isBooked, bookedCount = 0, onClick, onEdit }: { vehicle: Vehicle; isBooked?: boolean; bookedCount?: number; onClick: () => void; onEdit?: () => void }) {
  const s = computeStatus(vehicle);
  const sisa = sisaKm(vehicle);
  const jumlah = vehicle.jumlah ?? 1;
  const tersedia = jumlah - bookedCount;
  return (
    <div onClick={isBooked ? undefined : onClick} className={`text-left w-full ${isBooked ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <Card className={`h-full transition-shadow ${isBooked ? "opacity-50" : "hover:shadow-md"}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`flex size-9 items-center justify-center rounded-lg ${isBooked ? "bg-muted" : "bg-primary/10"}`}>
                {icons[vehicle.tipe] || <Car className="size-4" />}
              </div>
              <div>
                <p className="font-medium text-sm">{vehicle.nama}</p>
                <p className="text-xs text-muted-foreground">{vehicle.plat}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div
                onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
                className="flex items-center justify-center size-6 rounded-md hover:bg-muted transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onEdit?.(); } }}
              >
                <SquarePen className="size-3.5 text-muted-foreground" />
              </div>
              {isBooked ? (
                <Badge variant="secondary" className="text-[10px]">Penuh</Badge>
              ) : (
                <Badge variant="outline" className={`text-[10px] ${statusBadge(s)}`}>
                  {statusLabel[s] || s}
                </Badge>
              )}
              {jumlah > 1 && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  {bookedCount}/{jumlah}
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">KM</span>
              <span className="font-medium">{vehicle.kilometer.toLocaleString()} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service tiap</span>
              <span className="font-medium">{vehicle.serviceIntervalKm.toLocaleString()} km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sisa service</span>
              <span className={`font-medium ${sisa <= 0 ? "text-red-600" : sisa <= 2000 ? "text-yellow-600" : "text-green-600"}`}>
                {sisa > 0 ? `${sisa.toLocaleString()} km` : "LEWAT"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bensin</span>
              <span className="font-medium">{vehicle.kmPerLiter} km/L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kepemilikan</span>
              <span className="font-medium capitalize">{vehicle.kepemilikan}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1 mt-1">
              <span className="text-muted-foreground">Unit tersedia</span>
              <span className={`font-medium ${tersedia <= 0 ? "text-red-600" : tersedia <= 1 && jumlah > 1 ? "text-yellow-600" : "text-green-600"}`}>
                {tersedia > 0 ? `${tersedia}/${jumlah}` : "Habis"}
              </span>
            </div>
          </div>
          {needOilChange(vehicle) && !isBooked && (
            <div className="mt-2 text-[10px] text-red-500 font-medium">⚠ Oli perlu diganti</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
