import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { books } from "@/lib/data";

export default function Home() {
  const featuredBook = books[0];
  const trendingBooks = books;
  const newReleases = books;
  const continueReading = books;

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />

      <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <Hero book={featuredBook} />

        <div className="mt-10 space-y-10">
          <Row title="Trending Now" books={trendingBooks} />
          <Row title="New Releases" books={newReleases} />
          <Row title="Continue Reading" books={continueReading} />
        </div>
      </section>
    </main>
  );
}