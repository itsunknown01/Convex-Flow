"use client";

import { useState, useMemo } from "react";
import { useAuditLogs } from "@/hooks/use-audit";
import { AuditLogTable } from "@/components/features/audit-log-table";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  Shield,
  RefreshCcw,
  Download,
  Search,
  FileText,
  CheckCircle,
  AlertTriangle,
  History,
  Lock,
} from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { motion, Variants } from "framer-motion";

// Animation variants
const statsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const statsItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Category filter options
const categoryFilters = [
  { value: "all", label: "All Events" },
  { value: "WORKFLOW", label: "Workflow" },
  { value: "APPROVAL", label: "Approval" },
  { value: "POLICY", label: "Policy" },
  { value: "SYSTEM", label: "System" },
];

// Enhanced stat card
function StatCard({
  label,
  value,
  icon: Icon,
  colorKey,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  colorKey: "blue" | "emerald" | "purple";
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
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-pink-500",
      glow: "0 4px 20px rgba(139, 92, 246, 0.4)",
      border: "border-purple-500/20 hover:border-purple-500/40",
    },
  };

  const color = colors[colorKey];

  return (
    <motion.div variants={statsItemVariants}>
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

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const {
    data: logs,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useAuditLogs();

  // Calculate stats
  const stats = useMemo(() => {
    if (!logs) return { total: 0, today: 0, approvals: 0 };
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    return {
      total: logs.length,
      today: logs.filter((l) => new Date(l.createdAt) >= todayDate).length,
      approvals: logs.filter((l) => l.eventType?.includes("APPROV")).length,
    };
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter((log) => {
      const matchesSearch =
        log.eventType?.toLowerCase().includes(search.toLowerCase()) ||
        log.data?.toLowerCase().includes(search.toLowerCase()) ||
        log.id?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        log.eventType?.toUpperCase().includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [logs, search, categoryFilter]);

  // Export logs as CSV
  const handleExportCSV = () => {
    if (!logs || logs.length === 0) return;

    const headers = ["ID", "Timestamp", "Event Type", "Data"];
    const rows = logs.map((l) => [
      l.id,
      new Date(l.createdAt).toISOString(),
      l.eventType,
      l.data,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

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
            Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Immutable, cryptographically signed ledger of all system activity.
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isLoading || !logs?.length}
            className="border-border/50 hover:border-primary/40"
          >
            <Download className="h-4 w-4 mr-2" aria-hidden="true" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={statsContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <StatCard
          label="Total Entries"
          value={stats.total}
          icon={FileText}
          colorKey="blue"
        />
        <StatCard
          label="Today"
          value={stats.today}
          icon={History}
          colorKey="emerald"
        />
        <StatCard
          label="Approvals"
          value={stats.approvals}
          icon={CheckCircle}
          colorKey="purple"
        />
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/5 p-5 border border-amber-500/20"
      >
        <div className="p-2 rounded-lg bg-amber-500/20">
          <Lock className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-amber-300">
            Cryptographic Integrity
          </p>
          <p className="text-amber-300/70 mt-1">
            Every entry is chained via SHA-256 hash. Any tampering invalidates
            the cryptographic chain.
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search logs..."
            className="pl-10 border-border/50 focus:border-primary/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1 flex-wrap">
          {categoryFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={categoryFilter === filter.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setCategoryFilter(filter.value)}
              className={`text-xs transition-all duration-200 ${
                categoryFilter === filter.value
                  ? "shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

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
            Failed to load the immutable ledger.
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

      {/* Logs Table */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : filteredLogs && filteredLogs.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AuditLogTable logs={filteredLogs} />
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/50 rounded-xl bg-muted/5">
          <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Shield
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            {search || categoryFilter !== "all"
              ? "No matching logs"
              : "No logs present"}
          </h3>
          <p className="text-muted-foreground max-w-xs mt-2">
            {search || categoryFilter !== "all"
              ? "Try adjusting your filters."
              : "Activity logs will appear here as workflows are executed."}
          </p>
        </div>
      )}
    </div>
  );
}
