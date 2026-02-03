"use client";

import { useWorkflow } from "@/hooks/use-workflows";
import { useJobs, useRunWorkflow } from "@/hooks/use-jobs";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ArrowLeft,
  Play,
  Clock,
  Calendar,
  FileJson,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

// Status color configuration
const statusColors = {
  COMPLETED: {
    dot: "bg-emerald-500",
    glow: "shadow-emerald-500/30",
    text: "text-emerald-400",
  },
  RUNNING: {
    dot: "bg-blue-500 animate-pulse",
    glow: "shadow-blue-500/30",
    text: "text-blue-400",
  },
  FAILED: {
    dot: "bg-red-500",
    glow: "shadow-red-500/30",
    text: "text-red-400",
  },
  AWAITING_APPROVAL: {
    dot: "bg-amber-500",
    glow: "shadow-amber-500/30",
    text: "text-amber-400",
  },
};

export default function WorkflowDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: workflow,
    isLoading: isWorkflowLoading,
    isError,
  } = useWorkflow(id);
  const { data: executions, isLoading: isExecutionsLoading } = useJobs();
  const runWorkflow = useRunWorkflow();

  const [isRunning, setIsRunning] = useState(false);

  // Filter executions for this workflow
  const workflowExecutions = executions?.filter(
    (exec) => exec.workflowDefinitionId === id,
  );

  const handleRun = async () => {
    try {
      setIsRunning(true);
      await runWorkflow.mutateAsync({
        workflowDefinitionId: id,
        input: {}, // Default empty input for now
      });
    } catch (error) {
      console.error("Failed to run workflow:", error);
    } finally {
      setIsRunning(false);
    }
  };

  if (isWorkflowLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className="h-10 w-10 animate-spin text-primary"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (isError || !workflow) {
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
          Workflow not found
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          The requested workflow definition could not be loaded.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/workflows">Back to Workflows</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Link
              href="/workflows"
              className="hover:text-foreground transition-colors flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Workflows
            </Link>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-foreground font-medium truncate">
              {workflow.title}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {workflow.title}
          </h1>
          <p className="text-muted-foreground">
            {workflow.description || "No description provided."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            style={{ boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)" }}
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
            Run Workflow
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Recent Executions */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10">
                  <Sparkles
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <CardTitle>Recent Executions</CardTitle>
                  <CardDescription>
                    History of recent runs for this workflow.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isExecutionsLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Loader2
                    className="h-6 w-6 animate-spin mx-auto mb-2"
                    aria-hidden="true"
                  />
                  Loading executions...
                </div>
              ) : !workflowExecutions?.length ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Play
                    className="h-8 w-8 mx-auto mb-3 opacity-40"
                    aria-hidden="true"
                  />
                  <p>No executions found yet.</p>
                  <p className="text-sm mt-1">
                    Run this workflow to see executions.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {workflowExecutions.map((exec) => {
                    const status =
                      statusColors[exec.status as keyof typeof statusColors] ||
                      statusColors.AWAITING_APPROVAL;
                    return (
                      <Link
                        href={`/jobs/${exec.id}`}
                        key={exec.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-3 w-3 rounded-full ${status.dot} shadow-lg ${status.glow}`}
                          />
                          <div>
                            <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                              Run #{exec.id.slice(-6)}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              {new Date(exec.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                            exec.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : exec.status === "RUNNING"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : exec.status === "FAILED"
                                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {exec.status.replace("_", " ")}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1.5">
                  ID
                </div>
                <div className="text-sm font-mono bg-muted/30 p-2.5 rounded-lg break-all border border-border/50">
                  {workflow.id}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1.5">
                  Version
                </div>
                <div className="text-sm flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    v{workflow.version}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1.5">
                  Created
                </div>
                <div className="text-sm flex items-center gap-2 text-foreground">
                  <Calendar
                    className="h-3.5 w-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {new Date(workflow.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1.5">
                  Last Updated
                </div>
                <div className="text-sm flex items-center gap-2 text-foreground">
                  <Clock
                    className="h-3.5 w-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {new Date(workflow.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Definition Preview */}
          <Card className="border-border/50 overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-gradient-to-r from-purple-500/10 to-pink-500/5">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 rounded-lg bg-purple-500/20">
                  <FileJson
                    className="h-4 w-4 text-purple-400"
                    aria-hidden="true"
                  />
                </div>
                Definition
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="text-xs bg-muted/10 p-4 overflow-auto max-h-[300px] font-mono text-muted-foreground">
                {JSON.stringify(workflow.definition, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
