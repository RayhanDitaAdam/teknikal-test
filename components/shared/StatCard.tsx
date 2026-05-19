import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-lg ${color} text-white`}>
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
