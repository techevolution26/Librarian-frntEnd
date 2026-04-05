import HomePageClient from "@/components/home/HomePageClient";
import { getBooks } from "@/lib/api";
import type { Book } from "@/lib/types";

export default async function Home() {
  let books: Book[] = [];
  let isServiceUnavailable = false;

  try {
    books = await getBooks();
  } catch (error) {
    isServiceUnavailable = true;
  }

  return (
    <HomePageClient
      books={books}
      isServiceUnavailable={isServiceUnavailable}
    />
  );
}
