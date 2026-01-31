"use client";

import { useExecution } from "@/hooks/use-jobs";
import { JobStatusBadge } from "@/components/features/job-status-badge";
import { AiInsight } from "@/components/features/ai-insight";
import { Button } from "@workspace/ui/components/button";
import {
  ChevronLeft,
  Terminal,
  History,
  Database,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function JobDetailPage() {
  const { id } = useParams();
  const { data: execution, isLoading, isError } = useExecution(id as string);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-48 rounded-md" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[300px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !execution) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold">Execution not found</h3>
        <p className="text-muted-foreground mt-2">
          The requested job execution could not be retrieved.
        </p>
        <Button className="mt-6" asChild variant="outline">
          <Link href="/jobs">Back to Jobs</Link>
        </Button>
      </div>
    );
  }

  // Mock AI data if not present (for Phase 6 demo)
  const aiInsight = {
    summary:
      "The workflow completed successfully with high deterministic accuracy. All policy checks passed without human intervention.",
    explanation:
      "Based on the input vector, the orchestrator selected the 'standard_compliance' path. No anomalies were detected in the job logs.",
    confidence: 94,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/jobs">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {execution.workflowDefinition?.title || "Workflow Execution"}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-mono">
              <Terminal className="h-3 w-3" />
              {execution.id}
            </div>
          </div>
        </div>
        <JobStatusBadge status={execution.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AiInsight
            summary={aiInsight.summary}
            explanation={aiInsight.explanation}
            confidence={aiInsight.confidence}
          />

          <div className="rounded-xl border bg-card">
            <div className="p-4 border-b flex items-center gap-2 font-semibold text-sm">
              <History className="h-4 w-4 text-primary" />
              Execution History
            </div>
            <div className="p-4">
              <div className="relative pl-6 space-y-6 border-l-2 border-muted py-2">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-background" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Job Completed</p>
                    <p className="text-xs text-muted-foreground">
                      Workflow execution finished successfully.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Policy Verification</p>
                    <p className="text-xs text-muted-foreground">
                      Deterministic policy engine validated the current state.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-muted-foreground ring-4 ring-background" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Workflow Started</p>
                    <p className="text-xs text-muted-foreground">
                      Execution initialized by system orchestrator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="p-4 border-b bg-muted/30 flex items-center gap-2 font-semibold text-sm">
              <Database className="h-4 w-4 text-primary" />
              Context Data
            </div>
            <div className="p-4 bg-muted/10">
              <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto text-muted-foreground italic">
                {JSON.stringify(
                  execution.input || { message: "No input data provided" },
                  null,
                  2,
                )}
              </pre>
            </div>
            <div className="p-3 border-t text-[10px] text-muted-foreground bg-muted/5">
              Last updated: {new Date(execution.updatedAt).toLocaleTimeString()}
            </div>
          </div>

          <Button className="w-full gap-2" variant="outline" asChild>
            <Link href={`/workflows/${execution.workflowDefinitionId}`}>
              Edit Definition <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
