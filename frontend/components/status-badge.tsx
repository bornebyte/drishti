import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone =
    normalized === "critical"
      ? "bg-red-100 text-red-700"
      : normalized === "high"
        ? "bg-orange-100 text-orange-700"
        : normalized === "medium" || normalized === "acknowledged"
          ? "bg-amber-100 text-amber-700"
          : normalized === "resolved" || normalized === "online" || normalized === "active"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-700";

  return <Badge className={cn(tone)}>{value.replaceAll("_", " ")}</Badge>;
}
