'use client';

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { books } from "@/lib/data";

export default function Home() {

  const [searchValue, setSearchValue] = useState("");

  const filteredBooks = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return books;

    return books.filter((book) => {
      const haystack =
        `${book.title} ${book.author} ${book.description} ${book.genre?.join(" ") ?? ""}`.toLowerCase();

      return haystack.includes(query);
    });
  }, [searchValue]);

  const featuredBook = filteredBooks[0] || books[0];
  const trendingBooks = filteredBooks;
  const newReleases = filteredBooks;
  const continueReading = filteredBooks;

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
            viewAllHref="/discover?section=trending"
            variant="large"
          />

          <Row
            title="New Releases"
            books={newReleases}
            limit={6}
            viewAllHref="/discover?section=new"
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