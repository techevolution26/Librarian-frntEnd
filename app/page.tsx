import HomePageClient from "@/components/home/HomePageClient";
import {
  getBooks,
  getFeaturedBook,
  getOnboardingPreferences,
  getTrendingBooks,
} from "@/lib/api";
import type { Book } from "@/lib/types";
import { getAccessToken } from "@/lib/server-auth";

const DEFAULT_PERSONALIZATION = {
  preferred_genres: [] as string[],
  reading_goals: [] as string[],
  content_styles: [] as string[],
  preferred_lengths: [] as string[],
  weekly_target: null as string | null,
  onboarding_completed: true,
};

export default async function Home() {
  let books: Book[] = [];
  let trendingBooks: Book[] = [];
  let featuredBook: Book | null = null;
  let isServiceUnavailable = false;
  let personalization = DEFAULT_PERSONALIZATION;

  const token = await getAccessToken();

  if (token) {
    const onboardingResult = await getOnboardingPreferences(token)
      .then((data) => ({ ok: true as const, data }))
      .catch(() => ({ ok: false as const, data: null }));

    if (onboardingResult.ok) {
      personalization = onboardingResult.data;
    }
  }

  const [booksResult, featuredResult, trendingResult] = await Promise.allSettled([
    getBooks(),
    getFeaturedBook(),
    getTrendingBooks(12),
  ]);

  if (booksResult.status === "fulfilled") {
    books = booksResult.value;
  }

  if (featuredResult.status === "fulfilled") {
    featuredBook = featuredResult.value;
  }

  if (trendingResult.status === "fulfilled") {
    trendingBooks = trendingResult.value;
  }

  isServiceUnavailable =
    booksResult.status === "rejected" &&
    featuredResult.status === "rejected" &&
    trendingResult.status === "rejected";

  return (
    <HomePageClient
      books={books}
      featuredBook={featuredBook}
      trendingBooks={trendingBooks}
      personalization={personalization}
      isServiceUnavailable={isServiceUnavailable}
    />
  );
}