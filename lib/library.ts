// lib/library.ts
import { books } from "@/lib/data";
import type { LibraryBook, LibraryStatus } from "@/lib/types";

export type LibrarySectionKey = "all" | LibraryStatus;

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

export const libraryBooks: LibraryBook[] = books.map((book, index) => {
    if (index < 4) {
        return {
            ...book,
            status: "reading",
            progress: [78, 42, 91, 24][index] ?? 0,
        };
    }

    if (index < 8) {
        return {
            ...book,
            status: "saved",
            progress: 0,
            addedAt: "2026-03-20",
        };
    }

    return {
        ...book,
        status: "finished",
        progress: 100,
        finishedAt: "2026-03-10",
    };
});

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

export function getSectionBooks(
    allBooks: LibraryBook[],
    key: LibrarySectionKey,
): LibraryBook[] {
    if (key === "all") return allBooks;
    return allBooks.filter((book) => book.status === key);
}

export function getLibraryCounts(allBooks: LibraryBook[]): LibraryCounts {
    return {
        all: allBooks.length,
        reading: allBooks.filter((book) => book.status === "reading").length,
        saved: allBooks.filter((book) => book.status === "saved").length,
        finished: allBooks.filter((book) => book.status === "finished").length,
    };
}

export function getAverageRating(allBooks: LibraryBook[]): string {
    if (allBooks.length === 0) return "0.0";

    const total = allBooks.reduce((sum, book) => sum + book.rating, 0);
    return (total / allBooks.length).toFixed(1);
}

export function getReadingBooks(allBooks: LibraryBook[]): LibraryBook[] {
    return allBooks.filter((book) => book.status === "reading");
}