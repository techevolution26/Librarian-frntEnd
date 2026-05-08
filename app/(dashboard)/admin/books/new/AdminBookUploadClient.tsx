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
        <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
        >
            <div>
                <h2 className="text-2xl font-semibold text-white">Upload PDF book</h2>
                <p className="mt-2 text-sm text-white/55">
                    Add a new PDF-backed book to the catalog.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <AdminInput label="Title" value={title} onChange={setTitle} required />
                <AdminInput label="Author" value={author} onChange={setAuthor} required />
                <AdminInput label="Cover URL" value={cover} onChange={setCover} />
                <AdminInput label="Rating" value={rating} onChange={setRating} />
                <AdminInput label="Pages" value={pages} onChange={setPages} />
                <AdminInput
                    label="Genres CSV"
                    value={genreCsv}
                    onChange={setGenreCsv}
                    placeholder="Business, Mindset, Productivity"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm text-white/70">Description</label>
                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm text-white/70">PDF file</label>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-medium file:text-black"
                />
            </div>

            {message ? <p className="text-sm text-white/60">{message}</p> : null}

            <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-70"
            >
                {isSubmitting ? "Uploading..." : "Upload book"}
            </button>
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
            <label className="mb-2 block text-sm text-white/70">{label}</label>
            <input
                value={value}
                required={required}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
            />
        </div>
    );
}