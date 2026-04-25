"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Crown, Sparkles } from "lucide-react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import CirclePowerButton from "@/components/home/CirclePowerButton";

import type { Book } from "@/lib/types";

interface HomePageClientProps {
  books: Book[];
  featuredBook: Book | null;
  trendingBooks: Book[];
  isServiceUnavailable?: boolean;
}

export default function HomePageClient({
  books,
  featuredBook,
  trendingBooks,
  isServiceUnavailable = false,
}: HomePageClientProps) {
  const [searchValue, setSearchValue] = useState("");

  const searchableBooks = useMemo(() => {
    const merged = new Map<string, Book>();

    if (featuredBook) {
      merged.set(String(featuredBook.id), featuredBook);
    }

    for (const book of books) {
      merged.set(String(book.id), book);
    }

    for (const book of trendingBooks) {
      merged.set(String(book.id), book);
    }

    return Array.from(merged.values());
  }, [books, featuredBook, trendingBooks]);

  const filteredBooks = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return searchableBooks;

    return searchableBooks.filter((book) => {
      const haystack = [
        book.title,
        book.author,
        book.description,
        book.genre?.join(" ") ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchableBooks, searchValue]);

  const filteredTrendingBooks = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return trendingBooks;

    const filteredBookIds = new Set(filteredBooks.map((book) => String(book.id)));

    return trendingBooks.filter((book) => filteredBookIds.has(String(book.id)));
  }, [filteredBooks, searchValue, trendingBooks]);

  const heroBook =
    featuredBook ??
    filteredTrendingBooks[0] ??
    filteredBooks[0] ??
    trendingBooks[0] ??
    books[0];

  const trendingShelfBooks =
    filteredTrendingBooks.length > 0
      ? filteredTrendingBooks
      : filteredBooks;

  const newReleases = [...filteredBooks].sort(
    (a, b) => Number(b.id) - Number(a.id),
  );

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

  if (!books.length && !trendingBooks.length && !featuredBook) {
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
        {heroBook ? <Hero book={heroBook} /> : null}

        <div className="mt-10 space-y-10">
          <Row
            title={
              <span className="flex items-center gap-x-2">
                Trending Now
                <Crown className="size-5 shrink-0 text-yellow-400" />
              </span>
            }
            books={trendingShelfBooks}
            limit={8}
            viewAllHref="/discover?sort=trending"
            variant="large"
          />

          <Row
            title={
              <span className="flex items-center gap-x-2">
                New Releases
                <Sparkles className="size-5 shrink-0 text-yellow-400" />
              </span>
            }
            books={newReleases}
            limit={6}
            viewAllHref="/discover?sort=newest"
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

      <CirclePowerButton />
    </main>
  );
}