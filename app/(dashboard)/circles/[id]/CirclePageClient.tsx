"use client";

import { useMemo, useState } from "react";
import {
    attachCircleBook,
    createCircleProgressUpdate,
    inviteCircleMember,
    type AcceptedConnectionUser,
    type Circle,
    type CircleBook,
    type CircleMember,
    type CircleProgressUpdate,
    type SelectableLibraryBook,
} from "@/lib/api";

interface Props {
    circle: Circle;
    members: CircleMember[];
    books: CircleBook[];
    progress: CircleProgressUpdate[];
    acceptedConnections: AcceptedConnectionUser[];
    selectableBooks: SelectableLibraryBook[];
}

export default function CirclePageClient({
    circle,
    members: initialMembers,
    books: initialBooks,
    progress: initialProgress,
    acceptedConnections,
    selectableBooks,
}: Props) {
    const [members, setMembers] = useState<CircleMember[]>(initialMembers);
    const [books, setBooks] = useState<CircleBook[]>(initialBooks);
    const [progress, setProgress] = useState<CircleProgressUpdate[]>(initialProgress);

    const [selectedConnectionId, setSelectedConnectionId] = useState("");
    const [selectedLibraryItemIdForBook, setSelectedLibraryItemIdForBook] = useState("");
    const [selectedCircleBookId, setSelectedCircleBookId] = useState("");
    const [selectedLibraryItemIdForProgress, setSelectedLibraryItemIdForProgress] = useState("");
    const [note, setNote] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const selectedLibraryBookForAttach = useMemo(() => {
        const libraryItemId = Number(selectedLibraryItemIdForBook);
        if (!Number.isFinite(libraryItemId)) return null;

        return (
            selectableBooks.find((item) => item.id === libraryItemId) ?? null
        );
    }, [selectableBooks, selectedLibraryItemIdForBook]);

    const selectedLibraryItemForProgress = useMemo(() => {
        const libraryItemId = Number(selectedLibraryItemIdForProgress);
        if (!Number.isFinite(libraryItemId)) return null;

        return (
            selectableBooks.find((item) => item.id === libraryItemId) ?? null
        );
    }, [selectableBooks, selectedLibraryItemIdForProgress]);

    const inviteableConnections = useMemo(() => {
        const existingUserIds = new Set(
            members
                .filter((member) => member.status !== "removed")
                .map((member) => member.user.id),
        );

        return acceptedConnections.filter((user) => !existingUserIds.has(user.id));
    }, [acceptedConnections, members]);

    const handleInvite = async () => {
        setMessage(null);

        const userId = Number(selectedConnectionId);
        if (!Number.isFinite(userId)) {
            setMessage("Select a connection to invite.");
            return;
        }

        try {
            const created = await inviteCircleMember(circle.id, userId);
            setMembers((prev) => [...prev, created]);
            setSelectedConnectionId("");
            setMessage("Member invited.");
        } catch {
            setMessage("Failed to invite member.");
        }
    };

    const handleAttachBook = async () => {
        setMessage(null);

        if (!selectedLibraryBookForAttach) {
            setMessage("Select a library book first.");
            return;
        }

        try {
            const created = await attachCircleBook(circle.id, {
                book_id: selectedLibraryBookForAttach.book.id,
            });
            setBooks((prev) => [...prev, created]);
            setSelectedLibraryItemIdForBook("");
            setMessage("Book attached to circle.");
        } catch {
            setMessage("Failed to attach book.");
        }
    };

    const handlePostProgress = async () => {
        setMessage(null);

        const circleBookId = Number(selectedCircleBookId);
        const libraryItemId = Number(selectedLibraryItemIdForProgress);

        if (!Number.isFinite(circleBookId)) {
            setMessage("Select a circle book.");
            return;
        }

        if (!Number.isFinite(libraryItemId)) {
            setMessage("Select one of your library books.");
            return;
        }

        try {
            const created = await createCircleProgressUpdate(circle.id, {
                circle_book_id: circleBookId,
                library_item_id: libraryItemId,
                note: note || null,
                visibility: "circle",
            });

            setProgress((prev) => [created, ...prev]);
            setSelectedCircleBookId("");
            setSelectedLibraryItemIdForProgress("");
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

                    <div className="mt-4 space-y-2">
                        <select
                            value={selectedConnectionId}
                            onChange={(event) => setSelectedConnectionId(event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        >
                            <option value="">Select accepted connection</option>
                            {inviteableConnections.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.full_name} ({user.email})
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={handleInvite}
                            disabled={!selectedConnectionId}
                            className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-70"
                        >
                            Invite member
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="text-lg font-semibold text-white">Circle books</h2>

                    <div className="mt-4 space-y-3">
                        {books.map((item) => (
                            <div key={item.id} className="rounded-xl border border-white/10 p-3">
                                <p className="text-white">{item.book.title}</p>
                                <p className="text-xs text-white/50">{item.status}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 space-y-2">
                        <select
                            value={selectedLibraryItemIdForBook}
                            onChange={(event) => setSelectedLibraryItemIdForBook(event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        >
                            <option value="">Select from your library</option>
                            {selectableBooks.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.book.title} — {item.progress}% ({item.status})
                                </option>
                            ))}
                        </select>

                        {selectedLibraryBookForAttach ? (
                            <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/65">
                                <p>{selectedLibraryBookForAttach.book.title}</p>
                                <p className="mt-1">
                                    Progress: {selectedLibraryBookForAttach.progress}% • Page{" "}
                                    {selectedLibraryBookForAttach.current_page ?? "-"}
                                </p>
                            </div>
                        ) : null}

                        <button
                            type="button"
                            onClick={handleAttachBook}
                            disabled={!selectedLibraryItemIdForBook}
                            className="rounded-xl bg-white px-4 py-2 text-sm text-black disabled:opacity-70"
                        >
                            Attach book
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <h2 className="text-lg font-semibold text-white">Share progress</h2>

                    <div className="mt-4 space-y-3">
                        <select
                            value={selectedCircleBookId}
                            onChange={(event) => setSelectedCircleBookId(event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        >
                            <option value="">Select circle book</option>
                            {books.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.book.title}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedLibraryItemIdForProgress}
                            onChange={(event) => setSelectedLibraryItemIdForProgress(event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        >
                            <option value="">Select your library progress source</option>
                            {selectableBooks.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.book.title} — {item.progress}% ({item.status})
                                </option>
                            ))}
                        </select>

                        {selectedLibraryItemForProgress ? (
                            <div className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/65">
                                <p>Progress: {selectedLibraryItemForProgress.progress}%</p>
                                <p>Current page: {selectedLibraryItemForProgress.current_page ?? "-"}</p>
                                <p>Bookmark page: {selectedLibraryItemForProgress.bookmark_page ?? "-"}</p>
                            </div>
                        ) : null}

                        <textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Add accountability note"
                            className="min-h-24 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                        />

                        <button
                            type="button"
                            onClick={handlePostProgress}
                            disabled={!selectedCircleBookId || !selectedLibraryItemIdForProgress}
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
                            {item.note ? (
                                <p className="mt-2 text-sm text-white/80">{item.note}</p>
                            ) : null}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}