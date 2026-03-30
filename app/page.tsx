import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { books } from "@/lib/data";

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <Hero book={books[0]} />

      <Row title="Trending" books={books} />
      <Row title="New Releases" books={books} />
      <Row title="Continue Reading" books={books} />
    </div>
  );
}