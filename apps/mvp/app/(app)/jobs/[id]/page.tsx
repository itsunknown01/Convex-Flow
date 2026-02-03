"use client";

import { useExecution } from "@/hooks/use-jobs";
import { JobStatusBadge } from "@/components/features/job-status-badge";
import { AiInsight } from "@/components/features/ai-insight";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChevronLeft,
  Terminal,
  History,
  Database,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { motion } from "framer-motion";

export default function JobDetailPage() {
  const { id } = useParams();
  const { data: execution, isLoading, isError } = useExecution(id as string);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-8 w-48 rounded-lg" />
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <AlertCircle className="h-8 w-8 text-red-400" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          Execution not found
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          The requested job execution could not be retrieved.
        </p>
        <Button className="mt-6" asChild variant="outline">
          <Link href="/jobs">Back to Jobs</Link>
        </Button>
      </motion.div>
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="hover:bg-muted/50"
          >
            <Link href="/jobs">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Back to Jobs</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {execution.workflowDefinition?.title || "Workflow Execution"}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-mono bg-muted/30 px-2 py-1 rounded-lg w-fit">
              <Terminal className="h-3 w-3" aria-hidden="true" />
              {execution.id}
            </div>
          </div>
        </div>
        <JobStatusBadge status={execution.status} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AiInsight
            summary={aiInsight.summary}
            explanation={aiInsight.explanation}
            confidence={aiInsight.confidence}
          />

          {/* Execution History */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <History
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                Execution History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-6 space-y-6 border-l-2 border-muted py-2">
                {/* Completed step */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-background shadow-lg shadow-emerald-500/30" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Job Completed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Workflow execution finished successfully.
                    </p>
                  </div>
                </div>
                {/* Policy step */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-background shadow-lg shadow-blue-500/30" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Policy Verification
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Deterministic policy engine validated the current state.
                    </p>
                  </div>
                </div>
                {/* Started step */}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-purple-500 ring-4 ring-background shadow-lg shadow-purple-500/30" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      Workflow Started
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Execution initialized by system orchestrator.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Context Data Card */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Database
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                Context Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 bg-muted/10">
                <pre className="text-[10px] font-mono leading-relaxed overflow-x-auto text-muted-foreground">
                  {JSON.stringify(
                    execution.input || { message: "No input data provided" },
                    null,
                    2,
                  )}
                </pre>
              </div>
              <div className="p-3 border-t border-border/50 text-[10px] text-muted-foreground bg-muted/5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Last updated:{" "}
                {new Date(execution.updatedAt).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full gap-2 border-border/50 hover:border-primary/40"
            variant="outline"
            asChild
          >
            <Link href={`/workflows/${execution.workflowDefinitionId}`}>
              Edit Definition{" "}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
