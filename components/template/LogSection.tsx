import { useState } from "react";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogEntry } from "@/lib/types";
import { statusConfig } from "@/lib/types";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { format } from "date-fns";
import { FiLogIn, FiFileText, FiCheckCircle, FiXCircle, FiDownload } from "react-icons/fi";

const aksiConfig: Record<string, { label: string; color: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  LOGIN: { label: "Login", color: "secondary", icon: <FiLogIn className="size-3.5" /> },
  CREATE_PEMESANAN: { label: "Buat Pemesanan", color: "default", icon: <FiFileText className="size-3.5" /> },
  APPROVE_LEVEL_1: { label: "Approve Level 1", color: "outline", icon: <FiCheckCircle className="size-3.5" /> },
  APPROVE_LEVEL_2: { label: "Approve Level 2", color: "outline", icon: <FiCheckCircle className="size-3.5" /> },
  REJECT_LEVEL_1: { label: "Tolak Level 1", color: "destructive", icon: <FiXCircle className="size-3.5" /> },
  REJECT_LEVEL_2: { label: "Tolak Level 2", color: "destructive", icon: <FiXCircle className="size-3.5" /> },
  EXPORT_EXCEL: { label: "Export Excel", color: "secondary", icon: <FiDownload className="size-3.5" /> },
};

export function LogSection({ logs, loading }: { logs: LogEntry[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [filterAksi, setFilterAksi] = useState<string>("all");

  const aksiList = [...new Set(logs.map((l) => l.aksi))];

  const filtered = logs.filter((log) => {
    if (filterAksi !== "all" && log.aksi !== filterAksi) return false;
    if (search) {
      const q = search.toLowerCase();
      return log.detail.toLowerCase().includes(q) || log.user.nama.toLowerCase().includes(q) ||
        log.pemesanan?.namaPemesan?.toLowerCase().includes(q) || log.pemesanan?.tujuan?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="size-4" /> Log Aktivitas
            <Badge variant="outline" className="ml-auto text-xs">{filtered.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input placeholder="Cari log..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full" />
            </div>
            <select value={filterAksi} onChange={(e) => setFilterAksi(e.target.value)} className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm">
              <option value="all">Semua Aksi</option>
              {aksiList.map((a) => <option key={a} value={a}>{aksiConfig[a]?.label || a}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Waktu</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead>Pemesanan Terkait</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Memuat...</TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">{search || filterAksi !== "all" ? "Tidak ada log yang cocok" : "Belum ada log"}</TableCell></TableRow>
                ) : (
                  filtered.map((log) => {
                    const aksi = aksiConfig[log.aksi] || { label: log.aksi, color: "default" as const, icon: null };
                    return (
                      <TableRow key={log.id} className="hover:bg-muted/50">
                        <TableCell className="text-xs whitespace-nowrap">
                          <div className="font-medium">{format(new Date(log.timestamp), "dd/MM/yy")}</div>
                          <div className="text-muted-foreground">{format(new Date(log.timestamp), "HH:mm:ss")}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-2">
                            <UserAvatar name={log.user.nama} />
                            <div>
                              <p className="font-medium text-sm">{log.user.nama}</p>
                              <Badge variant="outline" className="text-[10px] px-1 py-0">{log.user.role}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={aksi.color} className="text-xs gap-1 whitespace-nowrap">
                            {aksi.icon} {aksi.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[250px] truncate">{log.detail}</TableCell>
                        <TableCell className="text-xs">
                          {log.pemesanan ? (
                            <div className="flex flex-col">
                              <span className="font-medium">{log.pemesanan.namaPemesan}</span>
                              <span className="text-muted-foreground">{log.pemesanan.tujuan}</span>
                              <Badge variant={statusConfig[log.pemesanan.status]?.color || "outline"} className="text-[10px] px-1 py-0 mt-0.5 w-fit">
                                {statusConfig[log.pemesanan.status]?.label || log.pemesanan.status}
                              </Badge>
                            </div>
                          ) : <span className="text-muted-foreground">-</span>}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
