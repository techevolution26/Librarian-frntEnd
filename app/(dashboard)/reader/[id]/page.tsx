// app/(dashboard)/reader/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "@/lib/data";

interface ReaderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { id } = await params;
  const book = books.find((item) => item.id === id);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
              Reader mode
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {book.title}
            </h1>
            <p className="mt-2 text-sm text-white/65">by {book.author}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/book/${book.id}`}
              className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Back to details
            </Link>
          </div>
        </div>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[38%] rounded-full bg-white/80" />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="prose prose-invert max-w-none prose-p:leading-8 prose-p:text-white/78 prose-headings:text-white">
          <p>
            {book.description} This is the reader canvas where you can later
            wire in chapter navigation, font controls, bookmarks, and page
            progress persistence.
          </p>

          <p>
            Add your chapter content here, or connect this view to a backend or
            CMS once the UI is stable.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10">
          Previous chapter
        </button>
        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10">
          Bookmark page
        </button>
        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10">
          Next chapter
        </button>
      </section>
    </div>
  );
}