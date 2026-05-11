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
        <div className="w-full max-w-none space-y-5 px-3 pb-28 sm:space-y-7 sm:px-6 sm:pb-20 lg:px-10 lg:pb-12">
            <section className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-2xl sm:rounded-[2rem]">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        {/* 1. Centering Wrapper: Keeps content from drifting to the far left of ultra-wide monitors */}
                        <div className="mx-auto w-full max-w-screen-2xl">

                            {/* 2. Main Profile Header: Reverting to your preferred h-20/h-24 and text-2xl/4xl sizes */}
                            <div className="flex min-w-0 items-center gap-4">

                                {/* Avatar with Cyan Glow - Original Size: h-20 sm:h-24 */}
                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 sm:h-24 sm:w-24">
                                    {/* Subtle glow layer */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/15 to-transparent opacity-60" />

                                    <Image
                                        src={profile.avatar}
                                        alt={`${profile.name} avatar`}
                                        fill
                                        className="object-cover relative z-10"
                                        sizes="(max-width: 640px) 80px, 96px"
                                    />
                                </div>

                                <div className="min-w-0">
                                    {/* Cyan Accent Label */}
                                    <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-400 font-bold">
                                        User profile
                                    </p>

                                    {/* Title - Original Size: text-2xl sm:text-4xl */}
                                    <h1 className="mt-2 truncate text-2xl font-semibold tracking-tight text-white sm:text-4xl">
                                        {profile.name}
                                    </h1>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {/* Cyan Tinted Plan Badge */}
                                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-100">
                                            {profile.plan}
                                        </span>

                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
                                            Active Member
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-2 gap-2 sm:w-fit">
                            <button
                                type="button"
                                onClick={() => setIsEditing((prev) => !prev)}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
                            >
                                {isEditing ? "Cancel" : "Edit"}
                            </button>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85 transition hover:bg-white/10"
                            >
                                Avatar
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
                                className="col-span-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-white/85 transition hover:bg-white/10"
                            >
                                Account settings
                            </Link>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                            <p className="text-sm font-medium text-white">Edit profile</p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <input
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    placeholder="Full name"
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                                />

                                <input
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="Email"
                                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="mt-4 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-70"
                            >
                                {isSaving ? "Saving..." : "Save profile"}
                            </button>
                        </div>
                    ) : null}

                    {message ? (
                        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/65">
                            {message}
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {profile.stats.slice(0, 4).map((item) => (
                    <ProfileStatCard
                        key={item.label}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </section>

            <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                                Reading activity
                            </p>
                            <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                                Recent progress
                            </h2>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                            This month
                        </span>
                    </div>

                    <div className="mt-4 space-y-3">
                        {profile.readingProgress.length > 0 ? (
                            profile.readingProgress.slice(0, 4).map((item) => (
                                <div
                                    key={item.id}
                                    className="rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4"
                                >
                                    <div className="mb-2 flex items-start justify-between gap-3 text-sm text-white/70">
                                        <span className="line-clamp-2">{item.title}</span>
                                        <span className="shrink-0">{item.progress}%</span>
                                    </div>

                                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10 sm:h-2">
                                        <div
                                            className="h-full rounded-full bg-white/80"
                                            style={{ width: `${item.progress}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-white/50">
                                No reading progress yet. Start reading to build your profile.
                            </div>
                        )}
                    </div>
                </div>

                <aside className="space-y-4">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                            Reading identity
                        </p>

                        <div className="mt-4 grid grid-cols-3 gap-2">
                            <ProfileSignal label="Since" value={profile.memberSince} />
                            <ProfileSignal label="Status" value={profile.libraryStatus} />
                            <ProfileSignal label="Mode" value={profile.readingMode} />
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-cyan-400/20 bg-cyan-500/[0.06] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-100/60 sm:text-xs">
                            Preferences
                        </p>

                        <h2 className="mt-1 text-lg font-semibold text-white">
                            Your top interests
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {profile.preferences.length > 0 ? (
                                profile.preferences.slice(0, 8).map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                                    >
                                        {item}
                                    </span>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/50">
                                    No preferences yet.
                                    <Link
                                        href="/settings"
                                        className="ml-2 font-medium text-white hover:text-white/80"
                                    >
                                        Add preferences
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {profile.suggestedBook ? (
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                                Suggested next read
                            </p>

                            <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-white">
                                {profile.suggestedBook.title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/55">
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
                </aside>
            </section>

            <section className="space-y-4">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                            Library
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                            Favorite books
                        </h2>
                    </div>

                    <Link href="/library" className="text-sm text-white/65 hover:text-white">
                        View all
                    </Link>
                </div>

                {profile.favoriteBooks.length > 0 ? (
                    <div className="flex gap-3 overflow-x-auto pb-2 pr-2 sm:gap-4">
                        {profile.favoriteBooks.map((book) => (
                            <BookCard key={book.id} book={book} size="md" />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-white/50 sm:p-8">
                        Your library is empty. Explore books and save your first title.
                        <Link
                            href="/discover"
                            className="ml-2 font-medium text-white hover:text-white/80"
                        >
                            Discover books
                        </Link>
                    </div>
                )}
            </section>

            <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-xl sm:rounded-[2rem] sm:p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                            Recent activity
                        </p>
                        <h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                            Latest profile events
                        </h2>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {profile.recentActivity.length > 0 ? (
                        profile.recentActivity.slice(0, 5).map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-3 sm:px-4"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-white">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-white/55">{item.action}</p>
                                </div>

                                <Link
                                    href={item.href}
                                    className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 sm:text-sm"
                                >
                                    View
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-white/50">
                            No recent activity yet. Start reading a book to build your profile
                            history.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
function ProfileStatCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-xl sm:p-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-white/35 sm:text-xs">
                {label}
            </p>
            <p className="mt-2 truncate text-xl font-semibold text-white sm:text-2xl">
                {value}
            </p>
        </div>
    );
}

function ProfileSignal({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-white/35">
                {label}
            </p>
            <p className="mt-2 truncate text-xs font-medium text-white sm:text-sm">
                {value}
            </p>
        </div>
    );
}