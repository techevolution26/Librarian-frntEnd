import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function Layout({ children }: any) {
  return (
    <div className="flex h-screen bg-neutral-950 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}