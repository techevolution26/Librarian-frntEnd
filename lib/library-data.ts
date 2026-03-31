// lib/library-data.ts
import type { LibraryBook } from "@/lib/types";
import { books } from "@/lib/data";

export const libraryBooks: LibraryBook[] = books.map((book, index) => {
  if (index < 4) {
    return {
      ...book,
      status: "reading",
      progress: [78, 42, 91, 24][index] ?? 0,
    };
  }

  if (index < 8) {
    return {
      ...book,
      status: "saved",
      addedAt: "2026-03-20",
      progress: 0,
    };
  }

  return {
    ...book,
    status: "finished",
    finishedAt: "2026-03-10",
    progress: 100,
  };
});