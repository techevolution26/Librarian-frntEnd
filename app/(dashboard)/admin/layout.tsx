import { requireAdmin } from "@/lib/admin-auth";
import AdminNavClient from "@/components/layout/AdminNavClient";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return (
        <div className="space-y-8">
            <section className="sticky top-4 z-20 overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/90 shadow-2xl backdrop-blur-xl">
                <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(248,113,113,0.18),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="inline-flex rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-red-100">
                                admin.console
                            </p>

                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                                BookBox
                            </h1>

                            <p className="mt-2 max-w-3xl text-sm leading-7 text-white/60">
                                Manage book uploads, PDF files, metadata, featured books,
                                visibility, archive state, and catalog operations.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 font-mono text-xs text-white/45">
                            <p>scope: catalog_admin</p>
                            <p>mode: protected</p>
                            <p>access: role.ADMIN</p>
                        </div>
                    </div>

                    <AdminNavClient />
                </div>
            </section>

            {children}
        </div>
    );
}