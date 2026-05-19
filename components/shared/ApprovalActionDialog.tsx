import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pemesanan } from "@/lib/types";

export function ApprovalActionDialog({
  pemesanan, action, open, onOpenChange, onConfirm,
}: {
  pemesanan: Pemesanan | null;
  action: "approve_1" | "reject_1" | "approve_2" | "reject_2" | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (catatan: string) => Promise<void>;
}) {
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);

  if (!pemesanan || !action) return null;
  const isApprove = action.includes("approve");

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(catatan);
    setLoading(false);
    setCatatan("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onOpenChange(false); setCatatan(""); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isApprove ? "Setujui Pemesanan" : "Tolak Pemesanan"}</DialogTitle>
          <DialogDescription>{pemesanan.namaPemesan} - {pemesanan.tujuan}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>Catatan (Opsional)</Label>
          <Textarea placeholder="Masukkan catatan..." value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={3} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button variant={isApprove ? "default" : "destructive"} onClick={handleConfirm} disabled={loading}>
            {loading ? "Memproses..." : isApprove ? "Setujui" : "Tolak"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
