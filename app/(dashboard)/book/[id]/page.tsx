import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "@/lib/data";

interface BookPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = books.find((item) => item.id === id);

  if (!book) {
    notFound();
  }

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
                  Status
                </p>
                <p className="mt-2 text-2xl font-semibold">Available</p>
              </div>
            </div>

            <p className="mt-6 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              {book.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/reader/${book.id}`}
              className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Start Reading
            </Link>

            <button className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
              Add to Library
            </button>

            <button className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10">
              Save for Later
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">
            Synopsis
          </p>
          <p className="mt-4 text-sm leading-7 text-white/75">
            {book.description} This area is where you can add a longer synopsis,
            author notes, or editorial highlights later.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">
            Quick actions
          </p>

          <div className="mt-4 space-y-3">
            <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
              Download sample
            </button>
            <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
              Share book
            </button>
            <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
              View similar books
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}