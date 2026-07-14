export interface Book {
  id: number;
  title: string;
  author: string;
  authors?: string[];
  cover: string;
  description: string;
  rating: number;
  pages: number;
  genre: string[];
  tags?: string[];
  source_type?: "text" | "pdf" | string;
  content_type?: string;
  source_url: string | null;
  mime_type?: string | null;
  archived_at?: string | null;
  visibility: "draft" | "published" | string;
  is_featured?: boolean;
}

export type LibraryStatus = "reading" | "saved" | "finished";

export interface LibraryBook extends Book {
  status: LibraryStatus;
  progress: number;
  addedAt?: string;
  finishedAt?: string;
}