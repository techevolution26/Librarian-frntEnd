"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BookCard from "@/components/BookCard";
import type { LibraryBook } from "@/lib/types";
import { filterBooks } from "@/lib/filter-books";
import {
    getAverageRating,
    getLibraryCounts,
    getReadingBooks,
    getSectionBooks,
    libraryBooks,
    librarySectionConfigs,
    type LibrarySectionKey,
} from "@/lib/library";

interface StatCardProps {
    label: string;
    value: string;
    hint: string;
}

interface ShelfProps {
    title: string;
    books: LibraryBook[];
    emptyLabel: string;
    size?: "sm" | "md" | "lg";
    tone?: "default" | "featured";
}

function StatCard({ label, value, hint }: StatCardProps) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
            <p className="mt-2 text-sm leading-6 text-white/60">{hint}</p>
        </div>
    );
}

function Shelf({
    title,
    books,
    emptyLabel,
    size = "md",
    tone = "default",
}: ShelfProps) {
    const wrapClass =
        tone === "featured"
            ? "rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6"
            : "";

    return (
        <section className={["space-y-4", wrapClass].filter(Boolean).join(" ")}>
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
                    <p className="mt-1 text-sm text-white/55">{emptyLabel}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                    {books.length} books
                </span>
            </div>

            {books.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2 pr-2">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} size={size} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
                    No books in this section yet.
                </div>
            )}
        </section>
    );
}

export default function LibraryPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") ?? "";

    const [activeSection, setActiveSection] = useState<LibrarySectionKey>("all");

    const filteredLibraryBooks = useMemo(
        () => filterBooks(libraryBooks, query),
        [query],
    );

    const counts = useMemo(
        () => getLibraryCounts(filteredLibraryBooks),
        [filteredLibraryBooks],
    );

    const avgRating = useMemo(
        () => getAverageRating(filteredLibraryBooks),
        [filteredLibraryBooks],
    );

    const readingBooks = useMemo(
        () => getReadingBooks(filteredLibraryBooks),
        [filteredLibraryBooks],
    );

    const visibleSections = useMemo(() => {
        if (activeSection === "all") {
            return librarySectionConfigs.map((section) => ({
                ...section,
                books: getSectionBooks(filteredLibraryBooks, section.key),
            }));
        }

        return librarySectionConfigs
            .filter((section) => section.key === activeSection)
            .map((section) => ({
                ...section,
                books: getSectionBooks(filteredLibraryBooks, section.key),
            }));
    }, [activeSection, filteredLibraryBooks]);

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),linear-gradient(to_bottom_right,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl sm:p-8">
                <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        Personal library
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Your Library
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                        Browse all your books from one source of truth and switch between
                        reading states without hardcoded shelves.
                    </p>

                    {query ? (
                        <p className="mt-4 text-sm text-white/55">
                            Showing results for{" "}
                            <span className="font-medium text-white">&quot;{query}&quot;</span>
                        </p>
                    ) : null}
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="All books"
                    value={String(counts.all)}
                    hint="Everything currently in your filtered library."
                />
                <StatCard
                    label="Currently reading"
                    value={String(counts.reading)}
                    hint="Books with active reading progress."
                />
                <StatCard
                    label="Saved"
                    value={String(counts.saved)}
                    hint="Books queued for later."
                />
                <StatCard
                    label="Average rating"
                    value={avgRating}
                    hint="Average rating across filtered results."
                />
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex flex-wrap gap-3">
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
                                onClick={() => setActiveSection(tab.key as LibrarySectionKey)}
                                className={[
                                    "rounded-full border px-4 py-2 text-sm transition",
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
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Reading progress
                    </p>
                    <div className="mt-4 space-y-4">
                        {readingBooks.length > 0 ? (
                            readingBooks.map((book) => (
                                <div key={book.id}>
                                    <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                                        <span>{book.title}</span>
                                        <span>{book.progress ?? 0}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-white/80"
                                            style={{ width: `${book.progress ?? 0}%` }}
                                        />
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

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Reading insights
                    </p>
                    <ul className="mt-4 space-y-4 text-sm text-white/70">
                        <li className="flex items-start justify-between gap-4">
                            <span>Longest streak</span>
                            <span className="font-medium text-white">7 days</span>
                        </li>
                        <li className="flex items-start justify-between gap-4">
                            <span>Most read genre</span>
                            <span className="font-medium text-white">Productivity</span>
                        </li>
                        <li className="flex items-start justify-between gap-4">
                            <span>Pages read</span>
                            <span className="font-medium text-white">1,284</span>
                        </li>
                    </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Quick actions
                    </p>
                    <div className="mt-4 flex flex-col gap-3">
                        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
                            Continue reading
                        </button>
                        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
                            Add a new book
                        </button>
                        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
                            View finished books
                        </button>
                    </div>
                </div>
            </section>

            <div className="space-y-10">
                {visibleSections.map((section) => (
                    <Shelf
                        key={section.key}
                        title={section.title}
                        books={section.books}
                        emptyLabel={section.emptyLabel}
                        size={section.size}
                        tone={section.tone}
                    />
                ))}
            </div>

            {filteredLibraryBooks.length === 0 ? (
                <section className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
                    No library books match your search.
                </section>
            ) : null}
        </div>
    );
}