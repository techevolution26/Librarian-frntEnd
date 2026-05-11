import Link from "next/link";
import { adminListBooks } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";

export default async function AdminPage() {
    const token = await requireAccessToken("/admin");

    const result = await adminListBooks(token, {
        page: 1,
        limit: 100,
        status: "all",
        visibility: "all",
    });

    const books = result.items;

    const pdfBooks = books.filter((book) => book.source_type === "pdf");
    const textBooks = books.filter((book) => book.source_type === "text");
    const draftBooks = books.filter((book) => book.visibility === "draft");
    const archivedBooks = books.filter((book) => Boolean(book.archived_at));
    const featuredBooks = books.filter((book) => book.is_featured);

    return (
        <div className="w-full space-y-6 pb-24 sm:pb-12">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/80 shadow-2xl">
                <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-100">
                                admin.overview
                            </p>

                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                                Catalog command center
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                                Snapshot of catalog health, upload formats, draft queue,
                                archived books, and homepage featured placement.
                            </p>
                        </div>

                        <Link
                            href="/admin/books/new"
                            className="w-fit rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                        >
                            Upload PDF book
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <AdminMetricCard
                    label="Catalog"
                    value={String(result.total)}
                    hint="Books in catalog"
                    code="books.total"
                />

                <AdminMetricCard
                    label="Uploads"
                    value={String(pdfBooks.length)}
                    hint="PDF-backed books"
                    code="books.source.pdf"
                />

                <AdminMetricCard
                    label="Text"
                    value={String(textBooks.length)}
                    hint="Text-backed books"
                    code="books.source.text"
                />
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <AdminMetricLink
                    href="/admin/books?visibility=draft"
                    label="Drafts"
                    value={String(draftBooks.length)}
                    hint="Books not public yet"
                    code="visibility.draft"
                />

                <AdminMetricLink
                    href="/admin/books?status=archived"
                    label="Archived"
                    value={String(archivedBooks.length)}
                    hint="Hidden from public catalog"
                    code="status.archived"
                    tone="danger"
                />

                <AdminMetricLink
                    href="/admin/books?status=active"
                    label="Featured"
                    value={String(featuredBooks.length)}
                    hint="Homepage featured books"
                    code="placement.featured"
                    tone="featured"
                />
            </section>
        </div>
    );
}

function AdminMetricCard({
    label,
    value,
    hint,
    code,
}: {
    label: string;
    value: string;
    hint: string;
    code: string;
}) {
    return (
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/35">
                        {code}
                    </p>
                    <p className="mt-3 text-sm font-medium text-white/55">{label}</p>
                </div>

                <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 font-mono text-[10px] text-white/35">
                    metric
                </span>
            </div>

            <p className="mt-4 font-mono text-4xl font-semibold text-white">
                {value}
            </p>

            <p className="mt-2 text-sm text-white/50">{hint}</p>
        </div>
    );
}

function AdminMetricLink({
    href,
    label,
    value,
    hint,
    code,
    tone = "default",
}: {
    href: string;
    label: string;
    value: string;
    hint: string;
    code: string;
    tone?: "default" | "danger" | "featured";
}) {
    const valueClass =
        tone === "danger"
            ? "text-red-100"
            : tone === "featured"
                ? "text-yellow-100"
                : "text-cyan-100";

    const badgeClass =
        tone === "danger"
            ? "border-red-400/20 bg-red-500/10 text-red-100"
            : tone === "featured"
                ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-100"
                : "border-cyan-400/20 bg-cyan-500/10 text-cyan-100";

    return (
        <Link
            href={href}
            className="group rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-xl transition hover:border-white/20 hover:bg-white/[0.07]"
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/35">
                        {code}
                    </p>
                    <p className="mt-3 text-sm font-medium text-white/55">{label}</p>
                </div>

                <span
                    className={[
                        "rounded-full border px-2 py-1 font-mono text-[10px]",
                        badgeClass,
                    ].join(" ")}
                >
                    open
                </span>
            </div>

            <p className={`mt-4 font-mono text-4xl font-semibold ${valueClass}`}>
                {value}
            </p>

            <p className="mt-2 text-sm text-white/50">{hint}</p>

            <p className="mt-4 font-mono text-xs text-white/30 transition group-hover:text-white/50">
                route: {href}
            </p>
        </Link>
    );
}