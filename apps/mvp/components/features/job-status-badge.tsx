import { Badge } from "@workspace/ui/components/badge";
import { ExecutionStatus } from "@/types/api";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface JobStatusBadgeProps {
  status: ExecutionStatus;
  className?: string;
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const config: Record<
    ExecutionStatus,
    { label: string; variant: any; icon: any; color: string }
  > = {
    CREATED: {
      label: "Created",
      variant: "secondary",
      icon: Clock,
      color: "text-muted-foreground",
    },
    RUNNING: {
      label: "Running",
      variant: "default",
      icon: PlayCircle,
      color: "text-primary-foreground",
    },
    PAUSED: {
      label: "Paused",
      variant: "outline",
      icon: PauseCircle,
      color: "text-orange-500",
    },
    COMPLETED: {
      label: "Completed",
      variant: "default",
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-500 border-green-500/20 shadow-none",
    },
    FAILED: {
      label: "Failed",
      variant: "destructive",
      icon: AlertCircle,
      color: "text-destructive-foreground",
    },
    AWAITING_APPROVAL: {
      label: "Approving",
      variant: "secondary",
      icon: Clock,
      color: "text-blue-500",
    },
  };

  const {
    label,
    variant,
    icon: Icon,
    color,
  } = config[status] || config.CREATED;

  return (
    <Badge
      variant={variant}
      className={cn("gap-1.5 font-medium", color, className)}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
