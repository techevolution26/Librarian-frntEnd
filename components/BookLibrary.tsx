"use client";

import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { useDashboardSearch } from "@/store/useDashboardSearch";

interface Book {
    title: string;
    author: string;
    description: string;
    genre?: string[];
}

export default function BookLibrary({ allBooks }: { allBooks: Book[] }) {
    const query = useDashboardSearch((state) => state.query).toLowerCase();

    const filteredBooks = allBooks.filter((book) => {
        const haystack = `${book.title} ${book.author} ${book.description} ${book.genre?.join(" ") ?? ""}`.toLowerCase();
        return haystack.includes(query);
    });

    // Use the filtered list for your rows
    return (
        <div className="mt-10 space-y-10">
            <Hero book={filteredBooks[0] || allBooks[0]} />
            <Row title="Results" books={filteredBooks} />
            <Row title="Trending Now" books={allBooks} />
        </div>
    );
}
