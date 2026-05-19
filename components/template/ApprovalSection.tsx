import { useState } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApprovalActionDialog } from "@/components/shared/ApprovalActionDialog";
import { Pemesanan, User } from "@/lib/types";
import { statusConfig } from "@/lib/types";
import { format } from "date-fns";

export function ApprovalSection({
  pemesanans, currentUser, canApprove1, canApprove2, onRefresh,
}: {
  pemesanans: Pemesanan[]; currentUser: User | null;
  canApprove1: boolean; canApprove2: boolean; onRefresh: () => void;
}) {
  const [actionTarget, setActionTarget] = useState<{ pemesanan: Pemesanan; action: "approve_1" | "reject_1" | "approve_2" | "reject_2" } | null>(null);

  const isApprover1 = (p: Pemesanan) => currentUser?.id === p.approver1.id || currentUser?.role === "admin";
  const isApprover2 = (p: Pemesanan) => currentUser?.id === p.approver2.id || currentUser?.role === "admin";

  const handleConfirm = async (catatan: string) => {
    if (!actionTarget || !currentUser) return;
    const res = await fetch(`/api/pemesanan/${actionTarget.pemesanan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, action: actionTarget.action, catatan }),
    });
    if (!res.ok) throw new Error("Gagal memproses");
    setActionTarget(null);
    onRefresh();
  };

  const tables = [
    { title: "Pending Level 1", icon: Clock, data: pemesanans.filter((p) => p.status === "pending_level_1"), check: isApprover1, prefix: "_1" as const },
    { title: "Pending Level 2", icon: Clock, data: pemesanans.filter((p) => p.status === "pending_level_2"), check: isApprover2, prefix: "_2" as const },
  ];

  return (
    <div className="space-y-6">
      {tables.map((table) => (
        <Card key={table.title}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <table.icon className="size-4" /> {table.title}
              <Badge variant="default" className="ml-auto">{table.data.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pemesan</TableHead>
                    <TableHead>Tujuan</TableHead>
                    <TableHead>Departemen</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.data.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Tidak ada data</TableCell></TableRow>
                  ) : (
                    table.data.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div><p className="font-medium text-sm">{p.namaPemesan}</p><p className="text-xs text-muted-foreground">{p.departemen}</p></div>
                        </TableCell>
                        <TableCell className="text-sm">{p.tujuan}</TableCell>
                        <TableCell className="text-sm">{p.departemen}</TableCell>
                        <TableCell className="text-xs">{format(new Date(p.tanggalMulai), "dd/MM/yyyy")} - {format(new Date(p.tanggalSelesai), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-right">
                          {table.check(p) ? (
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="xs" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => setActionTarget({ pemesanan: p, action: `approve${table.prefix}` as any })}>
                                <CheckCircle className="size-3" /> Setuju
                              </Button>
                              <Button variant="outline" size="xs" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setActionTarget({ pemesanan: p, action: `reject${table.prefix}` as any })}>
                                <XCircle className="size-3" /> Tolak
                              </Button>
                            </div>
                          ) : (
                            <Badge variant="outline">Menunggu</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader><CardTitle className="text-base">Riwayat Approval</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pemesan</TableHead>
                  <TableHead>Tujuan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pemesanans.filter((p) => p.status === "approved" || p.status === "rejected").slice(0, 10).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-sm">{p.namaPemesan}</TableCell>
                    <TableCell className="text-sm">{p.tujuan}</TableCell>
                    <TableCell><Badge variant={statusConfig[p.status]?.color}>{statusConfig[p.status]?.label}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{p.catatanApprover1 || p.catatanApprover2 || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ApprovalActionDialog
        pemesanan={actionTarget?.pemesanan || null}
        action={actionTarget?.action || null}
        open={!!actionTarget}
        onOpenChange={(o) => { if (!o) setActionTarget(null); }}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
