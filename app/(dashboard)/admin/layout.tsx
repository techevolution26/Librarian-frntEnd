import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireAdmin();

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-red-500/5 p-6 shadow-xl">
                <p className="text-xs uppercase tracking-[0.24em] text-red-200/60">
                    Admin console
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                    BookBox Administration
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
                    Manage book uploads, PDF files, metadata, and catalog operations.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                        href="/admin"
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                    >
                        Overview
                    </Link>
                    <Link
                        href="/admin/books"
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
                    >
                        Books
                    </Link>
                    <Link
                        href="/admin/books/new"
                        className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                    >
                        Upload book
                    </Link>
                </div>
            </section>

            {children}
        </div>
    );
}