"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Crown, Sparkles } from "lucide-react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import CirclePowerButton from "@/components/home/CirclePowerButton";

import type { Book } from "@/lib/types";

interface HomePersonalization {
  preferred_genres: string[];
  reading_goals: string[];
  content_styles: string[];
  preferred_lengths: string[];
  weekly_target: string | null;
  onboarding_completed: boolean;
}
interface HomePageClientProps {
  books: Book[];
  featuredBook: Book | null;
  trendingBooks: Book[];
  personalization: HomePersonalization;
  isServiceUnavailable?: boolean;
}

function getBookPersonalizationScore(
  book: Book,
  personalization: HomePersonalization,
): number {
  let score = 0;

  const bookGenres = book.genre ?? [];
  const preferredGenres = personalization.preferred_genres;

  for (const genre of bookGenres) {
    if (
      preferredGenres.some(
        (preferred) => preferred.toLowerCase() === genre.toLowerCase(),
      )
    ) {
      score += 12;
    }
  }

  const haystack = [
    book.title,
    book.author,
    book.description,
    bookGenres.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  for (const goal of personalization.reading_goals) {
    if (haystack.includes(goal.toLowerCase())) {
      score += 4;
    }
  }

  for (const style of personalization.content_styles) {
    if (haystack.includes(style.toLowerCase())) {
      score += 3;
    }
  }

  if (personalization.preferred_lengths.includes("Short reads") && book.pages <= 180) {
    score += 4;
  }

  if (
    personalization.preferred_lengths.includes("Medium books") &&
    book.pages > 180 &&
    book.pages <= 350
  ) {
    score += 4;
  }

  if (personalization.preferred_lengths.includes("Deep books") && book.pages > 350) {
    score += 4;
  }

  score += book.rating ?? 0;

  return score;
}

function rankPersonalizedBooks(
  books: Book[],
  personalization: HomePersonalization,
): Book[] {
  return [...books].sort((a, b) => {
    const scoreA = getBookPersonalizationScore(a, personalization);
    const scoreB = getBookPersonalizationScore(b, personalization);

    if (scoreB !== scoreA) return scoreB - scoreA;

    return Number(b.id) - Number(a.id);
  });
}

export default function HomePageClient({
  books,
  featuredBook,
  trendingBooks,
  personalization,
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

  const personalizedBooks = useMemo(
    () => rankPersonalizedBooks(filteredBooks, personalization),
    [filteredBooks, personalization],
  );

  const personalizedTrendingBooks = useMemo(
    () => rankPersonalizedBooks(filteredTrendingBooks, personalization),
    [filteredTrendingBooks, personalization],
  );

  const heroBook =
    featuredBook && getBookPersonalizationScore(featuredBook, personalization) > 0
      ? featuredBook
      : personalizedTrendingBooks[0] ??
      personalizedBooks[0] ??
      featuredBook ??
      filteredTrendingBooks[0] ??
      filteredBooks[0] ??
      trendingBooks[0] ??
      books[0];

  const trendingShelfBooks =
    personalizedTrendingBooks.length > 0
      ? personalizedTrendingBooks
      : personalizedBooks;

  const recommendedBooks = personalizedBooks;

  const newReleases = [...filteredBooks].sort(
    (a, b) => Number(b.id) - Number(a.id),
  );

  const continueReading: Book[] = [];
  const starterPicks = personalizedBooks.slice(0, 4); if (isServiceUnavailable) {
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
          <CirclePowerButton/>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar searchValue={searchValue} onSearchChange={setSearchValue} />

      <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        {heroBook ? <Hero book={heroBook} /> : null}

        {!personalization.onboarding_completed ? (
          <div className="mt-6 rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-5 text-sm text-yellow-50 shadow-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-white">Personalize your reading experience</p>
                <p className="mt-1 text-yellow-50/75">
                  Choose your favorite genres and goals so The Librarian can rank books around
                  what you care about.
                </p>
              </div>

              <Link
                href="/onboarding?next=/"
                className="w-fit rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Personalize now
              </Link>
            </div>
          </div>
        ) : personalization.preferred_genres.length > 0 ? (
          <div className="mt-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-4 text-sm text-white/65">
            <p className="font-medium text-white">Personalized for your reading taste</p>
            <p className="mt-1">
              Prioritizing{" "}
              <span className="text-indigo-300 font-semibold">
                {personalization.preferred_genres.slice(0, 3).join(", ")}
              </span>
              {personalization.preferred_genres.length > 3 ? " and more" : ""}.
            </p>
          </div>

        ) : null}

        <div className="mt-10 space-y-10">
          <Row
            title={
              <span className="flex items-center gap-x-2">
                Recommended for You
                <Sparkles className="size-5 shrink-0 text-yellow-400" />
              </span>
            }
            books={recommendedBooks}
            limit={8}
            viewAllHref="/discover?sort=recommended"
            variant="large"
          />

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

          {continueReading.length > 0 ? (
            <Row
              title="Continue Reading"
              books={continueReading}
              limit={4}
              viewAllHref="/library"
              variant="editorial"
            />
          ) : (
            <Row
              title="Start Reading"
              books={starterPicks}
              limit={4}
              viewAllHref="/discover"
              variant="editorial"
            />
          )}
        </div>
      </section>

      <CirclePowerButton />
    </main>
  );
}