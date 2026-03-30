import BookCard from "./BookCard";

export default function Row({ title, books }) {
  return (
    <div className="px-6 mt-6">
      <h2 className="text-white text-xl mb-3">{title}</h2>
      <div className="flex gap-4 overflow-x-scroll scrollbar-hide">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}