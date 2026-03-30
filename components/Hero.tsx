// components/Hero.tsx
import Image from "next/image";
import { Book } from "@/lib/types";

interface HeroProps {
  book: Book;
}

export default function Hero({ book }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 text-white shadow-2xl">
      <div className="absolute inset-0">
        <Image
          src={book.cover}
          alt={book.title}
          fill
          priority
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-[60vh] items-end p-6 sm:p-10 lg:p-14">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
            Featured book
          </p>

          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {book.title}
          </h2>

          <p className="mt-3 text-sm text-white/70 sm:text-base">
            by {book.author}
          </p>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
            {book.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90">
              Read Now
            </button>
            <button className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">
              View Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}