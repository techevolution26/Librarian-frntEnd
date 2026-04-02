import Image from "next/image";
import { notFound } from "next/navigation";
import { getBookById } from "@/lib/api";
import BookActions from "@/components/book/BookActions";

interface BookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (!Number.isFinite(bookId)) {
    notFound();
  }

  try {
    const book = await getBookById(bookId);

    return (
      <div className="space-y-8">
        <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur sm:p-8 lg:grid-cols-[320px_1fr] lg:p-10">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-lg">
            <Image
              src={book.cover}
              alt={book.title}
              width={480}
              height={720}
              priority
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                Book details
              </p>

              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {book.title}
              </h1>

              <p className="mt-3 text-sm text-white/65">by {book.author}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {book.genre?.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid max-w-lg gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Rating
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{book.rating}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Pages
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{book.pages}</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Source
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{book.source_type}</p>
                </div>
              </div>

              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                {book.description}
              </p>
            </div>

            <BookActions bookId={book.id} />
          </div>
        </section>
      </div>
    );
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      notFound();
    }

    throw error;
  }
}