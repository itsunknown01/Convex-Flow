"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  FileCheck,
  ShieldAlert,
  Home,
  LogOut,
  User,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@workspace/ui/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Badge } from "@workspace/ui/components/badge";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Workflows",
    href: "/workflows",
    icon: LayoutDashboard,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: Activity,
  },
  {
    name: "Approvals",
    href: "/approvals",
    icon: FileCheck,
    badge: 3,
  },
  {
    name: "Audit",
    href: "/audit",
    icon: ShieldAlert,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  // Hide sidebar on /login page
  if (pathname === "/login") {
    return null;
  }

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 28 28"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0 drop-shadow-md"
                >
                  <path
                    d="M 14 0 L 26.12 7 L 26.12 21 L 14 28 L 1.88 21 L 1.88 7 Z"
                    fill="url(#sidebar-logo-grad)"
                  />
                  <path
                    d="M 14 5.5 L 21.36 9.75 L 21.36 18.25 L 14 22.5 L 6.64 18.25 L 6.64 9.75 Z"
                    fill="#0f172a"
                  />
                  <circle cx="14" cy="14" r="2.5" fill="#f8fafc" />
                  <circle cx="14" cy="5.5" r="1.5" fill="#f8fafc" />
                  <circle cx="6.64" cy="18.25" r="1.5" fill="#f8fafc" />
                  <circle cx="21.36" cy="18.25" r="1.5" fill="#f8fafc" />
                  <path
                    d="M 14 11.5 L 14 7"
                    stroke="#f8fafc"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 12 15 L 8 17.5"
                    stroke="#f8fafc"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 16 15 L 20 17.5"
                    stroke="#f8fafc"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="sidebar-logo-grad"
                      x1="0"
                      y1="28"
                      x2="28"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#2563eb" />
                      <stop offset="1" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Convex Flow</span>
                  <span className="text-xs text-muted-foreground">
                    AI Orchestration
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        <item.icon aria-hidden="true" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>
                        <Badge variant="warning" className="h-5 min-w-5 px-1">
                          {item.badge}
                        </Badge>
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* System Status */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              </div>
              <span className="text-emerald-400 text-xs font-medium group-data-[collapsible=icon]:hidden">
                All Systems Operational
              </span>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Menu */}
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 text-white text-sm font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none text-left">
                    <span className="truncate font-semibold">
                      {user?.email?.split("@")[0] || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4" aria-hidden="true" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <User className="size-4" aria-hidden="true" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-400 focus:text-red-400"
                  onSelect={async () => {
                    const { logout } = await import("@/actions/auth");
                    await logout();
                  }}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
