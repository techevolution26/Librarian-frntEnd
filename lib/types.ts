export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  genre: string[];
  rating: number;
  pages: number;
  current_page?: number;
  total_pages?: number;
  progress?: number;
  bookmark_page?: number;
  save_progress?: boolean;
}

export type LibraryStatus = "reading" | "saved" | "finished";

export interface LibraryBook extends Book {
  status: LibraryStatus;
  progress: number;
  addedAt?: string;
  finishedAt?: string;
}