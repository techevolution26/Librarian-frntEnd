import Hero from "@/components/Hero";
import Row from "@/components/Row";
import { books } from "@/lib/data";

export default function Home() {
  const featuredBook = books[0];
  const trendingBooks = books.slice(0, 6);
  const newReleases = books.slice(0, 6);
  const continueReading = books.slice(0, 4);

  return (
    <>
      <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <Hero book={featuredBook} />

        <aside className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Reading activity
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              12 books this month
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Keep your momentum going with curated picks and continue-reading
              shortcuts.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Streak
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-4xl font-semibold">7</span>
              <span className="pb-1 text-sm text-white/60">days active</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[72%] rounded-full bg-white" />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Suggested next
            </p>
            <h3 className="mt-2 text-lg font-medium">Deep Work</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">
              A strong fit based on your recent reading behavior.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/60">Books saved</p>
          <p className="mt-2 text-3xl font-semibold">48</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/60">Pages read</p>
          <p className="mt-2 text-3xl font-semibold">1,284</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/60">Reading streak</p>
          <p className="mt-2 text-3xl font-semibold">7 days</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-white/60">Avg rating</p>
          <p className="mt-2 text-3xl font-semibold">4.8</p>
        </div>
      </section>

      <section className="space-y-8">
        <Row title="Continue Reading" books={continueReading} />
        <Row title="Trending Now" books={trendingBooks} />
        <Row title="New Releases" books={newReleases} />
      </section>
    </>
  );
}