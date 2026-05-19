import { Users, Truck, CheckCircle, ChevronRight, LogIn } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/lib/types";
import { RoleOrder } from "@/lib/types";

const roleIcons: Record<string, React.ReactNode> = {
  admin: <Users className="size-4" />,
  driver: <Truck className="size-4" />,
  approver: <CheckCircle className="size-4" />,
};

export function LoginDialog({ users, onSelect }: { users: User[]; onSelect: (user: User) => void }) {
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="size-5" /> Pilih User
          </DialogTitle>
          <DialogDescription>
            Pilih user untuk melanjutkan ke sistem pemesanan kendaraan.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 max-h-72 overflow-y-auto">
          {users.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-8">
              Belum ada user. Data akan diisi otomatis.
            </div>
          )}
          {[...users]
            .sort((a, b) => RoleOrder[a.role] - RoleOrder[b.role])
            .map((user) => (
              <button
                key={user.id}
                onClick={() => onSelect(user)}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-all text-left"
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  {roleIcons[user.role]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.nama}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              </button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
