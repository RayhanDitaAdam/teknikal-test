import { useState } from "react";
import { Car, BarChart3, Truck, CheckCircle, FileText, LogIn, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/types";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "pemesanan", label: "Pemesanan Baru", icon: Car },
  { id: "kendaraan", label: "Kendaraan", icon: Truck },
  { id: "approval", label: "Approval", icon: CheckCircle },
  { id: "logs", label: "Log Aktivitas", icon: FileText },
];

export function AppLayout({
  currentUser,
  activeTab,
  onTabChange,
  onLoginOpen,
  children,
}: {
  currentUser: User | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLoginOpen: () => void;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transform transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Car className="size-5 text-primary" />
          <span className="font-semibold text-sm">Sistem Kendaraan</span>
        </div>
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                activeTab === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
              {currentUser?.nama?.charAt(0) || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{currentUser?.nama || "Belum login"}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{currentUser?.role || "-"}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <h1 className="text-sm font-medium truncate flex-1">
            {menuItems.find((m) => m.id === activeTab)?.label}
          </h1>
          <Badge variant="outline" className="hidden sm:inline-flex">
            {currentUser?.nama || "Guest"}
          </Badge>
          <button onClick={onLoginOpen} className="lg:hidden">
            <LogIn className="size-4 text-muted-foreground" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
