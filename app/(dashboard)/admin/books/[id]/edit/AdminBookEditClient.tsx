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
      setMessage(updated.archived_at ? "Book archived." : "Book restored.");
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
    <div className="w-full space-y-6 pb-24 sm:pb-12">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/80 shadow-2xl">
        <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-100">
                admin.book.manage
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                Manage book
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                Edit metadata, replace source files, control visibility, and manage
                featured placement for this catalog item.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/book/${book.id}`}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                View public page
              </Link>

              <Link
                href="/admin/books"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
              >
                Back to books
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatusMetric label="Book ID" value={`#${book.id}`} />
            <StatusMetric label="Visibility" value={visibility} />
            <StatusMetric
              label="Featured"
              value={book.is_featured ? "yes" : "no"}
              tone={book.is_featured ? "featured" : "default"}
            />
            <StatusMetric
              label="Archive"
              value={book.archived_at ? "archived" : "active"}
              tone={book.archived_at ? "danger" : "success"}
            />
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
          {message}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-100/60">
                  metadata.json
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Catalog metadata
                </h3>
                <p className="mt-1 text-sm text-white/55">
                  These fields control public catalog display, search, and ranking.
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-xs text-white/40">
                editable
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <AdminInput label="Title" value={title} onChange={setTitle} />
              <AdminInput label="Author" value={author} onChange={setAuthor} />
              <AdminInput label="Rating" value={rating} onChange={setRating} />
              <AdminInput label="Pages" value={pages} onChange={setPages} />

              <div className="md:col-span-2">
                <AdminInput
                  label="Genres CSV"
                  value={genreCsv}
                  onChange={setGenreCsv}
                  placeholder="Business, Mindset, Productivity"
                />
              </div>

              <div className="md:col-span-2">
                <AdminInput
                  label="Cover URL"
                  value={cover}
                  onChange={setCover}
                  placeholder="/book-placeholder.jpg or https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(event) =>
                    setVisibility(event.target.value as "draft" | "published")
                  }
                  className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/25"
                >
                  <option value="draft" className="bg-neutral-900 text-white">
                    draft
                  </option>
                  <option value="published" className="bg-neutral-900 text-white">
                    published
                  </option>
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-sm font-medium text-white">Source type</p>
                <p className="mt-2 font-mono text-sm text-white/60">
                  {book.source_type || "unknown"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-black/35"
                />
                <div className="mt-2 flex justify-end font-mono text-xs text-white/35">
                  {description.length} chars
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveMetadata}
              disabled={isSaving}
              className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? "Saving metadata..." : "Save metadata"}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/[0.06] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-100/60">
              file.assets
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">File assets</h3>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm text-white/60">Current source</p>
              <p className="mt-2 break-all font-mono text-xs leading-6 text-white/65">
                {book.source_url || "No source file"}
              </p>
            </div>

            <div className="mt-5 space-y-5">
              <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/25 p-5 text-center transition hover:border-cyan-300/40 hover:bg-cyan-500/10">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-white transition group-hover:bg-white/10">
                  ↑
                </div>

                <p className="mt-4 text-sm font-medium text-white">
                  {pdfFile ? pdfFile.name : "Select replacement PDF"}
                </p>

                <p className="mt-2 text-xs text-white/45">
                  Replaces the current PDF source.
                </p>
              </label>

              <button
                type="button"
                onClick={handleReplacePdf}
                disabled={isSaving || !pdfFile}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Replace PDF
              </button>

              <label className="group flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/25 p-5 text-center transition hover:border-cyan-300/40 hover:bg-cyan-500/10">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) =>
                    setCoverFile(event.target.files?.[0] ?? null)
                  }
                  className="sr-only"
                />

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl text-white transition group-hover:bg-white/10">
                  ◇
                </div>

                <p className="mt-4 text-sm font-medium text-white">
                  {coverFile ? coverFile.name : "Upload cover image"}
                </p>

                <p className="mt-2 text-xs text-white/45">
                  PNG, JPEG, or WEBP.
                </p>
              </label>

              <button
                type="button"
                onClick={handleUploadCover}
                disabled={isSaving || !coverFile}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Upload cover
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              publication.control
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Publication state
            </h3>

            <div className="mt-5 flex flex-wrap gap-2 text-xs">
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

            <button
              type="button"
              onClick={handleFeatureToggle}
              disabled={isSaving || visibility !== "published" || Boolean(book.archived_at)}
              className="mt-5 w-full rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100 transition hover:bg-yellow-400/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {book.is_featured ? "Remove featured placement" : "Set as featured book"}
            </button>

            {visibility !== "published" || book.archived_at ? (
              <p className="mt-3 text-xs leading-6 text-white/45">
                Only published and active books can be featured on the homepage.
              </p>
            ) : null}
          </div>

          <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-red-200/60">
              danger.zone
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">Danger zone</h3>

            <p className="mt-2 text-sm leading-7 text-white/60">
              Archive hides this book from normal catalog flows. Delete permanently
              removes it and should only be used when the item was created by
              mistake.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleArchiveToggle}
                disabled={isSaving}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10 disabled:opacity-70"
              >
                {book.archived_at ? "Restore book" : "Archive book"}
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100 transition hover:bg-red-500/20 disabled:opacity-70"
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
      <label className="mb-2 block text-sm font-medium text-white">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-black/35"
      />
    </div>
  );
}

function StatusMetric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "success" | "danger" | "featured";
}) {
  const toneClass =
    tone === "success"
      ? "text-emerald-100"
      : tone === "danger"
        ? "text-red-100"
        : tone === "featured"
          ? "text-yellow-100"
          : "text-white";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>
      <p className={`mt-2 truncate font-mono text-lg font-semibold ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}