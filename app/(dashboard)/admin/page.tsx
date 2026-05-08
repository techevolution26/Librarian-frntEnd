import { getBooks } from "@/lib/api";

export default async function AdminPage() {
    const books = await getBooks();

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Catalog
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">{books.length}</p>
                <p className="mt-1 text-sm text-white/55">Books in catalog</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Uploads
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {books.filter((book) => book.source_type === "pdf").length}
                </p>
                <p className="mt-1 text-sm text-white/55">PDF-backed books</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    Text
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                    {books.filter((book) => book.source_type === "text").length}
                </p>
                <p className="mt-1 text-sm text-white/55">Text-backed books</p>
            </div>
        </div>
    );
}