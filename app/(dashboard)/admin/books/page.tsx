import Link from "next/link";
import { adminListBooks } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";


export default async function AdminBooksPage() {
  const token = await requireAccessToken("/admin/books");
  const books = await adminListBooks(token);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Books</h2>
          <p className="mt-1 text-sm text-white/55">
            Manage catalog metadata, PDF files, visibility, and featured status.
          </p>
        </div>

        <Link
          href="/admin/books/new"
          className="w-fit rounded-xl bg-white px-5 py-3 text-sm font-medium text-black"
        >
          Upload PDF book
        </Link>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
        <div className="hidden grid-cols-[80px_1fr_160px_160px_120px] border-b border-white/10 px-5 py-3 text-xs uppercase tracking-[0.16em] text-white/45 md:grid">
          <span>ID</span>
          <span>Title</span>
          <span>Author</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="divide-y divide-white/10">
          {books.map((book) => (
            <div
              key={book.id}
              className="grid gap-3 px-5 py-4 md:grid-cols-[80px_1fr_160px_160px_120px] md:items-center"
            >
              <p className="text-sm text-white/50">#{book.id}</p>

              <div>
                <p className="font-medium text-white">{book.title}</p>
                <p className="text-sm text-white/50">
                  {book.genre?.join(", ") || "No genres"}
                </p>
              </div>

              <p className="text-sm text-white/65">{book.author}</p>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60">
                  {book.visibility ?? "published"}
                </span>

                {book.is_featured ? (
                  <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-1 text-xs text-yellow-100">
                    Featured
                  </span>
                ) : null}

                {book.archived_at ? (
                  <span className="rounded-full border border-red-400/20 bg-red-500/10 px-2 py-1 text-xs text-red-100">
                    Archived
                  </span>
                ) : null}
              </div>

              <Link
                href={`/admin/books/${book.id}/edit`}
                className="w-fit rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Manage
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}