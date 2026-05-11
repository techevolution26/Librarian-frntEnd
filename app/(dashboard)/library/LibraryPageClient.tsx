// app/(dashboard)/library/LibraryPageClient.tsx
"use client";

import { useMemo, useState } from "react";
import { LibraryBig } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
    const router = useRouter();
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
        <div className="w-full max-w-none space-y-5 px-3 pb-28 sm:space-y-7 sm:px-6 sm:pb-20 lg:px-10 lg:pb-12">
            <section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(to_bottom_right,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-2xl sm:rounded-[2rem]">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-100/70 sm:text-xs">
                                Personal library
                            </p>

                            <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                                Your Library
                                <LibraryBig className="size-6 shrink-0 text-white/75 sm:size-9" />
                            </h1>

                            <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/60 sm:line-clamp-none sm:text-base sm:leading-7">
                                Keep reading, manage saved books, and start accountability circles
                                around the books that matter.
                            </p>

                            {query ? (
                                <p className="mt-3 text-xs text-white/50 sm:text-sm">
                                    Results for{" "}
                                    <span className="font-medium text-white">&quot;{query}&quot;</span>
                                </p>
                            ) : null}
                        </div>

                        <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 sm:block">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                                Books
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-white">
                                {summaryForHints.all}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 sm:hidden">
                        <MobileMetric label="Books" value={String(summaryForHints.all)} />
                        <MobileMetric label="Reading" value={String(summaryForHints.reading)} />
                        <MobileMetric label="Saved" value={String(summaryForHints.saved)} />
                    </div>

                    <div className="mt-6 hidden grid-cols-4 gap-3 sm:grid">
                        <LibraryMetric
                            label="Books"
                            value={String(summaryForHints.all)}
                            hint="total"
                        />
                        <LibraryMetric
                            label="Reading"
                            value={String(summaryForHints.reading)}
                            hint="active"
                            tone="active"
                        />
                        <LibraryMetric
                            label="Saved"
                            value={String(summaryForHints.saved)}
                            hint="queued"
                        />
                        <LibraryMetric
                            label="Rating"
                            value={
                                summaryForHints.average_rating
                                    ? summaryForHints.average_rating.toFixed(1)
                                    : "0.0"
                            }
                            hint="average"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-3 shadow-xl sm:rounded-[2rem] sm:p-4">
                <div className="-mx-1 overflow-x-auto pb-1">
                    <div className="flex min-w-max items-center gap-2 px-1">
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
                                        "shrink-0 rounded-full border px-3 py-2 text-xs whitespace-nowrap transition sm:px-4 sm:text-sm",
                                        isActive
                                            ? "border-white/20 bg-white text-black"
                                            : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
                                    ].join(" ")}
                                >
                                    {tab.label}
                                    <span className="ml-1.5 opacity-70 sm:ml-2">{tab.count}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                            Continue
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                            {readingItems.length > 0
                                ? "Pick up where you left off"
                                : "Start your first active read"}
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            readingItems.length > 0
                                ? router.push(`/reader/${readingItems[0].book.id}`)
                                : router.push("/discover")
                        }
                        className="shrink-0 rounded-xl bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-white/90 sm:px-4 sm:text-sm"
                    >
                        {readingItems.length > 0 ? "Read" : "Discover"}
                    </button>
                </div>

                <div className="mt-4">
                    {readingItems.length > 0 ? (
                        <div className="space-y-3">
                            {readingItems.slice(0, 2).map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => router.push(`/reader/${item.book.id}`)}
                                    className="w-full rounded-2xl border border-white/10 bg-black/20 p-3 text-left transition hover:bg-white/[0.06] sm:p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="line-clamp-2 text-sm font-medium text-white sm:text-base">
                                                {item.book.title}
                                            </p>
                                            <p className="mt-1 text-xs text-white/45">
                                                {formatLastRead(item.last_read_at)}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70">
                                            {item.progress}%
                                        </span>
                                    </div>

                                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10 sm:h-2">
                                        <div
                                            className="h-full rounded-full bg-white/80"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/40 sm:text-xs">
                                        {item.current_page ? (
                                            <span>Page {item.current_page}</span>
                                        ) : null}
                                        {item.bookmark_page ? (
                                            <span>Bookmark {item.bookmark_page}</span>
                                        ) : null}
                                    </div>
                                </button>
                            ))}

                            {readingItems.length > 2 ? (
                                <button
                                    type="button"
                                    onClick={() => setActiveSection("reading")}
                                    className="text-xs font-medium text-white/60 transition hover:text-white"
                                >
                                    View {readingItems.length - 2} more active reads
                                </button>
                            ) : null}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4">
                            <p className="text-sm font-medium text-white">No active reading yet</p>
                            <p className="mt-1 text-sm leading-6 text-white/50">
                                Open a saved book or discover something new to begin tracking
                                progress.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_360px]">
                <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/[0.06] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/60 sm:text-xs">
                                Reading circles
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-white">
                                Read with people
                            </h2>

                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/55 sm:line-clamp-none">
                                Create accountability around an active book with friends, family,
                                classmates, or study partners.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                const firstReadingBook = readingItems[0]?.book.id;
                                router.push(
                                    `/circles${firstReadingBook ? `?book=${firstReadingBook}` : ""}`,
                                );
                            }}
                            className="rounded-2xl bg-white px-3 py-3 text-left text-xs font-medium text-black transition hover:bg-white/90 sm:text-sm"
                        >
                            Start circle
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push("/connections")}
                            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-xs text-white/85 transition hover:bg-white/10 sm:text-sm"
                        >
                            Invite partners
                        </button>
                    </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                        Reading signal
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                        <SignalItem label="Genre" value={topGenre} />
                        <SignalItem label="Pages" value={pagesRead.toLocaleString()} />
                        <SignalItem
                            label="Active"
                            value={readingItems.length ? String(readingItems.length) : "0"}
                        />
                    </div>
                </div>
            </section>

            <div className="space-y-7 sm:space-y-9">
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
                <section className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-white/50 sm:p-8">
                    No library books match your search.
                </section>
            ) : null}
        </div>
    );
}

function MobileMetric({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
                {label}
            </p>
            <p className="mt-1 text-xl font-semibold text-white">{value}</p>
        </div>
    );
}

function LibraryMetric({
    label,
    value,
    hint,
    tone = "default",
}: {
    label: string;
    value: string;
    hint: string;
    tone?: "default" | "active";
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                {label}
            </p>
            <p
                className={[
                    "mt-2 text-3xl font-semibold",
                    tone === "active" ? "text-cyan-100" : "text-white",
                ].join(" ")}
            >
                {value}
            </p>
            <p className="mt-1 text-xs text-white/40">{hint}</p>
        </div>
    );
}

function SignalItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/35 sm:text-xs">
                {label}
            </p>
            <p className="mt-2 truncate text-xs font-medium text-white sm:text-sm">
                {value}
            </p>
        </div>
    );
}