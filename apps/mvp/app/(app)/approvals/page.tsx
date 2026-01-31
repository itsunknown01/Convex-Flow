"use client";

import { useMemo } from "react";
import { useApprovals } from "@/hooks/use-jobs";
import { ApprovalCard } from "@/components/features/approval-card";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  ShieldCheck,
  RefreshCcw,
  Info,
  AlertTriangle,
  Clock,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ApprovalsPage() {
  const {
    data: approvals,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useApprovals();

  // Calculate urgency
  const stats = useMemo(() => {
    if (!approvals) return { total: 0, urgent: 0, recent: 0 };
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return {
      total: approvals.length,
      urgent: approvals.filter((a) => {
        const created = new Date(a.createdAt);
        return now.getTime() - created.getTime() > 24 * 60 * 60 * 1000;
      }).length,
      recent: approvals.filter((a) => new Date(a.createdAt) > hourAgo).length,
    };
  }, [approvals]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Approvals
            </h1>
            {stats.total > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-600 rounded-full"
              >
                {stats.total} pending
              </motion.span>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            Review and authorize workflow steps requiring manual oversight.
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

      {/* Stats Cards */}
      {!isLoading && stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4"
        >
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-amber-500">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
                <p className="text-xs text-muted-foreground">Total Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.urgent > 0 ? "border-red-500/50" : ""}>
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={`p-2 rounded-lg ${stats.urgent > 0 ? "bg-red-500" : "bg-muted"}`}
              >
                <AlertTriangle
                  className={`h-4 w-4 ${stats.urgent > 0 ? "text-white" : "text-muted-foreground"}`}
                />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.urgent}
                </p>
                <p className="text-xs text-muted-foreground">Urgent (24h+)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="p-2 rounded-lg bg-blue-500">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.recent}
                </p>
                <p className="text-xs text-muted-foreground">New (1h)</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-3 rounded-xl bg-blue-500/5 p-4 border border-blue-500/10"
      >
        <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-500" />
        <div className="text-sm text-blue-700 dark:text-blue-400">
          <p className="font-medium">Human-in-the-Loop Governance</p>
          <p className="mt-1 opacity-80">
            Items are paused based on Policy Configurations or AI Uncertainty.
            Your decision will be logged to the immutable ledger.
          </p>
        </div>
      </motion.div>

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <p className="text-destructive font-medium">
            Failed to load the approval queue.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Approvals Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="h-[280px] rounded-xl border animate-pulse bg-muted/20"
            />
          ))
        ) : approvals && approvals.length > 0 ? (
          approvals.map((execution) => (
            <motion.div key={execution.id} variants={itemVariants}>
              <ApprovalCard execution={execution} />
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="col-span-full flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl bg-muted/10"
          >
            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
              <ShieldCheck className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Queue is empty
            </h3>
            <p className="text-muted-foreground max-w-xs mt-2">
              All workflow steps have been processed automatically or resolved.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
