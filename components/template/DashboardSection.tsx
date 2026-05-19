import { Car, Clock, CheckCircle, XCircle, BarChart3, Truck, FileDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/shared/StatCard";
import { Pemesanan, Vehicle, statusConfig } from "@/lib/types";
import { statusColor } from "@/lib/vehicle-utils";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LineChart, Line,
} from "recharts";

export function DashboardSection({
  pemesanans, vehicles, exportToExcel,
}: {
  pemesanans: Pemesanan[];
  vehicles: Vehicle[];
  exportToExcel: () => void;
}) {
  const pendingLevel1 = pemesanans.filter((p) => p.status === "pending_level_1");
  const pendingLevel2 = pemesanans.filter((p) => p.status === "pending_level_2");
  const approved = pemesanans.filter((p) => p.status === "approved");
  const rejected = pemesanans.filter((p) => p.status === "rejected");

  const stats = [
    { label: "Total Pemesanan", value: pemesanans.length, icon: Car, color: "bg-blue-500" },
    { label: "Pending Level 1", value: pendingLevel1.length, icon: Clock, color: "bg-yellow-500" },
    { label: "Pending Level 2", value: pendingLevel2.length, icon: Clock, color: "bg-orange-500" },
    { label: "Disetujui", value: approved.length, icon: CheckCircle, color: "bg-green-500" },
    { label: "Ditolak", value: rejected.length, icon: XCircle, color: "bg-red-500" },
  ];

  const statusChart = [
    { name: "Pending L1", value: pendingLevel1.length, fill: "#eab308" },
    { name: "Pending L2", value: pendingLevel2.length, fill: "#f97316" },
    { name: "Disetujui", value: approved.length, fill: "#22c55e" },
    { name: "Ditolak", value: rejected.length, fill: "#ef4444" },
  ];

  const departemenCount = pemesanans.reduce<Record<string, number>>((acc, p) => {
    acc[p.departemen] = (acc[p.departemen] || 0) + 1;
    return acc;
  }, {});
  const departemenChart = Object.entries(departemenCount).map(([name, value]) => ({ name, value, fill: "#3b82f6" }));

  const monthlyCount = pemesanans.reduce<Record<string, number>>((acc, p) => {
    const month = format(new Date(p.createdAt), "MMM yy");
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const monthlyChart = Object.entries(monthlyCount).map(([name, total]) => ({ name, total }));
  const COLORS = ["#eab308", "#f97316", "#22c55e", "#ef4444"];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="size-4" /> Pemesanan per Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(value) => [value, "Jumlah"]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {statusChart.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="size-4" /> Distribusi Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(value) => [value, "Jumlah"]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {statusChart.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="size-4" /> Pemesanan per Departemen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departemenChart} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" className="text-xs" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(value) => [value, "Pemesanan"]} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="size-4" /> Trend Pemesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(value) => [value, "Pemesanan"]} />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="size-4" /> Kendaraan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Plat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KM</TableHead>
                    <TableHead>Bensin</TableHead>
                    <TableHead>Dipakai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium text-sm">{v.nama}</TableCell>
                      <TableCell className="text-sm">{v.plat}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${statusColor(v.status)}`}>
                          {v.status === "aman" ? "Aman" : v.status === "service" ? "Perlu Service" : "Bahaya"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{v.kilometer.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{v.kmPerLiter} km/L</TableCell>
                      <TableCell className="text-sm">{v._count?.pemesanans || 0}x</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileDown className="size-4" /> Export Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Download laporan pemesanan kendaraan format Excel.
            </p>
            <Button onClick={exportToExcel} className="gap-2">
              <FileDown className="size-4" /> Export ke Excel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
