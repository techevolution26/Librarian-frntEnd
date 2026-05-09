"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  adminArchiveBook,
  adminDeleteBook,
  adminRestoreBook,
  adminUpdateBookMetadata,
  adminUpdateBookPdf,
  adminUploadBookCover,
  adminFeatureBook,
  adminUnfeatureBook,
} from "@/lib/api";
import type { Book } from "@/lib/types";

interface Props {
  initialBook: Book;
}

export default function AdminBookEditClient({ initialBook }: Props) {
  const router = useRouter();

  const [book, setBook] = useState(initialBook);

  const [title, setTitle] = useState(initialBook.title);
  const [author, setAuthor] = useState(initialBook.author);
  const [cover, setCover] = useState(initialBook.cover);
  const [description, setDescription] = useState(initialBook.description);
  const [rating, setRating] = useState(String(initialBook.rating));
  const [pages, setPages] = useState(String(initialBook.pages));
  const [genreCsv, setGenreCsv] = useState(initialBook.genre?.join(", ") ?? "");
  const [visibility, setVisibility] = useState<"draft" | "published">(
    initialBook.visibility === "draft" ? "draft" : "published",
  );

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSaveMetadata() {
    setIsSaving(true);
    setMessage(null);

    try {
      const updated = await adminUpdateBookMetadata(book.id, {
        title,
        author,
        cover,
        description,
        rating: Number(rating),
        pages: Number(pages),
        genreCsv,
        visibility,
      });

      setBook(updated);
      setMessage("Book metadata saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save metadata.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUploadCover() {
    if (!coverFile) {
      setMessage("Choose a cover image first.");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const updated = await adminUploadBookCover(book.id, coverFile);
      setBook(updated);
      setCover(updated.cover);
      setCoverFile(null);
      setMessage("Cover uploaded.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to upload cover.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleReplacePdf() {
    if (!pdfFile) {
      setMessage("Choose a PDF file first.");
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const updated = await adminUpdateBookPdf(book.id, pdfFile);
      setBook(updated);
      setPdfFile(null);
      setMessage("PDF replaced.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to replace PDF.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleArchiveToggle() {
    setIsSaving(true);
    setMessage(null);

    try {
      const updated = book.archived_at
        ? await adminRestoreBook(book.id)
        : await adminArchiveBook(book.id);

      setBook(updated);
      setMessage(book.archived_at ? "Book restored." : "Book archived.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Archive action failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleFeatureToggle() {
    setIsSaving(true);
    setMessage(null);

    const isFeatured = (book as { is_featured?: boolean }).is_featured;

    try {
      const updated = isFeatured
        ? await adminUnfeatureBook(book.id)
        : await adminFeatureBook(book.id);

      const updatedIsFeatured = (updated as { is_featured?: boolean }).is_featured;
      setBook(updated);
      setMessage(updatedIsFeatured ? "Book is now featured." : "Book is no longer featured.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Feature action failed.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${book.title}" permanently? This cannot be undone.`,
    );

    if (!confirmed) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await adminDeleteBook(book.id);
      router.replace("/admin/books");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Manage book</h2>
          <p className="mt-1 text-sm text-white/55">
            Edit metadata, replace files, and control publication state.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/book/${book.id}`}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
          >
            View public page
          </Link>

          <Link
            href="/admin/books"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
          >
            Back to books
          </Link>
        </div>
      </div>

      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
          {message}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-xl font-semibold text-white">Metadata</h3>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <AdminInput label="Title" value={title} onChange={setTitle} />
            <AdminInput label="Author" value={author} onChange={setAuthor} />
            <AdminInput label="Rating" value={rating} onChange={setRating} />
            <AdminInput label="Pages" value={pages} onChange={setPages} />
            <AdminInput
              label="Genres CSV"
              value={genreCsv}
              onChange={setGenreCsv}
              placeholder="Business, Mindset, Productivity"
            />

            <div>
              <label className="mb-2 block text-sm text-white/70">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(event) =>
                  setVisibility(event.target.value as "draft" | "published")
                }
                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
              >
                <option value="draft" className="bg-neutral-900 text-white">
                  draft
                </option>
                <option value="published" className="bg-neutral-900 text-white">
                  published
                </option>
              </select>
            </div>

            <div className="md:col-span-2">
              <AdminInput label="Cover URL" value={cover} onChange={setCover} />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-white/70">
                Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-36 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveMetadata}
            disabled={isSaving}
            className="mt-5 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save metadata"}
          </button>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-semibold text-white">File assets</h3>

            <div className="mt-5 space-y-5">
              <div>
                <p className="text-sm text-white/60">Current source</p>
                <p className="mt-1 break-all text-sm text-white/85">
                  {book.source_url || "No source file"}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Replace PDF
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                />

                <button
                  type="button"
                  onClick={handleReplacePdf}
                  disabled={isSaving || !pdfFile}
                  className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 disabled:opacity-70"
                >
                  Replace PDF
                </button>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Upload cover image
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                />

                <button
                  type="button"
                  onClick={handleUploadCover}
                  disabled={isSaving || !coverFile}
                  className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 disabled:opacity-70"
                >
                  Upload cover
                </button>

              </div>
              <button
                type="button"
                onClick={handleFeatureToggle}
                disabled={
                  isSaving ||
                  visibility !== "published" ||
                  Boolean(book.archived_at)
                }
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {book.is_featured ? "Remove featured" : "Set as featured"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-medium text-white">Publication state</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                {visibility}
              </span>

              {book.is_featured ? (
                <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-yellow-100">
                  Featured
                </span>
              ) : null}

              {book.archived_at ? (
                <span className="rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-red-100">
                  Archived
                </span>
              ) : null}
            </div>
          </div>
          {/* danger zone */}
          <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-6">
            <h3 className="text-xl font-semibold text-white">Danger zone</h3>

            <p className="mt-2 text-sm text-white/60">
              Archive hides this book from normal catalog flows. Delete permanently
              removes it.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleArchiveToggle}
                disabled={isSaving}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 disabled:opacity-70"
              >
                {book.archived_at ? "Restore book" : "Archive book"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm text-red-100 disabled:opacity-70"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-white/70">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
      />
    </div>
  );
}