"use client";

import { useState, useMemo } from "react";
import { useJobs } from "@/hooks/use-jobs";
import {
  ExecutionRow,
  ExecutionRowSkeleton,
} from "@/components/features/execution-row";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
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
import { motion, Variants } from "framer-motion";
import Link from "next/link";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Status filter options
const statusFilters = [
  { value: "all", label: "All", icon: Activity },
  { value: "RUNNING", label: "Running", icon: Play },
  { value: "COMPLETED", label: "Completed", icon: CheckCircle },
  { value: "FAILED", label: "Failed", icon: XCircle },
  { value: "AWAITING_APPROVAL", label: "Pending", icon: Clock },
];

// Enhanced stat card matching landing page colors
function StatCard({
  label,
  value,
  icon: Icon,
  colorKey,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  colorKey: "blue" | "emerald" | "red" | "amber";
}) {
  const colors = {
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      glow: "0 4px 20px rgba(59, 130, 246, 0.4)",
      border: "border-blue-500/20 hover:border-blue-500/40",
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-500 to-green-500",
      glow: "0 4px 20px rgba(16, 185, 129, 0.4)",
      border: "border-emerald-500/20 hover:border-emerald-500/40",
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 to-rose-500",
      glow: "0 4px 20px rgba(239, 68, 68, 0.4)",
      border: "border-red-500/20 hover:border-red-500/40",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-500 to-orange-500",
      glow: "0 4px 20px rgba(245, 158, 11, 0.4)",
      border: "border-amber-500/20 hover:border-amber-500/40",
    },
  };

  const color = colors[colorKey];

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={`group overflow-hidden border ${color.border} hover:shadow-lg transition-all duration-300`}
      >
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={`p-3 rounded-xl ${color.bg} shadow-lg group-hover:scale-105 transition-transform duration-300`}
            style={{ boxShadow: color.glow }}
          >
            <Icon className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
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
            className="border-border/50 hover:border-primary/40"
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <StatCard
          label="Running"
          value={stats.running}
          icon={Play}
          colorKey="blue"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle}
          colorKey="emerald"
        />
        <StatCard
          label="Failed"
          value={stats.failed}
          icon={XCircle}
          colorKey="red"
        />
        <StatCard
          label="Pending Approval"
          value={stats.pending}
          icon={Clock}
          colorKey="amber"
        />
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search executions..."
            className="pl-10 border-border/50 focus:border-primary/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter Select */}
        <div className="flex items-center gap-2">
          <Filter
            className="h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] border-border/50">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  <span className="flex items-center gap-2">
                    <filter.icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {filter.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 rounded-xl border border-red-500/20 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-7 w-7 text-red-400" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold text-red-400">
            Failed to load jobs
          </h3>
          <p className="text-muted-foreground max-w-xs mt-1">
            Unable to sync with execution service.
          </p>
          <Button
            variant="outline"
            className="mt-6 border-red-500/30 hover:border-red-500/50"
            onClick={() => refetch()}
          >
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
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/50 rounded-xl bg-muted/5">
            <div className="h-14 w-14 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Activity
                className="h-7 w-7 text-muted-foreground"
                aria-hidden="true"
              />
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
