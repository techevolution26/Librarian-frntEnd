// app/(dashboard)/library/LibraryPageClient.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BookCard from "@/components/BookCard";
import { filterBooks } from "@/lib/filter-books";
import type { LibraryItem, LibrarySummary } from "@/lib/api";
import {
    getAverageRating,
    getLibraryCounts,
    librarySectionConfigs,
    getPagesRead,
    getReadingItems,
    getSectionItems,
    getTopGenre,
} from "@/lib/library";

type LibrarySectionKey = "all" | "reading" | "saved" | "finished";

interface LibraryPageClientProps {
    initialItems: LibraryItem[];
    initialSummary: LibrarySummary;
}

interface StatCardProps {
    label: string;
    value: string;
    hint: string;
}

interface ShelfProps {
    title: string;
    items: LibraryItem[];
    emptyLabel: string;
    size?: "sm" | "md" | "lg";
    tone?: "default" | "featured";
}

function StatCard({ label, value, hint }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-lg backdrop-blur sm:rounded-3xl sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 sm:text-xs sm:tracking-[0.2em]">
                {label}
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-white sm:mt-3 sm:text-3xl">
                {value}
            </p>
            <p className="mt-2 text-xs leading-5 text-white/55 sm:text-sm sm:leading-6 sm:text-white/60">
                {hint}
            </p>
        </div>
    );
}

function formatLastRead(value?: string | null): string {
    if (!value) return "Not opened yet";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Recently updated";

    return `Last read ${date.toLocaleDateString()}`;
}

function Shelf({
    title,
    items,
    emptyLabel,
    size = "md",
    tone = "default",
}: ShelfProps) {
    const wrapClass =
        tone === "featured"
            ? "rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4 sm:rounded-[2rem] sm:p-6"
            : "";

    return (
        <section className={["space-y-4", wrapClass].filter(Boolean).join(" ")}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-white/55">{emptyLabel}</p>
                </div>
                <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                    {items.length} books
                </span>
            </div>

            {items.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex gap-4 overflow-x-auto pb-2 pr-2">
                        {items.map((item) => (
                            <BookCard key={item.book.id} book={item.book} size={size} />
                        ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p className="line-clamp-2 text-sm font-medium text-white">
                                        {item.book.title}
                                    </p>
                                    <span className="shrink-0 text-xs text-white/50">
                                        {item.status}
                                    </span>
                                </div>

                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/55">
                                    <span>{item.progress}% progress</span>
                                    {item.current_page ? <span>Page {item.current_page}</span> : null}
                                    {item.bookmark_page ? (
                                        <span>Bookmark p.{item.bookmark_page}</span>
                                    ) : null}
                                    <span>{formatLastRead(item.last_read_at)}</span>
                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-white/80"
                                        style={{ width: `${item.progress}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/50 sm:p-8">
                    No books in this section yet.
                </div>
            )}
        </section>
    );
}

export default function LibraryPageClient({
    initialItems,
    initialSummary,
}: LibraryPageClientProps) {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") ?? "";

    const [activeSection, setActiveSection] = useState<LibrarySectionKey>("all");

    const filteredItems = useMemo(() => {
        const filteredBooks = filterBooks(
            initialItems.map((item) => item.book),
            query,
        );

        const allowedIds = new Set(filteredBooks.map((book) => book.id));

        return initialItems.filter((item) => allowedIds.has(item.book.id));
    }, [initialItems, query]);

    const counts = useMemo(() => getLibraryCounts(filteredItems), [filteredItems]);

    const averageRating = useMemo(
        () => getAverageRating(filteredItems),
        [filteredItems],
    );

    const readingItems = useMemo(
        () => getReadingItems(filteredItems),
        [filteredItems],
    );

    const pagesRead = useMemo(
        () => getPagesRead(filteredItems),
        [filteredItems],
    );

    const topGenre = useMemo(
        () => getTopGenre(filteredItems),
        [filteredItems],
    );

    const visibleSections = useMemo(() => {
        if (activeSection === "all") {
            return librarySectionConfigs.map((section) => ({
                ...section,
                items: getSectionItems(filteredItems, section.key),
            }));
        }

        return librarySectionConfigs
            .filter((section) => section.key === activeSection)
            .map((section) => ({
                ...section,
                items: getSectionItems(filteredItems, section.key),
            }));
    }, [activeSection, filteredItems]);

    const summaryForHints = query
        ? {
            all: counts.all,
            reading: counts.reading,
            saved: counts.saved,
            finished: counts.finished,
            average_rating: Number(averageRating),
        }
        : initialSummary;

    return (
        <div className="space-y-6 sm:space-y-8">
            <section className="rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),linear-gradient(to_bottom_right,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-2xl sm:rounded-[2rem] sm:p-8">
                <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        Personal library
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                        Your Library
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                        Browse all your books from one source of truth and track reading state,
                        progress, bookmarks, and last-read activity.
                    </p>

                    {query ? (
                        <p className="mt-4 text-sm text-white/55">
                            Showing results for{" "}
                            <span className="font-medium text-white">&quot;{query}&quot;</span>
                        </p>
                    ) : null}
                </div>
            </section>

            <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                <StatCard
                    label="All books"
                    value={String(summaryForHints.all)}
                    hint="Everything currently in your library."
                />
                <StatCard
                    label="Currently reading"
                    value={String(summaryForHints.reading)}
                    hint="Books with active reading progress."
                />
                <StatCard
                    label="Saved"
                    value={String(summaryForHints.saved)}
                    hint="Books queued for later."
                />
                <StatCard
                    label="Average rating"
                    value={String(summaryForHints.average_rating)}
                    hint="Average rating across your library."
                />
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="-mx-1 overflow-x-auto pb-1">
                    <div className="flex min-w-max items-center gap-3 px-1">
                        {[
                            { key: "all", label: "All", count: counts.all },
                            { key: "reading", label: "Reading", count: counts.reading },
                            { key: "saved", label: "Saved", count: counts.saved },
                            { key: "finished", label: "Finished", count: counts.finished },
                        ].map((tab) => {
                            const isActive = activeSection === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveSection(tab.key as LibrarySectionKey)}
                                    className={[
                                        "shrink-0 rounded-full border px-4 py-2 text-sm whitespace-nowrap transition",
                                        isActive
                                            ? "border-white/20 bg-white text-black"
                                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                    ].join(" ")}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-3 xl:gap-6">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Reading progress
                    </p>
                    <div className="mt-4 space-y-4">
                        {readingItems.length > 0 ? (
                            readingItems.map((item) => (
                                <div key={item.id}>
                                    <div className="mb-2 flex items-start justify-between gap-3 text-sm text-white/70">
                                        <span className="line-clamp-2">{item.book.title}</span>
                                        <span className="shrink-0">{item.progress}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-white/80"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/50">
                                        {item.current_page ? (
                                            <span>Current page {item.current_page}</span>
                                        ) : null}
                                        {item.bookmark_page ? (
                                            <span>Bookmark p.{item.bookmark_page}</span>
                                        ) : null}
                                        <span>{formatLastRead(item.last_read_at)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-white/55">
                                No active reading progress for this search.
                            </p>
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Reading insights
                    </p>
                    <ul className="mt-4 space-y-4 text-sm text-white/70">
                        <li className="flex items-start justify-between gap-4">
                            <span>Longest streak</span>
                            <span className="shrink-0 font-medium text-white">
                                {readingItems.length ? `${readingItems.length} active` : "0 active"}
                            </span>
                        </li>
                        <li className="flex items-start justify-between gap-4">
                            <span>Most read genre</span>
                            <span className="shrink-0 font-medium text-white">{topGenre}</span>
                        </li>
                        <li className="flex items-start justify-between gap-4">
                            <span>Pages read</span>
                            <span className="shrink-0 font-medium text-white">
                                {pagesRead.toLocaleString()}
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Quick actions
                    </p>
                    <div className="mt-4 flex flex-col gap-3">
                        <button
                            type="button"
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10"
                        >
                            Continue reading
                        </button>
                        <button
                            type="button"
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10"
                        >
                            Add a new book
                        </button>
                        <button
                            type="button"
                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10"
                        >
                            View finished books
                        </button>
                    </div>
                </div>
            </section>

            <div className="space-y-8 sm:space-y-10">
                {visibleSections.map((section) => (
                    <Shelf
                        key={section.key}
                        title={section.title}
                        items={section.items}
                        emptyLabel={section.emptyLabel}
                        size={section.size}
                        tone={section.tone}
                    />
                ))}
            </div>

            {filteredItems.length === 0 ? (
                <section className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-sm text-white/50 sm:p-8">
                    No library books match your search.
                </section>
            ) : null}
        </div>
    );
}