import * as React from "react";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

interface ConfidenceBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number; // 0 to 100
}

function ConfidenceBadge({ score, className, ...props }: ConfidenceBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let colorClass = "text-muted-foreground";

  if (score >= 80) {
    colorClass = "bg-green-500/10 text-green-500 border-green-500/20";
  } else if (score >= 50) {
    colorClass = "bg-amber-500/10 text-amber-500 border-amber-500/20";
  } else {
    colorClass = "bg-destructive/10 text-destructive border-destructive/20";
  }

  return (
    <Badge
      variant={variant}
      className={cn(
        "gap-1.5 font-mono text-[10px] uppercase tracking-wider",
        colorClass,
        className,
      )}
      {...props}
    >
      {score}% Confidence
    </Badge>
  );
}

export { ConfidenceBadge };
