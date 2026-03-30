import { books } from "@/lib/data";
import BookCard from "@/components/BookCard";

export default function Library() {
    return (
        <div>
            <h1 className="text-2xl mb-4">Your Library</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {books.map((b) => (
                    <BookCard key={b.id} book={b} />
                ))}
            </div>
        </div>
    );
}