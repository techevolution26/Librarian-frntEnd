"use client";

import { useState } from "react";
import {
    attachCircleBook,
    createCircleProgressUpdate,
    inviteCircleMember,
    type Circle,
    type CircleBook,
    type CircleMember,
    type CircleProgressUpdate,
} from "@/lib/api";

interface Props {
    circle: Circle;
    members: CircleMember[];
    books: CircleBook[];
    progress: CircleProgressUpdate[];
}

export default function CirclePageClient({
    circle,
    members: initialMembers,
    books: initialBooks,
    progress: initialProgress,
}: Props) {
    const [members, setMembers] = useState<CircleMember[]>(initialMembers);
    const [books, setBooks] = useState<CircleBook[]>(initialBooks);
    const [progress, setProgress] = useState<CircleProgressUpdate[]>(initialProgress);

    const [inviteUserId, setInviteUserId] = useState("");
    const [bookId, setBookId] = useState("");
    const [progressPercent, setProgressPercent] = useState("");
    const [currentPage, setCurrentPage] = useState("");
    const [note, setNote] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const handleInvite = async () => {
        setMessage(null);
        try {
            const created = await inviteCircleMember(circle.id, Number(inviteUserId));
            setMembers((prev) => [...prev, created]);
            setInviteUserId("");
            setMessage("Member invited.");
        } catch {
            setMessage("Failed to invite member.");
        }
    };

    const handleAttachBook = async () => {
        setMessage(null);
        try {
            const created = await attachCircleBook(circle.id, {
                book_id: Number(bookId),
            });
            setBooks((prev) => [...prev, created]);
            setBookId("");
            setMessage("Book attached.");
        } catch {
            setMessage("Failed to attach book.");
        }
    };

    const handlePostProgress = async () => {
        setMessage(null);
        try {
            const created = await createCircleProgressUpdate(circle.id, {
                progress_percent: Number(progressPercent),
                current_page: currentPage ? Number(currentPage) : null,
                note: note || null,
                visibility: "circle",
            });
            setProgress((prev) => [created, ...prev]);
            setProgressPercent("");
            setCurrentPage("");
            setNote("");
            setMessage("Progress shared.");
        } catch {
            setMessage("Failed to share progress.");
        }
    };

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <h1 className="text-3xl font-semibold text-white">{circle.name}</h1>
                <p className="mt-2 text-sm text-white/60">
                    {circle.description || "Private reading circle"}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/40">
                    {circle.visibility}
                </p>
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="text-lg font-semibold text-white">Members</h2>
                    <div className="mt-4 space-y-3">
                        {members.map((member) => (
                            <div key={member.id} className="rounded-xl border border-white/10 p-3">
                                <p className="text-white">{member.user.full_name}</p>
                                <p className="text-xs text-white/50">
                                    {member.role} • {member.status}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <input
                            value={inviteUserId}
                            onChange={(event) => setInviteUserId(event.target.value)}
                            placeholder="User ID"
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleInvite}
                            disabled={!inviteUserId.trim()}
                            className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-70"
                        >
                            Invite
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="text-lg font-semibold text-white">Books</h2>
                    <div className="mt-4 space-y-3">
                        {books.map((item) => (
                            <div key={item.id} className="rounded-xl border border-white/10 p-3">
                                <p className="text-white">{item.book.title}</p>
                                <p className="text-xs text-white/50">{item.status}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                        <input
                            value={bookId}
                            onChange={(event) => setBookId(event.target.value)}
                            placeholder="Book ID"
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        />
                        <button
                            type="button"
                            onClick={handleAttachBook}
                            disabled={!bookId.trim()}
                            className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-70"
                        >
                            Attach
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="text-lg font-semibold text-white">Share progress</h2>

                    <div className="mt-4 space-y-3">
                        <input
                            value={progressPercent}
                            onChange={(event) => setProgressPercent(event.target.value)}
                            placeholder="Progress %"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        />
                        <input
                            value={currentPage}
                            onChange={(event) => setCurrentPage(event.target.value)}
                            placeholder="Current page"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        />
                        <textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Accountability note"
                            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        />
                        <button
                            type="button"
                            onClick={handlePostProgress}
                            disabled={!progressPercent.trim()}
                            className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-70"
                        >
                            Post update
                        </button>
                    </div>
                </div>
            </section>

            {message ? <p className="text-sm text-white/60">{message}</p> : null}

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-lg font-semibold text-white">Progress feed</h2>
                <div className="mt-4 space-y-3">
                    {progress.map((item) => (
                        <div key={item.id} className="rounded-xl border border-white/10 p-4">
                            <p className="font-medium text-white">{item.user.full_name}</p>
                            <p className="mt-1 text-sm text-white/60">
                                {item.progress_percent}% • Page {item.current_page ?? "-"}
                            </p>
                            {item.note ? <p className="mt-2 text-sm text-white/80">{item.note}</p> : null}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}