"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import BookCard from "@/components/BookCard";
import type { UserProfile } from "@/lib/profile";
import { uploadAvatar, updateUserProfile } from "@/lib/api";

interface ProfilePageClientProps {
    initialProfile: UserProfile;
}

interface StatCardProps {
    label: string;
    value: string;
}

function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                {value}
            </p>
        </div>
    );
}

export default function ProfilePageClient({
    initialProfile,
}: ProfilePageClientProps) {
    const [profile, setProfile] = useState(initialProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(initialProfile.name);
    const [email, setEmail] = useState(initialProfile.email);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setMessage(null);

        try {
            const response = await updateUserProfile({
                full_name: fullName,
                email,
            });

            setProfile((prev) => ({
                ...prev,
                name: response.name,
                email: response.email,
            }));
            setIsEditing(false);
            setMessage("Profile updated.");
        } catch {
            setMessage("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsSaving(true);
        setMessage(null);

        try {
            const response = await uploadAvatar(file);
            setProfile((prev) => ({
                ...prev,
                avatar: response.avatar ?? prev.avatar,
            }));
            setMessage("Avatar updated.");
        } catch {
            setMessage("Failed to upload avatar.");
        } finally {
            setIsSaving(false);
            event.target.value = "";
        }
    };

    return (
        <div className="space-y-8">
            <section className="grid gap-6 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-2xl sm:p-8 lg:grid-cols-[280px_1fr] lg:p-10">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                    <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        <Image
                            src={profile.avatar}
                            alt={`${profile.name} avatar`}
                            fill
                            className="object-cover"
                            sizes="112px"
                        />
                    </div>

                    <div className="mt-5 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-white">
                            {profile.name}
                        </h1>
                        <p className="mt-1 text-sm text-white/60">{profile.plan}</p>
                    </div>

                    <div className="mt-6 space-y-3">
                        <button
                            type="button"
                            onClick={() => setIsEditing((prev) => !prev)}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
                        >
                            {isEditing ? "Cancel edit" : "Edit profile"}
                        </button>

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
                        >
                            Upload avatar
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleAvatarSelect}
                            className="hidden"
                        />

                        <Link
                            href="/settings"
                            className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white/85 transition hover:bg-white/10"
                        >
                            Account settings
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                            User profile
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                            Your reading profile
                        </h2>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                            View your reading habits, saved books, recent activity, and
                            personalized preferences from one place.
                        </p>

                        {isEditing ? (
                            <div className="mt-6 grid gap-4 md:grid-cols-2">
                                <input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full name"
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                                />
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                                />
                                <div className="md:col-span-2">
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-70"
                                    >
                                        {isSaving ? "Saving..." : "Save profile"}
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {message ? (
                            <p className="mt-4 text-sm text-white/60">{message}</p>
                        ) : null}
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                Member since
                            </p>
                            <p className="mt-2 text-2xl font-semibold">{profile.memberSince}</p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                Library status
                            </p>
                            <p className="mt-2 text-2xl font-semibold">{profile.libraryStatus}</p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                                Reading mode
                            </p>
                            <p className="mt-2 text-2xl font-semibold">{profile.readingMode}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {profile.stats.map((item) => (
                    <StatCard key={item.label} label={item.label} value={item.value} />
                ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                                Reading activity
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-white">
                                Recent progress
                            </h3>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60">
                            This month
                        </span>
                    </div>

                    <div className="mt-6 space-y-5">
                        {profile.readingProgress.length > 0 ? (
                            profile.readingProgress.map((item) => (
                                <div key={item.id}>
                                    <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                                        <span>{item.title}</span>
                                        <span>{item.progress}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                                        <div
                                            className="h-full rounded-full bg-white/80"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-white/55">No reading progress yet.</p>
                        )}
                    </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        Preferences
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                        Your top interests
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {profile.preferences.map((item) => (
                            <span
                                key={item}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                            >
                                {item}
                            </span>
                        ))}
                    </div>

                    {profile.suggestedBook ? (
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-sm text-white/60">Suggested next read</p>
                            <p className="mt-2 text-lg font-medium text-white">
                                {profile.suggestedBook.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/70">
                                Based on your recent activity and saved books.
                            </p>
                            <Link
                                href={`/book/${profile.suggestedBook.id}`}
                                className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                            >
                                Open suggestion
                            </Link>
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                            Library
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-white">
                            Favorite books
                        </h3>
                    </div>
                    <Link href="/library" className="text-sm text-white/65 hover:text-white">
                        View all
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 pr-2">
                    {profile.favoriteBooks.map((book) => (
                        <BookCard key={book.id} book={book} size="md" />
                    ))}
                </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                    Recent activity
                </p>

                <div className="mt-5 space-y-4">
                    {profile.recentActivity.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                        >
                            <div>
                                <p className="font-medium text-white">{item.title}</p>
                                <p className="text-sm text-white/60">{item.action}</p>
                            </div>

                            <Link
                                href={item.href}
                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
                            >
                                View
                            </Link>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}