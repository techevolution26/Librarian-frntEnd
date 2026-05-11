import Link from "next/link";
import { adminListBooks, type AdminListBooksParams } from "@/lib/api";
import { requireAccessToken } from "@/lib/server-auth";

interface AdminBooksPageProps {
  searchParams?: Promise<{
    q?: string;
    visibility?: AdminListBooksParams["visibility"];
    status?: AdminListBooksParams["status"];
    page?: string;
  }>;
}

function buildAdminBooksHref(params: {
  q?: string;
  visibility?: string;
  status?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.visibility && params.visibility !== "all") {
    searchParams.set("visibility", params.visibility);
  }
  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }
  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const query = searchParams.toString();
  return query ? `/admin/books?${query}` : "/admin/books";
}

export default async function AdminBooksPage({
  searchParams,
}: AdminBooksPageProps) {
  const params = searchParams ? await searchParams : {};

  const q = params.q ?? "";
  const rawVisibility = params.visibility ?? "all";
  const rawStatus = params.status ?? "all";

  const visibility: AdminListBooksParams["visibility"] =
    rawVisibility === "published" || rawVisibility === "draft"
      ? rawVisibility
      : "all";

  const status: AdminListBooksParams["status"] =
    rawStatus === "active" || rawStatus === "archived"
      ? rawStatus
      : "all";


  const page = Number(params.page ?? "1");

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;

  const token = await requireAccessToken("/admin/books");

  const result = await adminListBooks(token, {
    q,
    visibility,
    status,
    page: safePage,
    limit: 12,
  });

  const books = Array.isArray(result.items) ? result.items : [];

  function getPaginationWindow(current: number, total: number): number[] {
    const pages = new Set<number>();

    pages.add(1);
    pages.add(total);

    for (let page = current - 2; page <= current + 2; page += 1) {
      if (page >= 1 && page <= total) {
        pages.add(page);
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  }

  return (
    <div className="w-full space-y-6 pb-24 sm:pb-12">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/80 shadow-2xl">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-100">
                admin.catalog.index
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                Books
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                Search, filter, and manage catalog metadata, PDF files,
                publication state, archive status, and featured placement.
              </p>
            </div>

            <Link
              href="/admin/books/new"
              className="w-fit rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Upload PDF book
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CatalogMetric label="Showing" value={String(books.length)} />
            <CatalogMetric label="Total" value={String(result.total)} />
            <CatalogMetric label="Page" value={`${result.page}/${result.pages}`} />
            <CatalogMetric
              label="Filters"
              value={q || visibility !== "all" || status !== "all" ? "active" : "none"}
              tone={q || visibility !== "all" || status !== "all" ? "active" : "default"}
            />
          </div>
        </div>
      </section>

      <form
        action="/admin/books"
        className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl"
      >
        <input type="hidden" name="page" value="1" />

        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_120px]">
          <div className="relative">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search by title, author, description..."
              className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-black/35"
            />

            {q ? (
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-cyan-100/50">
                q
              </span>
            ) : null}
          </div>

          <select
            name="visibility"
            defaultValue={visibility}
            className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
          >
            <option value="all" className="bg-neutral-900 text-white">
              All visibility
            </option>
            <option value="published" className="bg-neutral-900 text-white">
              Published
            </option>
            <option value="draft" className="bg-neutral-900 text-white">
              Draft
            </option>
          </select>

          <select
            name="status"
            defaultValue={status}
            className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
          >
            <option value="all" className="bg-neutral-900 text-white">
              All status
            </option>
            <option value="active" className="bg-neutral-900 text-white">
              Active
            </option>
            <option value="archived" className="bg-neutral-900 text-white">
              Archived
            </option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Search
          </button>
        </div>

        {q || visibility !== "all" || status !== "all" ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {q ? (
              <FilterChip label="query" value={q} />
            ) : null}

            {visibility !== "all" ? (
              <FilterChip label="visibility" value={visibility} />
            ) : null}

            {status !== "all" ? (
              <FilterChip label="status" value={status} />
            ) : null}

            <Link
              href="/admin/books"
              className="ml-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Clear filters
            </Link>
          </div>
        ) : null}
      </form>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/80 shadow-2xl">
        <div className="hidden grid-cols-[80px_1fr_160px_180px_120px] border-b border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white/40 md:grid">
          <span>ID</span>
          <span>Title</span>
          <span>Author</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        <div className="divide-y divide-white/10">
          {books.length > 0 ? (
            books.map((book) => (
              <article
                key={book.id}
                className="group grid gap-4 px-5 py-5 transition hover:bg-white/[0.03] md:grid-cols-[80px_1fr_160px_180px_120px] md:items-center"
              >
                <p className="font-mono text-sm text-white/40">#{book.id}</p>

                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {book.title}
                  </p>

                  <p className="mt-1 truncate text-sm text-white/45">
                    {book.genre?.join(", ") || "No genres"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 md:hidden">
                    <BookStatusBadges book={book} />
                  </div>
                </div>

                <p className="text-sm text-white/65">{book.author}</p>

                <div className="hidden flex-wrap gap-2 md:flex">
                  <BookStatusBadges book={book} />
                </div>

                <Link
                  href={`/admin/books/${book.id}/edit`}
                  className="w-fit rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
                >
                  Manage
                </Link>
              </article>
            ))
          ) : (
            <div className="p-10">
              <div className="mx-auto max-w-lg rounded-[2rem] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/35">
                  query.empty
                </p>

                <h3 className="mt-3 text-xl font-semibold text-white">
                  No books matched your search
                </h3>

                <p className="mt-2 text-sm leading-7 text-white/55">
                  Try changing the search phrase, visibility filter, or archive
                  status.
                </p>

                <Link
                  href="/admin/books"
                  className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
                >
                  Reset catalog view
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={buildAdminBooksHref({
            q,
            visibility,
            status,
            page: Math.max(result.page - 1, 1),
          })}
          aria-disabled={result.page <= 1}
          className={[
            "rounded-xl border border-white/10 px-4 py-2 text-sm transition",
            result.page <= 1
              ? "pointer-events-none bg-white/[0.02] text-white/30"
              : "bg-white/5 text-white/80 hover:bg-white/10",
          ].join(" ")}
        >
          Previous
        </Link>

        <div className="flex flex-wrap justify-center gap-2">
          {getPaginationWindow(result.page, result.pages).map(
            (pageNumber, index, arr) => {
              const previous = arr[index - 1];
              const showGap = previous && pageNumber - previous > 1;
              const active = pageNumber === result.page;

              return (
                <div key={pageNumber} className="flex items-center gap-2">
                  {showGap ? (
                    <span className="text-sm text-white/40">…</span>
                  ) : null}

                  <Link
                    href={buildAdminBooksHref({
                      q,
                      visibility,
                      status,
                      page: pageNumber,
                    })}
                    className={[
                      "flex h-9 w-9 items-center justify-center rounded-xl border font-mono text-sm transition",
                      active
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                    ].join(" ")}
                  >
                    {pageNumber}
                  </Link>
                </div>
              );
            },
          )}
        </div>

        <Link
          href={buildAdminBooksHref({
            q,
            visibility,
            status,
            page: Math.min(result.page + 1, result.pages),
          })}
          aria-disabled={result.page >= result.pages}
          className={[
            "rounded-xl border border-white/10 px-4 py-2 text-sm transition",
            result.page >= result.pages
              ? "pointer-events-none bg-white/[0.02] text-white/30"
              : "bg-white/5 text-white/80 hover:bg-white/10",
          ].join(" ")}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

function CatalogMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "active";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <p
        className={[
          "mt-2 truncate font-mono text-xl font-semibold",
          tone === "active" ? "text-cyan-100" : "text-white",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function FilterChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-100">
      {label}:{value}
    </span>
  );
}

function BookStatusBadges({
  book,
}: {
  book: {
    visibility?: string | null;
    archived_at?: string | null;
    is_featured?: boolean;
  };
}) {
  return (
    <>
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
    </>
  );
}