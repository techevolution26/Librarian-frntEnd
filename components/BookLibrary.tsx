"use client";

import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { useDashboardSearch } from "@/store/useDashboardSearch";
import type { Book } from "@/lib/types";

// interface Book {
//     id: string;
//     title: string;
//     author: string;
//     description: string;
//     genre: string[];
//     cover: string;
//     rating: number;
//     pages: number;
// }

export default function BookLibrary({ allBooks }: { allBooks: Book[] }) {
    const query = useDashboardSearch((state) => state.query).toLowerCase();

    const filteredBooks = allBooks.filter((book) => {
        const haystack = `${book.title} ${book.author} ${book.description} ${book.genre?.join(" ") ?? ""}`.toLowerCase();
        return haystack.includes(query);
    });

    return (
        <div className="mt-10 space-y-10">
            <Hero book={filteredBooks[0] || allBooks[0]} />
            <Row title="Results" books={filteredBooks} />
            <Row title="Trending Now" books={allBooks} />
        </div>
    );
}
