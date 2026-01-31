"use client";

import { useState, useMemo } from "react";
import { useWorkflows } from "@/hooks/use-workflows";
import {
  WorkflowCard,
  WorkflowCardSkeleton,
} from "@/components/features/workflow-card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Plus,
  RefreshCcw,
  AlertCircle,
  Download,
  Search,
  Grid3X3,
  List,
  Workflow,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mini stat card for the summary
function MiniStat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/50">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export default function WorkflowsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: workflows,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useWorkflows();

  // Filter workflows based on search
  const filteredWorkflows = useMemo(() => {
    if (!workflows) return [];
    if (!searchQuery.trim()) return workflows;

    const query = searchQuery.toLowerCase();
    return workflows.filter(
      (w) =>
        w.title.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query),
    );
  }, [workflows, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    if (!workflows) return { total: 0, active: 0, recent: 0 };
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      total: workflows.length,
      active: workflows.length, // All are considered active
      recent: workflows.filter((w) => new Date(w.createdAt) > weekAgo).length,
    };
  }, [workflows]);

  // Export workflows as CSV
  const handleExportCSV = () => {
    if (!workflows || workflows.length === 0) return;

    const headers = [
      "ID",
      "Title",
      "Description",
      "Version",
      "Created At",
      "Updated At",
    ];
    const rows = workflows.map((w) => [
      w.id,
      w.title,
      w.description || "",
      w.version.toString(),
      new Date(w.createdAt).toLocaleString(),
      new Date(w.updatedAt).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `workflows_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Workflows
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your automated processes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isLoading || !workflows?.length}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button size="sm" asChild>
            <Link href="/workflows/new">
              <Plus className="h-4 w-4 mr-2" />
              New Workflow
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <MiniStat
          label="Total Workflows"
          value={stats.total}
          icon={Workflow}
          color="bg-blue-500"
        />
        <MiniStat
          label="Active"
          value={stats.active}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <MiniStat
          label="Created This Week"
          value={stats.recent}
          icon={Clock}
          color="bg-purple-500"
        />
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="px-3"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 bg-destructive/5 rounded-xl border border-destructive/20 text-center px-4">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-destructive">
            Failed to load workflows
          </h3>
          <p className="text-muted-foreground max-w-xs mt-1">
            There was an error connecting to the service. Please check your
            connection and try again.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && workflows?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-muted/30 rounded-xl border border-dashed text-center px-4">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            No workflows found
          </h3>
          <p className="text-muted-foreground max-w-xs mt-2">
            Get started by creating your first workflow definition.
          </p>
          <Button className="mt-8" asChild>
            <Link href="/workflows/new">Create First Workflow</Link>
          </Button>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading &&
        !isError &&
        workflows &&
        workflows.length > 0 &&
        filteredWorkflows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              No results found
            </h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search query.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          </div>
        )}

      {/* Workflows Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <WorkflowCardSkeleton key={i} />
            ))
          : filteredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
      </div>
    </div>
  );
}
