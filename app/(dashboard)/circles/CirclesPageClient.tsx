"use client";

import Link from "next/link";
import { useState } from "react";
import { ApiError, createCircle, type Circle } from "@/lib/api";
import { Users } from "lucide-react";

interface Props {
    initialCircles: Circle[];
}

export default function CirclesPageClient({ initialCircles }: Props) {
    const [circles, setCircles] = useState<Circle[]>(initialCircles);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<"private" | "invite_only">("private");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleCreate = async () => {
        setIsSubmitting(true);
        setMessage(null);

        try {
            const created = await createCircle({
                name,
                description: description || undefined,
                visibility,
            });

            setCircles((prev) => [created, ...prev]);
            setName("");
            setDescription("");
            setVisibility("private");
            setMessage("Circle created.");
        } catch (error) {
            if (error instanceof ApiError) {
                setMessage(error.detail ?? "Failed to create circle.");
            } else {
                setMessage("Failed to create circle.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <h1 className="flex items-center gap-x-2 text-2xl font-semibold text-white">
                    Circles
                    <Users className="size-6 shrink-0 text-emerald-400" />
                </h1>
                <p className="mt-2 text-sm text-white/60">
                    Create private reading groups for family, friends, or school.
                </p>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Circle name"
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                    />

                    <input
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Description"
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                    />

                    <select
                        value={visibility}
                        onChange={(event) =>
                            setVisibility(event.target.value as "private" | "invite_only")
                        }
                        className="rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white outline-none"
                    >
                        <option value="private" className="bg-neutral-900 text-white">
                            private
                        </option>
                        <option value="invite_only" className="bg-neutral-900 text-white">
                            invite only
                        </option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={isSubmitting || !name.trim()}
                    className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black disabled:opacity-70"
                >
                    {isSubmitting ? "Creating..." : "Create circle"}
                </button>

                {message ? <p className="mt-3 text-sm text-white/60">{message}</p> : null}
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
                {circles.map((circle) => (
                    <Link
                        key={circle.id}
                        href={`/circles/${circle.id}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:bg-white/5"
                    >
                        <h2 className="text-lg font-medium text-white">{circle.name}</h2>
                        <p className="mt-2 text-sm text-white/60">
                            {circle.description || "No description"}
                        </p>
                        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/40">
                            {circle.visibility}
                        </p>
                    </Link>
                ))}
            </section>
        </div>
    );
}