import Link from "next/link";
import Image from "next/image";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`} className="group block min-w-[160px]">
      <article className="transition-transform duration-200 group-hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg ring-1 ring-white/5">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            sizes="160px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="line-clamp-1 text-sm font-medium text-white transition group-hover:text-white/90">
            {book.title}
          </h3>
          <p className="line-clamp-1 text-xs text-white/60">{book.author}</p>
        </div>
      </article>
    </Link>
  );
}