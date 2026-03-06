"use client";

import { useAuthStore } from "@/store/use-auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import {
  User,
  Building2,
  Shield,
  Bell,
  Key,
  LogOut,
  Copy,
  Check,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } },
};

function SettingRow({
  label,
  value,
  hint,
  action,
}: {
  label: string;
  value: string;
  hint?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground truncate">{value}</p>
        {hint && <p className="text-xs text-muted-foreground/60 mt-0.5">{hint}</p>}
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </Button>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const tenantId = useAuthStore((s) => s.tenantId);

  const username = user?.email?.split("@")[0] ?? "User";
  const avatarLetter = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and workspace preferences.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Profile */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>Your personal account details.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Avatar + name row */}
              <div className="flex items-center gap-4 mb-4 p-4 rounded-xl bg-muted/40 border border-border/40">
                <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 text-white text-xl font-bold shrink-0">
                  {avatarLetter}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{username}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email ?? "—"}</p>
                  {user?.role && (
                    <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {user.role}
                    </span>
                  )}
                </div>
              </div>

              <Separator className="my-1" />

              <SettingRow
                label="User ID"
                value={user?.id ?? "—"}
                hint="Your unique identifier"
                action={user?.id ? <CopyButton text={user.id} /> : undefined}
              />
              <Separator />
              <SettingRow
                label="Email address"
                value={user?.email ?? "—"}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Workspace */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4 text-purple-400" />
                Workspace
              </CardTitle>
              <CardDescription>Details about your current tenant workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingRow
                label="Tenant ID"
                value={tenantId ?? "No workspace assigned"}
                hint="Identifies your organisation's workspace"
                action={tenantId ? <CopyButton text={tenantId} /> : undefined}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Security */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4 text-emerald-400" />
                Security
              </CardTitle>
              <CardDescription>Authentication and session security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              <SettingRow
                label="Session"
                value="Active"
                hint="Your session is secured via HTTP-only cookie"
                action={
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                }
              />
              <Separator />
              <SettingRow
                label="Authentication"
                value="Email & Password"
                action={
                  <Button variant="outline" size="sm" className="h-8 gap-1.5" disabled>
                    <Key className="h-3.5 w-3.5" />
                    Change password
                  </Button>
                }
              />
              <Separator />
              <SettingRow
                label="Two-factor authentication"
                value="Not configured"
                action={
                  <Button variant="outline" size="sm" className="h-8" disabled>
                    Enable 2FA
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications placeholder */}
        <motion.div variants={itemVariants}>
          <Card className="border-border/50 opacity-60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Bell className="h-4 w-4 text-amber-400" />
                Notifications
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                  Coming soon
                </span>
              </CardTitle>
              <CardDescription>Control how and when you receive alerts.</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Danger zone */}
        <motion.div variants={itemVariants}>
          <Card className="border-red-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-red-400">
                <LogOut className="h-4 w-4" />
                Session
              </CardTitle>
              <CardDescription>Sign out of your account on this device.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                size="sm"
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40"
                onClick={async () => {
                  const { logout } = await import("@/actions/auth");
                  await logout();
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
