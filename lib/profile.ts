// lib/profile.ts
import { books } from "@/lib/data";
import type { Book } from "@/lib/types";

export interface ProfileStat {
    label: string;
    value: string;
}

export interface ReadingProgressItem {
    id: string;
    title: string;
    progress: number;
}

export interface ActivityItem {
    id: string;
    title: string;
    action: string;
    href: string;
}

export interface UserProfile {
    name: string;
    plan: string;
    avatar: string;
    memberSince: string;
    libraryStatus: string;
    readingMode: string;
    preferences: string[];
    stats: ProfileStat[];
    favoriteBooks: Book[];
    recentBooks: Book[];
    readingProgress: ReadingProgressItem[];
    suggestedBook: Book | null;
    recentActivity: ActivityItem[];
}

const readingProgressSeed = [78, 42, 91, 24];

export function getUserProfile(): UserProfile {
    const favoriteBooks = books.slice(0, 6);
    const recentBooks = books.slice(0, 4);
    const readingBooks = books.slice(0, 4);

    const pagesRead = readingBooks.reduce(
        (total, book, index) =>
            total + Math.round((book.pages ?? 0) * ((readingProgressSeed[index] ?? 0) / 100)),
        0,
    );

    const avgRating =
        favoriteBooks.length > 0
            ? (
                favoriteBooks.reduce((sum, book) => sum + book.rating, 0) /
                favoriteBooks.length
            ).toFixed(1)
            : "0.0";

    const readingProgress = readingBooks.map((book, index) => ({
        id: book.id,
        title: book.title,
        progress: readingProgressSeed[index] ?? 0,
    }));

    return {
        name: "Tech Resolute",
        plan: "Free plan",
        avatar: "https://picsum.photos/300",
        memberSince: "2026",
        libraryStatus: "Active",
        readingMode: "Dark",
        preferences: ["Productivity", "Business", "Mindset", "Design", "Non-fiction"],
        stats: [
            { label: "Books saved", value: String(favoriteBooks.length * 8) },
            { label: "Pages read", value: pagesRead.toLocaleString() },
            { label: "Reading streak", value: "7 days" },
            { label: "Avg rating", value: avgRating },
        ],
        favoriteBooks,
        recentBooks,
        readingProgress,
        suggestedBook: books[1] ?? null,
        recentActivity: recentBooks.map((book, index) => ({
            id: book.id,
            title: book.title,
            action: index === 0 ? "Opened today" : "Viewed recently",
            href: `/book/${book.id}`,
        })),
    };
}