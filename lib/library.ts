// lib/library.ts
import type { LibraryItem } from "@/lib/api";

export type LibrarySectionKey = "all" | "reading" | "saved" | "finished";

export interface LibrarySectionConfig {
    key: LibrarySectionKey;
    title: string;
    emptyLabel: string;
    size: "sm" | "md" | "lg";
    tone?: "default" | "featured";
}

export interface LibraryCounts {
    all: number;
    reading: number;
    saved: number;
    finished: number;
}

export const librarySectionConfigs: LibrarySectionConfig[] = [
    {
        key: "all",
        title: "All Books",
        emptyLabel: "Everything currently in your library.",
        size: "md",
        tone: "default",
    },
    {
        key: "reading",
        title: "Currently Reading",
        emptyLabel: "Books you are actively reading right now.",
        size: "lg",
        tone: "featured",
    },
    {
        key: "saved",
        title: "Saved for Later",
        emptyLabel: "Books you have bookmarked or want to start.",
        size: "md",
        tone: "default",
    },
    {
        key: "finished",
        title: "Finished",
        emptyLabel: "Books you have completed.",
        size: "sm",
        tone: "default",
    },
];

export function getSectionItems(
    items: LibraryItem[],
    key: LibrarySectionKey,
): LibraryItem[] {
    if (key === "all") return items;
    return items.filter((item) => item.status === key);
}

export function getLibraryCounts(items: LibraryItem[]): LibraryCounts {
    return {
        all: items.length,
        reading: items.filter((item) => item.status === "reading").length,
        saved: items.filter((item) => item.status === "saved").length,
        finished: items.filter((item) => item.status === "finished").length,
    };
}

export function getAverageRating(items: LibraryItem[]): string {
    if (items.length === 0) return "0.0";

    const total = items.reduce((sum, item) => sum + item.book.rating, 0);
    return (total / items.length).toFixed(1);
}

export function getReadingItems(items: LibraryItem[]): LibraryItem[] {
    return items.filter((item) => item.status === "reading");
}

export function getPagesRead(items: LibraryItem[]): number {
    return items.reduce((sum, item) => {
        const pages = item.book.pages ?? 0;
        const progress = item.progress ?? 0;
        return sum + Math.round((pages * progress) / 100);
    }, 0);
}

export function getTopGenre(items: LibraryItem[]): string {
    const counts = new Map<string, number>();

    items.forEach((item) => {
        item.book.genre.forEach((genre) => {
            counts.set(genre, (counts.get(genre) ?? 0) + 1);
        });
    });

    let topGenre = "—";
    let topCount = 0;

    counts.forEach((count, genre) => {
        if (count > topCount) {
            topGenre = genre;
            topCount = count;
        }
    });

    return topGenre;
}