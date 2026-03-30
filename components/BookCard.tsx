import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <Link href={`/book/${book.id}`}>
      <div className="min-w-[150px] cursor-pointer">
        <img
          src={book.cover}
          className="rounded-lg hover:scale-105 transition"
        />
        <p className="text-white mt-2 text-sm">{book.title}</p>
      </div>
    </Link>
  );
}