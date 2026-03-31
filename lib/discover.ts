// lib/discover.ts
import type { Book } from "@/lib/types";

export const DEFAULT_GENRE = "All";
export const DEFAULT_SORT = "Recommended";

export const sortOptions = [
  "Recommended",
  "Top Rated",
  "Newest",
  "Most Saved",
] as const;

export type SortOption = (typeof sortOptions)[number];

export interface DiscoverBook extends Book {
  savedCount?: number;
  recommendedScore?: number;
}

export function enrichBooks(items: Book[]): DiscoverBook[] {
  return items.map((book, index) => ({
    ...book,
    savedCount: Math.max(5, 120 - index * 4),
    recommendedScore: book.rating * 20 + ((book.pages ?? 0) / 100),
  }));
}

export function getAvailableGenres(items: Book[]): string[] {
  const genres = new Set<string>();

  items.forEach((book) => {
    (book.genre ?? []).forEach((genre) => {
      const normalized = genre.trim();
      if (normalized) genres.add(normalized);
    });
  });

  return [DEFAULT_GENRE, ...Array.from(genres).sort((a, b) => a.localeCompare(b))];
}

export function isValidSort(value: string | null): value is SortOption {
  return !!value && sortOptions.includes(value as SortOption);
}

export function filterByGenre(
  items: DiscoverBook[],
  activeGenre: string,
): DiscoverBook[] {
  if (activeGenre === DEFAULT_GENRE) {
    return items;
  }

  return items.filter((book) =>
    (book.genre ?? []).some(
      (genre) => genre.trim().toLowerCase() === activeGenre.trim().toLowerCase(),
    ),
  );
}

export function sortBooks(
  items: DiscoverBook[],
  sortBy: SortOption,
): DiscoverBook[] {
  const sorted = [...items];

  switch (sortBy) {
    case "Top Rated":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "Newest":
      return sorted.sort((a, b) => Number(b.id) - Number(a.id));

    case "Most Saved":
      return sorted.sort((a, b) => (b.savedCount ?? 0) - (a.savedCount ?? 0));

    case "Recommended":
    default:
      return sorted.sort(
        (a, b) => (b.recommendedScore ?? 0) - (a.recommendedScore ?? 0),
      );
  }
}

export function getTopRatedCount(items: DiscoverBook[]): number {
  return items.filter((book) => book.rating >= 4.5).length;
}

export function getCategoriesCount(items: DiscoverBook[]): number {
  return new Set(items.flatMap((book) => book.genre ?? [])).size;
}