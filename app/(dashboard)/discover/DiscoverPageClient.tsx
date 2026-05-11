"use client";

import { useMemo, useState, type ReactNode } from "react";
import { LayersPlus, Library, List, Star, Telescope } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import BookCard from "@/components/BookCard";
import type {DiscoverSort, DiscoverStats } from "@/lib/api";
import { Book } from "@/lib/types";

interface DiscoverPageClientProps {
  genres: string[];
  exploreAll: Book[];
  recommended: Book[];
  trending: Book[];
  newArrivals: Book[];
  stats: DiscoverStats;
  initialQuery: string;
  initialGenre: string;
  initialSort: DiscoverSort;
}

interface FilterChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface DiscoverSectionProps {
  title: string;
  subtitle: string;
  items: Book[];
}

interface ExploreAllGridProps {
  books: Book[];
}

const DEFAULT_GENRE = "All";
const DEFAULT_SORT: DiscoverSort = "recommended";
const INITIAL_VISIBLE_BOOKS = 12;
const LOAD_MORE_STEP = 12;

const sortOptions: { label: string; value: DiscoverSort }[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Trending", value: "trending" },
  { label: "Top Rated", value: "top-rated" },
  { label: "Newest", value: "newest" },
  { label: "Most Saved", value: "most-saved" },
];

function FilterChip({ children, active = false, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-white/20 bg-white text-black"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function DiscoverSection({ title, subtitle, items }: DiscoverSectionProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-white/55">{subtitle}</p>
      </div>

      {items.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-2 pr-2">
          {items.map((book) => (
            <BookCard key={book.id} book={book} size="md" />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
          No books match this section right now.
        </div>
      )}
    </section>
  );
}

function ExploreAllGrid({ books }: ExploreAllGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_BOOKS);

  const visibleBooks = useMemo(
    () => books.slice(0, visibleCount),
    [books, visibleCount],
  );

  const hasMoreBooks = visibleCount < books.length;

  if (books.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
        No books found. Try another search term, genre, or sort option.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6">
        {visibleBooks.map((book) => (
          <BookCard key={book.id} book={book} size="md" />
        ))}
      </div>

      {hasMoreBooks ? (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Show more books
          </button>
        </div>
      ) : null}
    </>
  );
}

export default function DiscoverPageClient({
  genres,
  exploreAll,
  recommended,
  trending,
  newArrivals,
  stats,
  initialQuery,
  initialGenre,
  initialSort,
}: DiscoverPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(initialQuery);

  const activeGenre = initialGenre || DEFAULT_GENRE;
  const activeSort = initialSort || DEFAULT_SORT;

  const setParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (
        !value ||
        (key === "genre" && value === DEFAULT_GENRE) ||
        (key === "sort" && value === DEFAULT_SORT) ||
        (key === "q" && value.trim() === "")
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const next = params.toString();
    router.replace(next ? `${pathname}?${next}` : pathname);
  };

  const handleSearchSubmit = () => {
    setParams({ q: searchValue });
  };

  const exploreAllKey = `${initialQuery}__${activeGenre}__${activeSort}`;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Discover books
        </p>

        <div className="mt-3 max-w-3xl">
          <h1 className="flex items-center gap-x-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Discover
            <Telescope className="size-7 shrink-0 sm:size-8" />
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
            Browse curated books by genre, popularity, and freshness.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleSearchSubmit();
              }}
              placeholder="Search books, authors, descriptions..."
              className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/35"
            />

            <button
              type="button"
              onClick={handleSearchSubmit}
              className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black"
            >
              Search
            </button>
          </div>

          {(initialQuery || activeGenre !== DEFAULT_GENRE || activeSort !== DEFAULT_SORT) && (
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/55">
              {initialQuery ? (
                <span>
                  Search:{" "}
                  <span className="font-medium text-white">
                    &quot;{initialQuery}&quot;
                  </span>
                </span>
              ) : null}
              {activeGenre !== DEFAULT_GENRE ? (
                <span>
                  Genre: <span className="font-medium text-white">{activeGenre}</span>
                </span>
              ) : null}
              {activeSort !== DEFAULT_SORT ? (
                <span>
                  Sort: <span className="font-medium text-white">{activeSort}</span>
                </span>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="space-y-4">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
              Browse by genre
            </p>
            <div className="-mx-1 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-3 px-1">
                {genres.map((genre) => (
                  <FilterChip
                    key={genre}
                    active={activeGenre === genre}
                    onClick={() => setParams({ genre })}
                  >
                    {genre}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/40">
              Sort results
            </p>
            <div className="-mx-1 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2 px-1">
                {sortOptions.map((option) => (
                  <FilterChip
                    key={option.value}
                    active={activeSort === option.value}
                    onClick={() => setParams({ sort: option.value })}
                  >
                    {option.label}
                  </FilterChip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:rounded-3xl sm:p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-white/45 sm:text-sm sm:tracking-normal sm:text-white/60">
            Visible books
          </p>
          <p className="mt-2 flex items-center gap-x-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {stats.visible_books}
            <Library className="size-6 shrink-0 text-white/70 sm:size-7" />
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:rounded-3xl sm:p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-white/45 sm:text-sm sm:tracking-normal sm:text-white/60">
            Top rated
          </p>
          <p className="mt-2 flex items-center gap-x-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {stats.top_rated}
            <Star className="size-6 shrink-0 fill-yellow-400 text-yellow-400 sm:size-7" />
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:rounded-3xl sm:p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-white/45 sm:text-sm sm:tracking-normal sm:text-white/60">
            New on Stack
          </p>
          <p className="mt-2 flex items-center gap-x-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {stats.new_this_week}
            <LayersPlus className="size-6 shrink-0 text-white/70 sm:size-7" />
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:rounded-3xl sm:p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-white/45 sm:text-sm sm:tracking-normal sm:text-white/60">
            Categories
          </p>
          <p className="mt-2 flex items-center gap-x-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {stats.categories}
            <List className="size-6 shrink-0 text-white/70 sm:size-7" />
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Explore All
            </h2>
            <p className="mt-1 text-sm text-white/55">
              All books matching your active search, genre, and sorting.
            </p>
          </div>

          {(initialQuery || activeGenre !== DEFAULT_GENRE || activeSort !== DEFAULT_SORT) && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                setParams({ q: null, genre: null, sort: null });
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Reset filters
            </button>
          )}
        </div>

        <ExploreAllGrid key={exploreAllKey} books={exploreAll} />
      </section>

      <div className="space-y-10">
        <DiscoverSection
          title="Recommended for You"
          subtitle="Best-ranked books from your current filtered result set."
          items={recommended}
        />
        <DiscoverSection
          title="Trending Now"
          subtitle="Recently active books based on reading and library activity."
          items={trending}
        />
        <DiscoverSection
          title="New Arrivals"
          subtitle="Newest books from the current filtered set."
          items={newArrivals}
        />
      </div>
    </div>
  );
}