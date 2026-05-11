"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminUploadPdfBook } from "@/lib/api";

export default function AdminBookUploadClient() {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [cover, setCover] = useState("/book-placeholder.jpg");
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState("0");
    const [pages, setPages] = useState("0");
    const [genreCsv, setGenreCsv] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!pdfFile) {
            setMessage("Select a PDF file.");
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const created = await adminUploadPdfBook({
                title,
                author,
                cover,
                description,
                rating: Number(rating),
                pages: Number(pages),
                genreCsv,
                pdfFile,
            });

            router.push(`/admin/books/${created.id}/edit`);
            router.refresh();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Upload failed.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-6 pb-28 sm:pb-16 lg:pb-8">
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-950/80 shadow-2xl">
                <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-100">
                                admin.book.upload
                            </p>

                            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                                Upload book
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/60">
                                Add a new book to the catalog. Metadata controls how the
                                book appears in public discovery,and recommendation flows.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 font-mono text-xs text-white/45">
                            <p>source_type: pdf</p>
                            <p>visibility: published</p>
                            <p>storage: catalog/books</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-5">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                            <div className="mb-5 flex items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Book metadata
                                    </h3>
                                    <p className="mt-1 text-sm text-white/50">
                                        Core catalog information shown across the app.
                                    </p>
                                </div>

                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-white/45">
                                    required
                                </span>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <AdminInput
                                    label="Title"
                                    value={title}
                                    onChange={setTitle}
                                    required
                                    placeholder="Book name"
                                />

                                <AdminInput
                                    label="Author"
                                    value={author}
                                    onChange={setAuthor}
                                    required
                                    placeholder="Author name"
                                />

                                <AdminInput
                                    label="Rating"
                                    value={rating}
                                    onChange={setRating}
                                    placeholder="4.8"
                                />

                                <AdminInput
                                    label="Pages"
                                    value={pages}
                                    onChange={setPages}
                                    placeholder="251"
                                />

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
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                            <label className="mb-2 block text-sm font-medium text-white">
                                Description
                            </label>

                            <p className="mb-3 text-sm text-white/50">
                                Use a concise summary. This helps search, recommendations, and the
                                public book details page.
                            </p>

                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                required
                                placeholder="Write a clear description of the book..."
                                className="min-h-40 w-full resize-y rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-black/35"
                            />

                            <div className="mt-2 flex justify-end font-mono text-xs text-white/35">
                                {description.length} chars
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="rounded-3xl border border-cyan-400/20 bg-cyan-500/[0.06] p-5">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-white">PDF asset</h3>
                                <p className="mt-1 text-sm text-white/55">
                                    Upload the source PDF. The backend will store it and attach the
                                    generated static URL to this book.
                                </p>
                            </div>

                            <label className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/25 p-6 text-center transition hover:border-cyan-300/40 hover:bg-cyan-500/10">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
                                    required
                                    className="sr-only"
                                />

                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-white transition group-hover:bg-white/10">
                                    ↑
                                </div>

                                <p className="mt-4 text-sm font-medium text-white">
                                    {pdfFile ? pdfFile.name : "Drop or select PDF file"}
                                </p>

                                <p className="mt-2 text-xs text-white/45">
                                    PDF only. Recommended max: 25MB.
                                </p>
                            </label>

                            {pdfFile ? (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
                                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/35">
                                        selected_file
                                    </p>
                                    <p className="mt-2 break-all text-sm text-white/75">
                                        {pdfFile.name}
                                    </p>
                                    <p className="mt-1 font-mono text-xs text-white/40">
                                        {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            ) : null}
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                            <h3 className="text-lg font-semibold text-white">Upload summary</h3>

                            <dl className="mt-4 space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                                    <dt className="text-white/45">Title</dt>
                                    <dd className="max-w-44 truncate text-white/80">
                                        {title || "Not set"}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                                    <dt className="text-white/45">Author</dt>
                                    <dd className="max-w-44 truncate text-white/80">
                                        {author || "Not set"}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
                                    <dt className="text-white/45">Genres</dt>
                                    <dd className="max-w-44 truncate text-white/80">
                                        {genreCsv || "None"}
                                    </dd>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-white/45">PDF</dt>
                                    <dd className="max-w-44 truncate text-white/80">
                                        {pdfFile ? "Ready" : "Missing"}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {message ? (
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                                {message}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? "Uploading book..." : "Upload book"}
                        </button>
                    </div>
                </div>
            </section>
        </form>
    );
}

function AdminInput({
    label,
    value,
    onChange,
    required = false,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <div>
            <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-white">
                    {label}
                </label>

                {required ? (
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-100/60">
                        required
                    </span>
                ) : null}
            </div>

            <input
                value={value}
                required={required}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 transition focus:border-white/25 focus:bg-black/35"
            />
        </div>
    );
}