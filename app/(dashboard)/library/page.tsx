import { books } from "@/lib/data";
import BookCard from "@/components/BookCard";
import type { Book } from "@/lib/types";

const savedBooks = books.slice(0, 8);
const readingBooks = books.slice(0, 4);
const finishedBooks = books.slice(0, 3);

function StatCard({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint: string;
}) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {value}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/60">{hint}</p>
        </div>
    );
}

function Shelf({
    title,
    books,
    emptyLabel,
}: {
    title: string;
    books: Book[];
    emptyLabel: string;
}) {
    return (
        <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white">
                        {title}
                    </h2>
                    <p className="mt-1 text-sm text-white/55">{emptyLabel}</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                    {books.length} books
                </span>
            </div>

            {books.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2 pr-2">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-sm text-white/50">
                    No books in this section yet.
                </div>
            )}
        </section>
    );
}

export default function Library() {
    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),linear-gradient(to_bottom_right,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl sm:p-8">
                <div className="max-w-3xl">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        Personal library
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                        Your Library
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                        Track what you have saved, what you are reading, and what you have
                        finished — all in one clean dashboard.
                    </p>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Saved books"
                    value="48"
                    hint="Books added to your collection."
                />
                <StatCard
                    label="Currently reading"
                    value="12"
                    hint="Active books with reading progress."
                />
                <StatCard
                    label="Finished this month"
                    value="9"
                    hint="Completed reads in the last 30 days."
                />
                <StatCard
                    label="Average rating"
                    value="4.8"
                    hint="How much you are enjoying your reads."
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Reading progress
                    </p>
                    <div className="mt-4 space-y-4">
                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                                <span>Atomic Habits</span>
                                <span>78%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-[78%] rounded-full bg-white/80" />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                                <span>Deep Work</span>
                                <span>42%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-[42%] rounded-full bg-white/60" />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                                <span>The Psychology of Money</span>
                                <span>91%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                <div className="h-full w-[91%] rounded-full bg-white" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Reading insights
                    </p>
                    <ul className="mt-4 space-y-4 text-sm text-white/70">
                        <li className="flex items-start justify-between gap-4">
                            <span>Longest streak</span>
                            <span className="font-medium text-white">7 days</span>
                        </li>
                        <li className="flex items-start justify-between gap-4">
                            <span>Most read genre</span>
                            <span className="font-medium text-white">Productivity</span>
                        </li>
                        <li className="flex items-start justify-between gap-4">
                            <span>Pages read</span>
                            <span className="font-medium text-white">1,284</span>
                        </li>
                    </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Quick actions
                    </p>
                    <div className="mt-4 flex flex-col gap-3">
                        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
                            Continue reading
                        </button>
                        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
                            Add a new book
                        </button>
                        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/85 transition hover:bg-white/10">
                            View finished books
                        </button>
                    </div>
                </div>
            </section>

            <div className="space-y-10">
                <Shelf
                    title="Currently Reading"
                    books={readingBooks}
                    emptyLabel="Books you are actively reading right now."
                />
                <Shelf
                    title="Saved for Later"
                    books={savedBooks}
                    emptyLabel="Books you have bookmarked or want to start."
                />
                <Shelf
                    title="Finished"
                    books={finishedBooks}
                    emptyLabel="Books you have completed."
                />
            </div>
        </div>
    );
}