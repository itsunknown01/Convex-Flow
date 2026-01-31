import { AppSidebar } from "@/components/common/app-sidebar";

/**
 * App layout - includes sidebar for dashboard pages.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <div className="flex-none">
        <AppSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-64">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(var(--primary-rgb),0.13),transparent)] dark:bg-[radial-gradient(45%_40%_at_50%_60%,rgba(var(--primary-rgb),0.16),transparent)]" />
        <div className="p-6 md:p-8 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
