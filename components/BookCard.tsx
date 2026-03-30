// components/BookCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/dashboard/book/${book.id}`} className="group min-w-[160px]">
      <article className="transition-transform duration-200 group-hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-lg">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>

        <h3 className="mt-2 line-clamp-1 text-sm font-medium text-white">
          {book.title}
        </h3>
        <p className="line-clamp-1 text-xs text-white/60">{book.author}</p>
      </article>
    </Link>
  );
}