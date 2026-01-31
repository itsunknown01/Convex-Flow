"use client";

import { useState, useMemo } from "react";
import { useJobs } from "@/hooks/use-jobs";
import {
  ExecutionRow,
  ExecutionRowSkeleton,
} from "@/components/features/execution-row";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  RefreshCcw,
  Activity,
  AlertCircle,
  Search,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
} from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { motion } from "framer-motion";
import Link from "next/link";

// Status filter options
const statusFilters = [
  { value: "all", label: "All", icon: Activity },
  { value: "RUNNING", label: "Running", icon: Play },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle },
  { value: "FAILED", label: "Failed", icon: XCircle },
  { value: "AWAITING_APPROVAL", label: "Pending", icon: Clock },
];

// Mini stat card
function StatCard({
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
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: executions,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useJobs();

  // Calculate stats
  const stats = useMemo(() => {
    if (!executions) return { running: 0, completed: 0, failed: 0, pending: 0 };
    return {
      running: executions.filter((e) => e.status === "RUNNING").length,
      completed: executions.filter((e) => e.status === "COMPLETED").length,
      failed: executions.filter((e) => e.status === "FAILED").length,
      pending: executions.filter((e) => e.status === "AWAITING_APPROVAL")
        .length,
    };
  }, [executions]);

  // Filter executions
  const filteredExecutions = useMemo(() => {
    if (!executions) return [];
    return executions.filter((ex) => {
      const matchesSearch =
        ex.workflowDefinition?.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        ex.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || ex.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [executions, search, statusFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Jobs
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor real-time workflow executions and status.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatCard
          label="Running"
          value={stats.running}
          icon={Play}
          color="bg-blue-500"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          label="Failed"
          value={stats.failed}
          icon={XCircle}
          color="bg-red-500"
        />
        <StatCard
          label="Pending Approval"
          value={stats.pending}
          icon={Clock}
          color="bg-amber-500"
        />
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search executions..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground mr-2" />
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={statusFilter === filter.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(filter.value)}
              className={`text-xs ${
                statusFilter === filter.value ? "" : "text-muted-foreground"
              }`}
            >
              <filter.icon className="h-3 w-3 mr-1" />
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 bg-destructive/5 rounded-xl border border-destructive/20 text-center px-4">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h3 className="text-lg font-semibold text-destructive">
            Failed to load jobs
          </h3>
          <p className="text-muted-foreground max-w-xs mt-1">
            Unable to sync with execution service.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Executions List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <ExecutionRowSkeleton key={i} />
          ))
        ) : filteredExecutions && filteredExecutions.length > 0 ? (
          filteredExecutions.map((execution, index) => (
            <motion.div
              key={execution.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ExecutionRow execution={execution} />
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              No executions found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              {search || statusFilter !== "all"
                ? "Try adjusting your filters."
                : "Run a workflow to see executions here."}
            </p>
            {!search && statusFilter === "all" && (
              <Button className="mt-6" asChild>
                <Link href="/workflows">View Workflows</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
