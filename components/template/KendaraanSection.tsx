import { useState } from "react";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vehicle, Pemesanan } from "@/lib/types";
import { computeStatus, isVehicleFullyBooked, getBookedCountsByDate } from "@/lib/vehicle-utils";
import { VehicleCard } from "@/components/shared/VehicleCard";
import { TambahVehicleDialog } from "@/components/shared/TambahVehicleDialog";
import { EditVehicleDialog } from "@/components/shared/EditVehicleDialog";
import { VehicleDetailDialog } from "@/components/shared/VehicleDetailDialog";
import { ServiceModal } from "@/components/shared/ServiceModal";

export function KendaraanSection({ vehicles, pemesanans, onRefresh }: { vehicles: Vehicle[]; pemesanans: Pemesanan[]; onRefresh: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const bookedToday = getBookedCountsByDate(pemesanans, today, tomorrow);
  const [detail, setDetail] = useState<Vehicle | null>(null);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [tambahOpen, setTambahOpen] = useState(false);
  const [vehicleSearch, setVehicleSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [serviceModal, setServiceModal] = useState<{ vehicle: Vehicle; tipe: string } | null>(null);

  const filtered = vehicles.filter((v) => {
    if (filterStatus !== "all" && computeStatus(v) !== filterStatus) return false;
    if (vehicleSearch) {
      const q = vehicleSearch.toLowerCase();
      return v.nama.toLowerCase().includes(q) || v.plat.toLowerCase().includes(q);
    }
    return true;
  });

  const handleServiceAction = (vehicle: Vehicle, tipe: string) => {
    setDetail(null);
    setServiceModal({ vehicle, tipe });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{vehicles.length} kendaraan terdaftar</p>
        <Button size="sm" onClick={() => setTambahOpen(true)} className="gap-1">
          <Car className="size-4" /> Tambah Kendaraan
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input placeholder="Cari kendaraan..." value={vehicleSearch} onChange={(e) => setVehicleSearch(e.target.value)} className="w-full" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm">
          <option value="all">Semua Status</option>
          <option value="aman">Aman</option>
          <option value="service">Perlu Service</option>
          <option value="danger">Bahaya</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <VehicleCard key={v.id} vehicle={v} bookedCount={bookedToday.get(v.id) || 0} isBooked={isVehicleFullyBooked(v.id, today, tomorrow, pemesanans, v.jumlah)} onClick={() => setDetail(v)} onEdit={() => setEditVehicle(v)} />
        ))}
      </div>

      <TambahVehicleDialog open={tambahOpen} onOpenChange={setTambahOpen} onSuccess={onRefresh} />

      <EditVehicleDialog vehicle={editVehicle} open={!!editVehicle} onOpenChange={(o) => { if (!o) setEditVehicle(null); }} onSuccess={onRefresh} />

      <VehicleDetailDialog vehicle={detail} open={!!detail} onOpenChange={(o) => { if (!o) setDetail(null); }} onServiceAction={handleServiceAction} />

      {serviceModal && (
        <ServiceModal
          vehicle={serviceModal.vehicle}
          tipe={serviceModal.tipe}
          open={!!serviceModal}
          onOpenChange={() => setServiceModal(null)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
}
