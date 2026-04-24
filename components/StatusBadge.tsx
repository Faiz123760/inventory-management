import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
      case "paid":
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pending":
      case "unpaid":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "shipped":
      case "in transit":
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
      case "returned":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("text-[10px] font-bold uppercase tracking-wide", getStatusStyles(status), className)}
    >
      {status}
    </Badge>
  );
}
