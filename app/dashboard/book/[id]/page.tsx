import { books } from "@/lib/data";

export default function Book({ params }: any) {
  const book = books.find((b) => b.id === params.id);

  if (!book) return <div>Not found</div>;

  return (
    <div>
      <img src={book.cover} className="w-40 rounded" />
      <h1 className="text-3xl mt-4">{book.title}</h1>
      <p>{book.description}</p>
      <a href={`/reader/${book.id}`} className="underline mt-4 block">
        Start Reading
      </a>
    </div>
  );
}