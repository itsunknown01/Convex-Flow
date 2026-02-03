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
  Sparkles,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

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
  colorKey: "amber" | "red" | "blue";
}) {
  const colors = {
    amber: {
      bg: "bg-gradient-to-br from-amber-500 to-orange-500",
      glow: "0 4px 20px rgba(245, 158, 11, 0.4)",
      border: "border-amber-500/20 hover:border-amber-500/40",
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 to-rose-500",
      glow: "0 4px 20px rgba(239, 68, 68, 0.4)",
      border: "border-red-500/20 hover:border-red-500/40",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      glow: "0 4px 20px rgba(59, 130, 246, 0.4)",
      border: "border-blue-500/20 hover:border-blue-500/40",
    },
  };

  const color = colors[colorKey];

  return (
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
  );
}

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Approvals
            </h1>
            {stats.total > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-500/15 text-amber-400 rounded-full border border-amber-500/20"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-2 animate-pulse" />
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

      {/* Stats Cards */}
      {!isLoading && stats.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <StatCard
            label="Total Pending"
            value={stats.total}
            icon={Clock}
            colorKey="amber"
          />
          <StatCard
            label="Urgent (24h+)"
            value={stats.urgent}
            icon={AlertTriangle}
            colorKey="red"
          />
          <StatCard
            label="New (1h)"
            value={stats.recent}
            icon={Shield}
            colorKey="blue"
          />
        </motion.div>
      )}

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/5 p-5 border border-blue-500/20"
      >
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-blue-300">
            Human-in-the-Loop Governance
          </p>
          <p className="mt-1 text-blue-300/70">
            Items are paused based on Policy Configurations or AI Uncertainty.
            Your decision will be logged to the immutable ledger.
          </p>
        </div>
      </motion.div>

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle
              className="h-7 w-7 text-red-400"
              aria-hidden="true"
            />
          </div>
          <p className="text-red-400 font-medium">
            Failed to load the approval queue.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-red-500/30 hover:border-red-500/50"
            onClick={() => refetch()}
          >
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
              className="h-[280px] rounded-xl border border-border/50 animate-pulse bg-muted/10"
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
            className="col-span-full flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/50 rounded-xl bg-gradient-to-b from-emerald-500/5 to-transparent"
          >
            <div className="h-20 w-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30">
              <ShieldCheck
                className="h-10 w-10 text-emerald-400"
                aria-hidden="true"
              />
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
