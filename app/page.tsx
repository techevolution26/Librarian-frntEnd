import HomePageClient from "@/components/home/HomePageClient";
import { getBooks, getFeaturedBook, getTrendingBooks } from "@/lib/api";
import type { Book } from "@/lib/types";

export default async function Home() {
  let books: Book[] = [];
  let trendingBooks: Book[] = [];
  let featuredBook: Book | null = null;
  let isServiceUnavailable = false;

  try {
    const [allBooks, featured, trending] = await Promise.all([
      getBooks(),
      getFeaturedBook(),
      getTrendingBooks(12),
    ]);

    books = allBooks;
    featuredBook = featured;
    trendingBooks = trending;
  } catch (error) {
    isServiceUnavailable = true;
  }

  return (
    <HomePageClient
      books={books}
      featuredBook={featuredBook}
      trendingBooks={trendingBooks}
      isServiceUnavailable={isServiceUnavailable}
    />
  );
}