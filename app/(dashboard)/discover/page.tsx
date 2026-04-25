import { Suspense } from "react";
import {
  getBookGenres,
  getDiscoverBooks,
  getDiscoverStats,
  type DiscoverSort,
} from "@/lib/api";
import DiscoverPageClient from "./DiscoverPageClient";

export const dynamic = "force-dynamic";

interface DiscoverPageProps {
  searchParams?: Promise<{
    q?: string;
    genre?: string;
    sort?: DiscoverSort;
  }>;
}

function DiscoverFallback() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Discover books
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Discover
        </h1>

        <p className="mt-4 text-sm text-white/70">
          Loading discover...
        </p>
      </section>
    </div>
  );
}

function DiscoverUnavailable() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Discover books
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Discover
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
          We couldn&apos;t load books right now. Please try again in a moment.
        </p>
      </section>
    </div>
  );
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = searchParams ? await searchParams : {};

  const q = params.q ?? "";
  const genre = params.genre ?? "All";
  const sort = params.sort ?? "recommended";

  let genres, exploreAll, recommended, trending, newArrivals, stats;

  try {
    [genres, exploreAll, recommended, trending, newArrivals, stats] =
      await Promise.all([
        getBookGenres(),
        getDiscoverBooks({ q, genre, sort, limit: 48 }),
        getDiscoverBooks({ q, genre, sort: "recommended", limit: 8 }),
        getDiscoverBooks({ q, genre, sort: "trending", limit: 8 }),
        getDiscoverBooks({ q, genre, sort: "newest", limit: 8 }),
        getDiscoverStats({ q, genre }),
      ]);
  } catch (error) {
    return <DiscoverUnavailable />;
  }

  return (
    <Suspense fallback={<DiscoverFallback />}>
      <DiscoverPageClient
        genres={genres}
        exploreAll={exploreAll}
        recommended={recommended}
        trending={trending}
        newArrivals={newArrivals}
        stats={stats}
        initialQuery={q}
        initialGenre={genre}
        initialSort={sort}
      />
    </Suspense>
  );
}