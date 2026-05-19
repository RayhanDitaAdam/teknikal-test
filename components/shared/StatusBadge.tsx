import { Badge } from "@/components/ui/badge";
import { statusBadge as badgeClass, statusLabel } from "@/lib/vehicle-utils";

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`text-[10px] ${badgeClass(status)}`}>
      {statusLabel[status] || status}
    </Badge>
  );
}
