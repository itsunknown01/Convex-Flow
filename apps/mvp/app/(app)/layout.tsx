import { AppSidebar } from "@/components/common/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Separator } from "@workspace/ui/components/separator";

/**
 * App layout - includes sidebar for dashboard pages.
 * Uses shadcn/ui Sidebar with SidebarProvider for collapsible state management.
 * Includes slate-950 background with subtle blue/purple gradient accents.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with Sidebar Trigger */}
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">Dashboard</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Background gradients matching landing page */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Primary radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent_70%)] dark:bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)]" />
            {/* Secondary accent gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(139,92,246,0.05),transparent_70%)] dark:bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(139,92,246,0.1),transparent_70%)]" />
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </div>
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
