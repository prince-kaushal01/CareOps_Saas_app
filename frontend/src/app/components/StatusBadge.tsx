import { cn } from "../lib/utils";

interface StatusBadgeProps {
  status: "pending" | "completed" | "overdue" | "confirmed" | "cancelled" | "active" | "inactive" | "low" | "critical" | "new" | "no-show" | "normal";
  className?: string;
}

const statusStyles = {
  pending: "bg-warning/10 text-warning border-warning/20",
  completed: "bg-success/10 text-success border-success/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  confirmed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-muted text-muted-foreground border-border",
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-border",
  low: "bg-warning/10 text-warning border-warning/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  new: "bg-primary/10 text-primary border-primary/20",
  "no-show": "bg-destructive/10 text-destructive border-destructive/20",
  normal: "bg-success/10 text-success border-success/20",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
    </span>
  );
}