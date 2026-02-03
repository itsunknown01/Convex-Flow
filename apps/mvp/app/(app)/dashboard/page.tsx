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
  Sparkles,
} from "lucide-react";
import Link from "next/link";
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

// Color mapping for stat cards - matching landing page palette
const colorConfig = {
  blue: {
    bg: "bg-blue-500/10",
    bgHover: "hover:bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/20 hover:border-blue-500/40",
    glow: "hover:shadow-blue-500/10",
    gradient: "from-blue-500 to-cyan-500",
  },
  green: {
    bg: "bg-emerald-500/10",
    bgHover: "hover:bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    glow: "hover:shadow-emerald-500/10",
    gradient: "from-emerald-500 to-green-500",
  },
  purple: {
    bg: "bg-purple-500/10",
    bgHover: "hover:bg-purple-500/15",
    text: "text-purple-400",
    border: "border-purple-500/20 hover:border-purple-500/40",
    glow: "hover:shadow-purple-500/10",
    gradient: "from-purple-500 to-pink-500",
  },
  amber: {
    bg: "bg-amber-500/10",
    bgHover: "hover:bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/20 hover:border-amber-500/40",
    glow: "hover:shadow-amber-500/10",
    gradient: "from-amber-500 to-orange-500",
  },
};

type ColorKey = keyof typeof colorConfig;

// Stat card component with enhanced styling
function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  colorKey,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: { value: number; positive: boolean };
  colorKey: ColorKey;
}) {
  const colors = colorConfig[colorKey];

  return (
    <motion.div variants={itemVariants}>
      <Card
        className={`relative overflow-hidden transition-all duration-300 group border ${colors.border} ${colors.glow} hover:shadow-xl`}
      >
        {/* Gradient glow on hover */}
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br ${colors.gradient}`}
          style={{ opacity: 0.03 }}
          aria-hidden="true"
        />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={`p-2.5 rounded-xl ${colors.bg} ${colors.bgHover} transition-all duration-200`}
          >
            <Icon className={`h-4 w-4 ${colors.text}`} aria-hidden="true" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {trend && (
              <span
                className={`text-sm font-medium flex items-center gap-1 ${trend.positive ? "text-emerald-400" : "text-red-400"}`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${!trend.positive && "rotate-180"}`}
                  aria-hidden="true"
                />
                {trend.value}%
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>

        {/* Bottom accent bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          aria-hidden="true"
        />
      </Card>
    </motion.div>
  );
}

// Quick action card with enhanced hover
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
      <Card className="group cursor-pointer border-border/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
        <CardContent className="flex items-center gap-4 p-4 relative">
          {/* Hover glow */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden="true"
          />

          <div className="relative p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
            <Icon
              className="h-5 w-5 text-primary group-hover:text-primary"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1 min-w-0 relative">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {description}
            </p>
          </div>
          <ArrowRight
            className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
            aria-hidden="true"
          />
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
      {/* Welcome Header with gradient text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
            {user?.email ? (
              <span className="bg-gradient-to-r from-primary via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                , {user.email.split("@")[0]}
              </span>
            ) : (
              ""
            )}
          </h1>
          <Sparkles
            className="h-6 w-6 text-primary opacity-60"
            aria-hidden="true"
          />
        </div>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your AI workflow operations.
        </p>
      </motion.div>

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
          colorKey="blue"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Running"
          value={isLoading ? "..." : runningJobs}
          description="Currently executing"
          icon={Play}
          colorKey="green"
        />
        <StatCard
          title="Completed"
          value={isLoading ? "..." : completedJobs}
          description="Successfully finished"
          icon={CheckCircle}
          colorKey="purple"
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Pending Approvals"
          value={isLoading ? "..." : pendingApprovals}
          description="Awaiting review"
          icon={Clock}
          colorKey="amber"
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
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Quick Actions
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  3
                </span>
              </CardTitle>
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
          <Card className="border-border/50">
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
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer group"
                    >
                      <div
                        className={`p-2.5 rounded-xl transition-all duration-200 ${
                          job.status === "COMPLETED"
                            ? "bg-emerald-500/10 group-hover:bg-emerald-500/20"
                            : job.status === "RUNNING"
                              ? "bg-blue-500/10 group-hover:bg-blue-500/20"
                              : job.status === "FAILED"
                                ? "bg-red-500/10 group-hover:bg-red-500/20"
                                : "bg-amber-500/10 group-hover:bg-amber-500/20"
                        }`}
                      >
                        {job.status === "COMPLETED" ? (
                          <CheckCircle
                            className="h-4 w-4 text-emerald-400"
                            aria-hidden="true"
                          />
                        ) : job.status === "RUNNING" ? (
                          <Play
                            className="h-4 w-4 text-blue-400"
                            aria-hidden="true"
                          />
                        ) : job.status === "FAILED" ? (
                          <AlertCircle
                            className="h-4 w-4 text-red-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <Clock
                            className="h-4 w-4 text-amber-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {job.workflowDefinition?.title ||
                            `Execution ${job.id.slice(-6)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                          job.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : job.status === "RUNNING"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : job.status === "FAILED"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {job.status.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity
                    className="h-10 w-10 mx-auto mb-3 opacity-40"
                    aria-hidden="true"
                  />
                  <p className="text-sm">No recent activity</p>
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
