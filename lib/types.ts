export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating: number;
  pages: number;
  genre: string[];
  source_type?: "text" | "pdf" | string;
  source_url: string | null;
  mime_type?: string | null;
}

export type LibraryStatus = "reading" | "saved" | "finished";

export interface LibraryBook extends Book {
  status: LibraryStatus;
  progress: number;
  addedAt?: string;
  finishedAt?: string;
}