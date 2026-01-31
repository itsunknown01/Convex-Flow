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
import { motion } from "framer-motion";

// Category filter options
const categoryFilters = [
  { value: "all", label: "All Events" },
  { value: "WORKFLOW", label: "Workflow" },
  { value: "APPROVAL", label: "Approval" },
  { value: "POLICY", label: "Policy" },
  { value: "SYSTEM", label: "System" },
];

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: logs.length,
      today: logs.filter((l) => new Date(l.timestamp) >= today).length,
      approvals: logs.filter((l) => l.action?.includes("APPROV")).length,
    };
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    return logs.filter((log) => {
      const matchesSearch =
        log.action?.toLowerCase().includes(search.toLowerCase()) ||
        log.userId?.toLowerCase().includes(search.toLowerCase()) ||
        log.id?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" ||
        log.action?.toUpperCase().includes(categoryFilter);
      return matchesSearch && matchesCategory;
    });
  }, [logs, search, categoryFilter]);

  // Export logs as CSV
  const handleExportCSV = () => {
    if (!logs || logs.length === 0) return;

    const headers = ["ID", "Timestamp", "Action", "User ID", "Details"];
    const rows = logs.map((l) => [
      l.id,
      new Date(l.timestamp).toISOString(),
      l.action,
      l.userId || "",
      JSON.stringify(l.metadata || {}),
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
          >
            <RefreshCcw
              className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={isLoading || !logs?.length}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-blue-500">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.total}
              </p>
              <p className="text-xs text-muted-foreground">Total Entries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-green-500">
              <History className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.today}
              </p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-lg bg-purple-500">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats.approvals}
              </p>
              <p className="text-xs text-muted-foreground">Approvals</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-3 rounded-xl bg-orange-500/5 p-4 border border-orange-500/10"
      >
        <Lock className="h-5 w-5 mt-0.5 flex-shrink-0 text-orange-500" />
        <div className="text-sm">
          <p className="font-semibold text-orange-700 dark:text-orange-400">
            Cryptographic Integrity
          </p>
          <p className="text-orange-600/80 dark:text-orange-400/80 mt-1">
            Every entry is chained via SHA-256 hash. Any tampering invalidates
            the cryptographic chain.
          </p>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            className="pl-10"
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
              className={`text-xs ${
                categoryFilter === filter.value ? "" : "text-muted-foreground"
              }`}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">
            Failed to load the immutable ledger.
          </p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Logs Table */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
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
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-xl bg-muted/10">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-muted-foreground" />
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
