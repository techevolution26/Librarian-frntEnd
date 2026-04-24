"use client";

import { useMemo, useState } from "react";
import {
  ApiError,
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

function getProgressBookTitle(item: CircleProgressUpdate): string {
  if ("book_title" in item && typeof item.book_title === "string") {
    return item.book_title;
  }

  if (
    "circle_book" in item &&
    item.circle_book &&
    typeof item.circle_book === "object" &&
    "book" in item.circle_book &&
    item.circle_book.book &&
    typeof item.circle_book.book === "object" &&
    "title" in item.circle_book.book &&
    typeof item.circle_book.book.title === "string"
  ) {
    return item.circle_book.book.title;
  }

  return "Book";
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

    return selectableBooks.find((item) => item.id === libraryItemId) ?? null;
  }, [selectableBooks, selectedLibraryItemIdForBook]);

  const selectedLibraryItemForProgress = useMemo(() => {
    const libraryItemId = Number(selectedLibraryItemIdForProgress);
    if (!Number.isFinite(libraryItemId)) return null;

    return selectableBooks.find((item) => item.id === libraryItemId) ?? null;
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
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.detail ?? "Failed to invite member.");
      } else {
        setMessage("Failed to invite member.");
      }
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
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.detail ?? "Failed to attach book.");
      } else {
        setMessage("Failed to attach book.");
      }
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
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.detail ?? "Failed to share progress.");
      } else {
        setMessage("Failed to share progress.");
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 sm:rounded-[2rem] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {circle.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
              {circle.description || "Private reading circle"}
            </p>
          </div>

          <div className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/45">
            {circle.visibility}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:gap-6 xl:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Members</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
              {members.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-3"
                >
                  <p className="text-sm font-medium text-white">
                    {member.user.full_name}
                  </p>
                  <p className="mt-1 text-xs text-white/50">
                    {member.role} • {member.status}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-4 text-sm text-white/45">
                No members yet.
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <select
              value={selectedConnectionId}
              onChange={(event) => setSelectedConnectionId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white outline-none"
            >
              <option value="" className="bg-neutral-900 text-white">
                Select accepted connection
              </option>
              {inviteableConnections.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                  className="bg-neutral-900 text-white"
                >
                  {user.full_name} ({user.email})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleInvite}
              disabled={!selectedConnectionId}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black disabled:opacity-70"
            >
              Invite member
            </button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Circle books</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
              {books.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {books.length > 0 ? (
              books.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-3"
                >
                  <p className="text-sm font-medium text-white">
                    {item.book.title}
                  </p>
                  <p className="mt-1 text-xs text-white/50">{item.status}</p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-4 text-sm text-white/45">
                No books attached yet.
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <select
              value={selectedLibraryItemIdForBook}
              onChange={(event) => setSelectedLibraryItemIdForBook(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white outline-none"
            >
              <option value="" className="bg-neutral-900 text-white">
                Select from your library
              </option>
              {selectableBooks.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  className="bg-neutral-900 text-white"
                >
                  {item.book.title} — {item.progress}% ({item.status})
                </option>
              ))}
            </select>

            {selectedLibraryBookForAttach ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/65">
                <p className="font-medium text-white">
                  {selectedLibraryBookForAttach.book.title}
                </p>
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
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black disabled:opacity-70"
            >
              Attach book
            </button>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Share progress</h2>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
              Note only
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <select
              value={selectedCircleBookId}
              onChange={(event) => setSelectedCircleBookId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white outline-none"
            >
              <option value="" className="bg-neutral-900 text-white">
                Select circle book
              </option>
              {books.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  className="bg-neutral-900 text-white"
                >
                  {item.book.title}
                </option>
              ))}
            </select>

            <select
              value={selectedLibraryItemIdForProgress}
              onChange={(event) =>
                setSelectedLibraryItemIdForProgress(event.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-3 py-3 text-sm text-white outline-none"
            >
              <option value="" className="bg-neutral-900 text-white">
                Select your library progress source
              </option>
              {selectableBooks.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  className="bg-neutral-900 text-white"
                >
                  {item.book.title} — {item.progress}% ({item.status})
                </option>
              ))}
            </select>

            {selectedLibraryItemForProgress ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-white/65">
                <p className="font-medium text-white">
                  {selectedLibraryItemForProgress.book.title}
                </p>
                <p className="mt-1">
                  Progress: {selectedLibraryItemForProgress.progress}%
                </p>
                <p>
                  Current page: {selectedLibraryItemForProgress.current_page ?? "-"}
                </p>
                <p>
                  Bookmark page:{" "}
                  {selectedLibraryItemForProgress.bookmark_page ?? "-"}
                </p>
              </div>
            ) : null}

            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add accountability note"
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/40"
            />

            <button
              type="button"
              onClick={handlePostProgress}
              disabled={!selectedCircleBookId || !selectedLibraryItemIdForProgress}
              className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black disabled:opacity-70"
            >
              Post update
            </button>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
          {message}
        </div>
      ) : null}

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-white">Progress feed</h2>
          <span className="text-xs uppercase tracking-[0.16em] text-white/40">
            Latest updates
          </span>
        </div>

        <div className="mt-4 grid gap-3">
          {progress.length > 0 ? (
            progress.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {item.user.full_name}
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/85">
                      {getProgressBookTitle(item)}
                    </p>
                  </div>

                  <div className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                    {item.progress_percent}% • Page {item.current_page ?? "-"}
                  </div>
                </div>

                {item.note ? (
                  <p className="mt-3 text-sm leading-6 text-white/75">
                    {item.note}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-5 text-sm text-white/45">
              No progress updates yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}