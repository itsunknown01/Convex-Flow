import { WorkflowExecution } from "@/types/api";
import { JobStatusBadge } from "./job-status-badge";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

interface ExecutionRowProps {
  execution: WorkflowExecution;
}

export function ExecutionRow({ execution }: ExecutionRowProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-lg border transition-colors group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
          <Terminal className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">
              {execution.workflowDefinition?.title || "Unknown Workflow"}
            </h4>
            <span className="text-xs text-muted-foreground font-mono">
              #{execution.id.slice(0, 8)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <JobStatusBadge
              status={execution.status}
              className="scale-90 origin-left"
            />
            <span className="text-xs text-muted-foreground">
              Started{" "}
              {formatDistanceToNow(new Date(execution.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {execution.currentStepId && (
          <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded bg-muted text-[10px] font-mono uppercase text-muted-foreground">
            Step: {execution.currentStepId}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="group-hover:translate-x-1 transition-transform"
        >
          <Link href={`/jobs/${execution.id}`}>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function ExecutionRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border animate-pulse">
      <div className="flex items-center gap-4 flex-1">
        <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-1/3 bg-muted rounded" />
          <div className="h-3 w-1/4 bg-muted rounded" />
        </div>
      </div>
      <div className="h-8 w-8 bg-muted rounded" />
    </div>
  );
}
