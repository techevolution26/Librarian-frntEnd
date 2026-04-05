"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import type { Book } from "@/lib/types";

interface HomePageClientProps {
  books: Book[];
  isServiceUnavailable?: boolean;
}

export default function HomePageClient({
  books,
  isServiceUnavailable = false,
}: HomePageClientProps) {
  const [searchValue, setSearchValue] = useState("");

  const filteredBooks = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return books;

    return books.filter((book) => {
      const haystack =
        `${book.title} ${book.author} ${book.description} ${book.genre?.join(" ") ?? ""}`.toLowerCase();

      return haystack.includes(query);
    });
  }, [books, searchValue]);

  const featuredBook = filteredBooks[0] ?? books[0];
  const trendingBooks = filteredBooks;
  const newReleases = [...filteredBooks].sort((a, b) => Number(b.id) - Number(a.id));
  const continueReading = filteredBooks.slice(0, 4);

  if (isServiceUnavailable) {
    return (
      <main id="main-content" className="min-h-screen">
        <Navbar searchValue={searchValue} onSearchChange={setSearchValue} />

        <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl sm:p-10">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                Temporary issue
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                The library service is temporarily unavailable
              </h1>
              <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                We couldn&apos;t load books right now. This is usually temporary.
                Please try again in a moment.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                >
                  Try again
                </button>

                <Link
                  href="/discover"
                  className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Explore app
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!books.length) {
    return (
      <main id="main-content" className="min-h-screen">
        <Navbar searchValue={searchValue} onSearchChange={setSearchValue} />
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-sm text-white/60">
            No books are available yet.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar searchValue={searchValue} onSearchChange={setSearchValue} />

      <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <Hero book={featuredBook} />

        <div className="mt-10 space-y-10">
          <Row
            title="Trending Now"
            books={trendingBooks}
            limit={8}
            viewAllHref="/discover?sort=Top%20Rated"
            variant="large"
          />

          <Row
            title="New Releases"
            books={newReleases}
            limit={6}
            viewAllHref="/discover?sort=Newest"
            variant="compact"
          />

          <Row
            title="Continue Reading"
            books={continueReading}
            limit={4}
            viewAllHref="/library"
            variant="editorial"
          />
        </div>
      </section>
    </main>
  );
}