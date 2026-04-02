// app/page.tsx
import { getBooks } from "@/lib/api";
import HomePageClient from "@/components/home/HomePageClient";

export default async function Home() {
  const books = await getBooks();
  
  const transformedBooks = books.map(book => ({
    ...book,
    id: String(book.id),
  }));

  return <HomePageClient books={transformedBooks} />;
}