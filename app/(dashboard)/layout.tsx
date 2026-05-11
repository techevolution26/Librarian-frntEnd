import type { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { getSidebarSummary } from "@/lib/api";
import { getAccessToken } from "@/lib/server-auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: DashboardLayoutProps) {
  const token = await getAccessToken();

  const sidebarSummary = token
    ? await getSidebarSummary(token).catch(() => null)
    : null;
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar sidebarSummary={sidebarSummary} />

          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}