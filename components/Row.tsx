import Link from "next/link";
import BookCard from "./BookCard";
import { Book } from "@/lib/types";

type RowVariant = "compact" | "standard" | "large" | "editorial";

interface RowProps {
  title: string;
  books: Book[];
  limit?: number;
  viewAllHref?: string;
  showMoreLabel?: string;
  variant?: RowVariant;
}

const variantStyles: Record<
  RowVariant,
  {
    shelfGap: string;
    cardWidth: string;
    titleSize: string;
    subtitleClass: string;
    containerClass: string;
  }
> = {
  compact: {
    shelfGap: "gap-3",
    cardWidth: "min-w-[120px]",
    titleSize: "text-base",
    subtitleClass: "text-white/50",
    containerClass: "rounded-2xl border border-white/10 bg-white/[0.03] p-4",
  },
  standard: {
    shelfGap: "gap-4",
    cardWidth: "min-w-[160px]",
    titleSize: "text-lg",
    subtitleClass: "text-white/55",
    containerClass: "",
  },
  large: {
    shelfGap: "gap-5",
    cardWidth: "min-w-[190px]",
    titleSize: "text-xl",
    subtitleClass: "text-white/60",
    containerClass: "rounded-[2rem] border border-white/10 bg-white/[0.03] p-5",
  },
  editorial: {
    shelfGap: "gap-6",
    cardWidth: "min-w-[220px]",
    titleSize: "text-2xl",
    subtitleClass: "text-white/65",
    containerClass:
      "rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6",
  },
};

export default function Row({
  title,
  books,
  limit = 6,
  viewAllHref,
  showMoreLabel = "View all",
  variant = "standard",
}: RowProps) {
  const visibleBooks = books.slice(0, limit);
  const styles = variantStyles[variant];

  return (
    <section className={styles.containerClass || "space-y-4"}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className={`${styles.titleSize} font-semibold tracking-tight text-white/90`}>
            {title}
          </h2>
          {variant === "editorial" ? (
            <p className={`mt-1 text-sm ${styles.subtitleClass}`}>
              Curated picks with a more magazine-like presentation.
            </p>
          ) : null}
        </div>

        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-sm text-white/55 transition hover:text-white"
          >
            {showMoreLabel}
          </Link>
        ) : null}
      </div>

      <div className={`flex ${styles.shelfGap} overflow-x-auto pb-2 pr-2`}>
        {visibleBooks.map((book) => (
          <div key={book.id} className={styles.cardWidth}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}