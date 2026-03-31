import Link from "next/link";
import Image from "next/image";
import { Book } from "@/lib/types";

type BookCardSize = "sm" | "md" | "lg";

interface BookCardProps {
  book: Book;
  size?: BookCardSize;
}

const sizeStyles: Record<
  BookCardSize,
  {
    widthClass: string;
    imageSizes: string;
    titleClass: string;
    authorClass: string;
  }
> = {
  sm: {
    widthClass: "min-w-[120px]",
    imageSizes: "120px",
    titleClass: "text-xs",
    authorClass: "text-[11px]",
  },
  md: {
    widthClass: "min-w-[160px]",
    imageSizes: "160px",
    titleClass: "text-sm",
    authorClass: "text-xs",
  },
  lg: {
    widthClass: "min-w-[200px]",
    imageSizes: "200px",
    titleClass: "text-base",
    authorClass: "text-sm",
  },
};

export default function BookCard({ book, size = "md" }: BookCardProps) {
  const styles = sizeStyles[size];

  return (
    <Link href={`/book/${book.id}`} className={`group block ${styles.widthClass}`}>
      <article className="transition-transform duration-200 group-hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg ring-1 ring-white/5">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            sizes={styles.imageSizes}
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>

        <div className="mt-3 space-y-1">
          <h3 className={`${styles.titleClass} line-clamp-1 font-medium text-white transition group-hover:text-white/90`}>
            {book.title}
          </h3>
          <p className={`${styles.authorClass} line-clamp-1 text-white/60`}>
            {book.author}
          </p>
        </div>
      </article>
    </Link>
  );
}