// lib/filter-books.ts
import type { Book } from "@/lib/types";

export function filterBooks<T extends Book>(books: T[], query: string): T[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return books;
    }

    return books.filter((book) => {
        const haystack = [
            book.title,
            book.author,
            book.description,
            ...(book.genre ?? []),
        ]
            .join(" ")
            .toLowerCase();

        return haystack.includes(normalizedQuery);
    });
}