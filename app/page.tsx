// app/page.tsx
import { getBooks } from "@/lib/api";
import HomePageClient from "@/components/home/HomePageClient";

export default async function Home() {
  const books = await getBooks();

  return <HomePageClient books={books} />;
}