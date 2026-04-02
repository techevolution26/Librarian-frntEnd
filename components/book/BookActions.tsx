"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToLibrary, startReading } from "@/lib/api";

interface BookActionsProps {
  bookId: number;
}

export default function BookActions({ bookId }: BookActionsProps) {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddToLibrary = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      await addToLibrary(bookId, "reading");
      setMessage("Added to library.");
      router.refresh();
    } catch {
      setMessage("Failed to add to library.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveForLater = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      await addToLibrary(bookId, "saved");
      setMessage("Saved for later.");
      router.refresh();
    } catch {
      setMessage("Failed to save book.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartReading = async () => {
    setIsStarting(true);
    setMessage(null);

    try {
      await startReading(bookId);
      router.push(`/reader/${bookId}`);
      router.refresh();
    } catch {
      setMessage("Failed to start reading.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleStartReading}
        disabled={isStarting}
        className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isStarting ? "Opening..." : "Start Reading"}
      </button>

      <button
        type="button"
        onClick={handleAddToLibrary}
        disabled={isSaving}
        className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSaving ? "Saving..." : "Add to Library"}
      </button>

      <button
        type="button"
        onClick={handleSaveForLater}
        disabled={isSaving}
        className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
      >
        Save for Later
      </button>

      {message ? (
        <p className="basis-full text-sm text-white/60">{message}</p>
      ) : null}
    </div>
  );
}