// components/Row.tsx
import BookCard from "./BookCard";
import { Book } from "@/lib/types";

interface RowProps {
  title: string;
  books: Book[];
}

export default function Row({ title, books }: RowProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight text-white/90">
        {title}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 pr-2">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}