import { books } from "@/lib/data";
import BookCard from "@/components/BookCard";
import type { Book } from "@/lib/types";

const genres = ["All", "Productivity", "Business", "Mindset", "Fiction", "Design"];
const sortOptions = ["Recommended", "Top Rated", "Newest", "Most Saved"];

function FilterChip({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={[
        "rounded-full border px-4 py-2 text-sm transition",
        active
          ? "border-white/20 bg-white text-black"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function DiscoverSection({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: Book[];
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-white/55">{subtitle}</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 pr-2">
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

export default function Discover() {
  const recommended = books.slice(0, 6);
  const trending = books.slice(0, 6);
  const newArrivals = books.slice(0, 6);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Discover books
        </p>
        <div className="mt-3 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Discover
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
            Browse curated books by genre, popularity, and freshness. This page
            is built for exploration, not just a flat grid.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="flex flex-wrap items-center gap-3">
          {genres.map((genre, index) => (
            <FilterChip key={genre} active={index === 0}>
              {genre}
            </FilterChip>
          ))}

          <div className="ml-auto flex flex-wrap gap-2">
            {sortOptions.map((option, index) => (
              <FilterChip key={option} active={index === 0}>
                {option}
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-white/60">Available books</p>
          <p className="mt-2 text-3xl font-semibold">{books.length}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-white/60">Top rated</p>
          <p className="mt-2 text-3xl font-semibold">12</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-white/60">New this week</p>
          <p className="mt-2 text-3xl font-semibold">6</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm text-white/60">Categories</p>
          <p className="mt-2 text-3xl font-semibold">18</p>
        </div>
      </section>

      <div className="space-y-10">
        <DiscoverSection
          title="Recommended for You"
          subtitle="A personalized shelf based on recent reading behavior."
          items={recommended}
        />
        <DiscoverSection
          title="Trending Now"
          subtitle="What readers are saving and opening right now."
          items={trending}
        />
        <DiscoverSection
          title="New Arrivals"
          subtitle="Fresh titles recently added to the platform."
          items={newArrivals}
        />
      </div>
    </div>
  );
}