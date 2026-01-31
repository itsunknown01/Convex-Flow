"use client";

import { useWorkflows } from "@/hooks/use-workflows";
import { useJobs } from "@/hooks/use-jobs";
import { useAuditLogs } from "@/hooks/use-audit";
import { useAuthStore } from "@/store/use-auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Workflow,
  Play,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
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

// Stat card component
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  color: string;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="relative overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={`p-2 rounded-lg ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}
          >
            <Icon className={`h-4 w-4 ${color.replace("bg-", "text-")}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {trend && (
              <span
                className={`text-sm font-medium flex items-center gap-1 ${trend.positive ? "text-green-500" : "text-red-500"}`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${!trend.positive && "rotate-180"}`}
                />
                {trend.value}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
        {/* Decorative gradient */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${color} opacity-0 group-hover:opacity-100 transition-opacity`}
        />
      </Card>
    </motion.div>
  );
}

// Quick action card
function QuickAction({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <Link href={href}>
      <Card className="group cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { data: workflows, isLoading: workflowsLoading } = useWorkflows();
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: auditLogs } = useAuditLogs();

  // Calculate stats
  const totalWorkflows = workflows?.length ?? 0;
  const runningJobs = jobs?.filter((j) => j.status === "RUNNING").length ?? 0;
  const completedJobs =
    jobs?.filter((j) => j.status === "COMPLETED").length ?? 0;
  const pendingApprovals =
    jobs?.filter((j) => j.status === "AWAITING_APPROVAL").length ?? 0;

  const isLoading = workflowsLoading || jobsLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your AI workflow operations.
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          title="Total Workflows"
          value={isLoading ? "..." : totalWorkflows}
          description="Active workflow definitions"
          icon={Workflow}
          color="bg-blue-500"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Running"
          value={isLoading ? "..." : runningJobs}
          description="Currently executing"
          icon={Play}
          color="bg-green-500"
        />
        <StatCard
          title="Completed"
          value={isLoading ? "..." : completedJobs}
          description="Successfully finished"
          icon={CheckCircle}
          color="bg-emerald-500"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Pending Approvals"
          value={isLoading ? "..." : pendingApprovals}
          description="Awaiting review"
          icon={Clock}
          color="bg-amber-500"
        />
      </motion.div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks at your fingertips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <QuickAction
                title="Create Workflow"
                description="Design a new AI workflow"
                href="/workflows/new"
                icon={Plus}
              />
              <QuickAction
                title="View Executions"
                description="Monitor running jobs"
                href="/jobs"
                icon={Activity}
              />
              <QuickAction
                title="Review Approvals"
                description={`${pendingApprovals} pending`}
                href="/approvals"
                icon={Shield}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest workflow executions</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/jobs">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 animate-pulse"
                    >
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/3 bg-muted rounded" />
                        <div className="h-3 w-1/2 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs && jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full ${
                          job.status === "COMPLETED"
                            ? "bg-green-500/10"
                            : job.status === "RUNNING"
                              ? "bg-blue-500/10"
                              : job.status === "FAILED"
                                ? "bg-red-500/10"
                                : "bg-amber-500/10"
                        }`}
                      >
                        {job.status === "COMPLETED" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : job.status === "RUNNING" ? (
                          <Play className="h-4 w-4 text-blue-500" />
                        ) : job.status === "FAILED" ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {job.workflowDefinition?.title ||
                            `Execution ${job.id.slice(-6)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          job.status === "COMPLETED"
                            ? "bg-green-500/10 text-green-600"
                            : job.status === "RUNNING"
                              ? "bg-blue-500/10 text-blue-600"
                              : job.status === "FAILED"
                                ? "bg-red-500/10 text-red-600"
                                : "bg-amber-500/10 text-amber-600"
                        }`}
                      >
                        {job.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link href="/workflows/new">Run your first workflow</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
