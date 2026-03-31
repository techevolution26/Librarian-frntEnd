"use client";

import { useMemo } from "react";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { useDashboardSearch } from "@/store/useDashboardSearch";
import type { Book } from "@/lib/types";

interface HomeDashboardClientProps {
  allBooks: Book[];
}

export default function HomeDashboardClient({
  allBooks,
}: HomeDashboardClientProps) {
  const query = useDashboardSearch((state) => state.query);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return allBooks;

    return allBooks.filter((book) => {
      const haystack =
        `${book.title} ${book.author} ${book.description} ${book.genre?.join(" ") ?? ""}`.toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [allBooks, query]);

  const featuredBook = filteredBooks[0] ?? allBooks[0];
  const trendingBooks = filteredBooks.slice(0, 8);
  const newReleases = filteredBooks.slice(0, 6);
  const continueReading = filteredBooks.slice(0, 4);

  return (
    <>
      <Hero book={featuredBook} />

      <div className="mt-10 space-y-10">
        <Row title="Trending Now" books={trendingBooks} limit={8} />
        <Row title="New Releases" books={newReleases} limit={6} />
        <Row title="Continue Reading" books={continueReading} limit={4} />
      </div>
    </>
  );
}