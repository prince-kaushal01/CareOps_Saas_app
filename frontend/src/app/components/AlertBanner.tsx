import { AlertTriangle, CheckCircle, Info, XCircle, X } from "lucide-react";
import { cn } from "../lib/utils";

interface AlertBannerProps {
  variant: "info" | "success" | "warning" | "danger";
  title: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const variantStyles = {
  info: {
    container: "bg-primary/10 border-primary/20",
    icon: "text-primary",
    title: "text-primary",
    Icon: Info,
  },
  success: {
    container: "bg-success/10 border-success/20",
    icon: "text-success",
    title: "text-success",
    Icon: CheckCircle,
  },
  warning: {
    container: "bg-warning/10 border-warning/20",
    icon: "text-warning",
    title: "text-warning",
    Icon: AlertTriangle,
  },
  danger: {
    container: "bg-destructive/10 border-destructive/20",
    icon: "text-destructive",
    title: "text-destructive",
    Icon: XCircle,
  },
};

export function AlertBanner({
  variant,
  title,
  description,
  dismissible,
  onDismiss,
  action,
}: AlertBannerProps) {
  const styles = variantStyles[variant];
  const Icon = styles.Icon;

  return (
    <div className={cn("border rounded-xl p-4 flex items-start gap-3", styles.container)}>
      <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", styles.icon)} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium mb-1", styles.title)}>{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-black/10 transition-colors"
        >
          {action.label}
        </button>
      )}
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="h-6 w-6 rounded hover:bg-black/10 flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
