import { books } from "@/lib/data";
import Hero from "@/components/Hero";
import Row from "@/components/Row";

export default function Home() {
  return (
    <>
      <Hero book={books[0]} />
      <Row title="Trending" books={books} />
      <Row title="New Releases" books={books} />
    </>
  );
}