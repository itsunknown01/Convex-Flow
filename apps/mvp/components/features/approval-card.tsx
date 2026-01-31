import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { WorkflowExecution } from "@/types/api";
import { Check, X, ShieldAlert, Sparkles } from "lucide-react";
import { useUpdateExecutionStatus } from "@/hooks/use-jobs";
import { ConfidenceBadge } from "@workspace/ui/components/confidence-badge";

interface ApprovalCardProps {
  execution: WorkflowExecution;
}

export function ApprovalCard({ execution }: ApprovalCardProps) {
  const updateStatus = useUpdateExecutionStatus();

  return (
    <Card className="border-blue-500/30 bg-blue-500/5 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-blue-500/10">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
          <ShieldAlert className="h-4 w-4" />
          Human Approval Required
        </CardTitle>
        <ConfidenceBadge score={82} />
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold truncate">
            {execution.workflowDefinition?.title}
          </h4>
          <p className="text-xs text-muted-foreground font-mono">
            Execution: #{execution.id.slice(0, 8)}
          </p>
        </div>

        <div className="rounded-lg bg-background p-3 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              AI Context
            </span>
          </div>
          <p className="text-xs leading-relaxed">
            This step involves a sensitive compliance check. The AI recommends
            **Approval** based on matching entity records, but manual
            verification is required per Policy #42.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          variant="default"
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={() =>
            updateStatus.mutate({ id: execution.id, status: "RUNNING" })
          }
          disabled={updateStatus.isPending}
        >
          <Check className="h-4 w-4 mr-2" /> Approve
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
          onClick={() =>
            updateStatus.mutate({ id: execution.id, status: "FAILED" })
          }
          disabled={updateStatus.isPending}
        >
          <X className="h-4 w-4 mr-2" /> Reject
        </Button>
      </CardFooter>
    </Card>
  );
}
