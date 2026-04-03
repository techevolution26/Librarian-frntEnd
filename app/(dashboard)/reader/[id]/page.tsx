import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBookById,
  getBookContent,
  getLibraryItemByBookId,
} from "@/lib/api";
import TextReader from "@/components/reader/TextReader";
import PdfReader from "@/components/reader/PdfReader";
import PdfReaderClientBridge from "@/components/reader/PdfReaderClientBridge";

interface ReaderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (!Number.isFinite(bookId)) {
    notFound();
  }

  try {
    const [book, content, libraryItem] = await Promise.all([
      getBookById(bookId),
      getBookContent(bookId),
      getLibraryItemByBookId(bookId),
    ]);

    return (
      <div className="mx-auto max-w-5xl space-y-6">
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
              <p className="mt-2 text-sm text-white/50">
                Source: {content.source_type}
              </p>
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
            <div
              className="h-full rounded-full bg-white/80"
              style={{ width: `${libraryItem?.progress ?? 0}%` }}
            />
          </div>
        </section>

        {content.source_type === "pdf" && content.source_url ? (
          <PdfReaderClientBridge
            bookId={book.id}
            fileUrl={content.source_url}
            title={book.title}
            initialPage={libraryItem?.current_page ?? 1}
            initialTotalPages={libraryItem?.total_pages ?? null}
            initialProgress={libraryItem?.progress ?? 0}
            initialBookmarkPage={libraryItem?.bookmark_page ?? null}
          />
        ) : (
          <TextReader
            content={
              content.content_text ||
              `${book.description}\n\nThis book does not have full text content yet.`
            }
          />
        )}

        {/* <section className="grid gap-4 sm:grid-cols-3">
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10">
            Previous chapter
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10">
            Bookmark page
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10">
            Next chapter
          </button>
        </section> */}
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      notFound();
    }

    throw error;
  }
}