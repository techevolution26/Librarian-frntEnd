// components/home/HomePageClient.tsx
"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import type { Book } from "@/lib/types";

interface HomePageClientProps {
  books: Book[];
}

export default function HomePageClient({ books }: HomePageClientProps) {
  const [searchValue, setSearchValue] = useState("");

  const filteredBooks = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return books;

    return books.filter((book) => {
      const haystack =
        `${book.title} ${book.author} ${book.description} ${book.genre?.join(" ") ?? ""}`.toLowerCase();

      return haystack.includes(query);
    });
  }, [books, searchValue]);

  const featuredBook = filteredBooks[0] ?? books[0];
  const trendingBooks = filteredBooks;
  const newReleases = [...filteredBooks]
    .sort((a, b) => Number(b.id) - Number(a.id));
  const continueReading = filteredBooks.slice(0, 4);

  if (!books.length) {
    return (
      <main id="main-content" className="min-h-screen">
        <Navbar searchValue={searchValue} onSearchChange={setSearchValue} />
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-10 text-sm text-white/60">
            No books are available yet.
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />

      <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <Hero book={featuredBook} />

        <div className="mt-10 space-y-10">
          <Row
            title="Trending Now"
            books={trendingBooks}
            limit={8}
            viewAllHref="/discover?sort=Top%20Rated"
            variant="large"
          />

          <Row
            title="New Releases"
            books={newReleases}
            limit={6}
            viewAllHref="/discover?sort=Newest"
            variant="compact"
          />

          <Row
            title="Continue Reading"
            books={continueReading}
            limit={4}
            viewAllHref="/library"
            variant="editorial"
          />
        </div>
      </section>
    </main>
  );
}