"use client";

import { useMemo, type ReactNode } from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

import { books } from "@/lib/data";
import BookCard from "@/components/BookCard";
import { filterBooks } from "@/lib/filter-books";
import {
    DEFAULT_GENRE,
    DEFAULT_SORT,
    enrichBooks,
    filterByGenre,
    getAvailableGenres,
    getCategoriesCount,
    getTopRatedCount,
    isValidSort,
    sortBooks,
    sortOptions,
} from "@/lib/discover";

interface FilterChipProps {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
}

interface DiscoverSectionProps {
    title: string;
    subtitle: string;
    items: ReturnType<typeof enrichBooks>;
}

function FilterChip({
    children,
    active = false,
    onClick,
}: FilterChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-full border px-4 py-2 text-sm transition",
                active
                    ? "border-white/20 bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

function DiscoverSection({
    title,
    subtitle,
    items,
}: DiscoverSectionProps) {
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

export default function DiscoverPageClient() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get("q") ?? "";
    const rawGenre = searchParams.get("genre");
    const rawSort = searchParams.get("sort");

    const enrichedBooks = useMemo(() => enrichBooks(books), []);
    const availableGenres = useMemo(() => getAvailableGenres(books), []);

    const activeGenre =
        rawGenre && availableGenres.includes(rawGenre) ? rawGenre : DEFAULT_GENRE;

    const activeSort = isValidSort(rawSort) ? rawSort : DEFAULT_SORT;

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

    const searchedBooks = useMemo(
        () => filterBooks(enrichedBooks, query),
        [enrichedBooks, query],
    );

    const filteredBooks = useMemo(() => {
        const byGenre = filterByGenre(searchedBooks, activeGenre);
        return sortBooks(byGenre, activeSort);
    }, [searchedBooks, activeGenre, activeSort]);

    const recommended = useMemo(
        () => sortBooks(filteredBooks, "Recommended").slice(0, 6),
        [filteredBooks],
    );

    const trending = useMemo(
        () => sortBooks(filteredBooks, "Top Rated").slice(0, 6),
        [filteredBooks],
    );

    const newArrivals = useMemo(
        () => sortBooks(filteredBooks, "Newest").slice(0, 6),
        [filteredBooks],
    );

    const topRatedCount = getTopRatedCount(filteredBooks);
    const categoriesCount = getCategoriesCount(filteredBooks);

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl sm:p-8">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Discover books
                </p>

                <div className="mt-3 max-w-3xl">
                    <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Discover
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                        Browse curated books by genre, popularity, and freshness.
                    </p>

                    {(query || activeGenre !== DEFAULT_GENRE || activeSort !== DEFAULT_SORT) && (
                        <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/55">
                            {query ? (
                                <span>
                                    Search: <span className="font-medium text-white">&quot;{query}&quot;</span>
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
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        {availableGenres.map((genre) => (
                            <FilterChip
                                key={genre}
                                active={activeGenre === genre}
                                onClick={() => setParams({ genre })}
                            >
                                {genre}
                            </FilterChip>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {sortOptions.map((option) => (
                            <FilterChip
                                key={option}
                                active={activeSort === option}
                                onClick={() => setParams({ sort: option })}
                            >
                                {option}
                            </FilterChip>
                        ))}
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/60">Visible books</p>
                    <p className="mt-2 text-3xl font-semibold">{filteredBooks.length}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/60">Top rated</p>
                    <p className="mt-2 text-3xl font-semibold">{topRatedCount}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/60">New in results</p>
                    <p className="mt-2 text-3xl font-semibold">{newArrivals.length}</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-sm text-white/60">Categories</p>
                    <p className="mt-2 text-3xl font-semibold">{categoriesCount}</p>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-white">
                            Explore All
                        </h2>
                        <p className="mt-1 text-sm text-white/55">
                            All books matching your active search, genre, and sorting.
                        </p>
                    </div>

                    {(query || activeGenre !== DEFAULT_GENRE || activeSort !== DEFAULT_SORT) && (
                        <button
                            type="button"
                            onClick={() => setParams({ q: null, genre: null, sort: null })}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                {filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-6">
                        {filteredBooks.map((book) => (
                            <BookCard key={book.id} book={book} size="md" />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
                        No books found. Try another search term, genre, or sort option.
                    </div>
                )}
            </section>

            <div className="space-y-10">
                <DiscoverSection
                    title="Recommended for You"
                    subtitle="Best-ranked books from your current filtered result set."
                    items={recommended}
                />
                <DiscoverSection
                    title="Trending Now"
                    subtitle="Top-rated books from what currently matches."
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