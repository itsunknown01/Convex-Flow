"use client";

import { useWorkflow } from "@/hooks/use-workflows";
import { useJobs, useRunWorkflow } from "@/hooks/use-jobs";
import { Button } from "@workspace/ui/components/button";
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
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function WorkflowDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

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
      // Optional: Show toast or redirect
    } catch (error) {
      console.error("Failed to run workflow:", error);
    } finally {
      setIsRunning(false);
    }
  };

  if (isWorkflowLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !workflow) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h3 className="text-lg font-semibold">Workflow not found</h3>
        <p className="text-muted-foreground mt-2">
          The requested workflow definition could not be loaded.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/workflows">Back to Workflows</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Link
              href="/workflows"
              className="hover:text-foreground transition-colors flex items-center gap-1 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
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
          <Button onClick={handleRun} disabled={isRunning}>
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run Workflow
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Recent Executions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Executions</CardTitle>
              <CardDescription>
                History of recent runs for this workflow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isExecutionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading executions...
                </div>
              ) : !workflowExecutions?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  No executions found yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {workflowExecutions.map((exec) => (
                    <div
                      key={exec.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            exec.status === "COMPLETED"
                              ? "bg-green-500"
                              : exec.status === "FAILED"
                                ? "bg-red-500"
                                : exec.status === "RUNNING"
                                  ? "bg-blue-500 animate-pulse"
                                  : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-sm">
                            Run #{exec.id.slice(-6)}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            {new Date(exec.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {exec.status.replace("_", " ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  ID
                </div>
                <div className="text-sm font-mono bg-muted/50 p-2 rounded break-all">
                  {workflow.id}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Version
                </div>
                <div className="text-sm">v{workflow.version}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Created
                </div>
                <div className="text-sm flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {new Date(workflow.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Last Updated
                </div>
                <div className="text-sm flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {new Date(workflow.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Definition Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="h-4 w-4" />
                Definition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-[300px]">
                {JSON.stringify(workflow.definition, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
