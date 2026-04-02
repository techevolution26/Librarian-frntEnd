const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating: number;
  pages: number;
  genre: string[];
  source_type: "text" | "pdf" | string;
  source_url?: string | null;
  mime_type?: string | null;
}

export interface BookContent {
  id: number;
  title: string;
  source_type: "text" | "pdf" | string;
  mime_type?: string | null;
  source_url?: string | null;
  content_text?: string | null;
}

export interface LibraryItem {
  id: number;
  status: "reading" | "saved" | "finished";
  progress: number;
  current_page?: number | null;
  total_pages?: number | null;
  bookmark_page?: number | null;
  last_read_at?: string | null;
  saved_at?: string | null;
  finished_at?: string | null;
  updated_at?: string | null;
  book: Book;
}

export interface SavePdfProgressPayload {
  bookId: number;
  currentPage: number;
  totalPages: number;
  progressPercent: number;
  bookmarkPage?: number | null;
}

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("NOT_FOUND");
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/books`, {
    cache: "no-store",
  });

  return handleJsonResponse<Book[]>(response);
}

export async function getBookById(id: number): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    cache: "no-store",
  });

  return handleJsonResponse<Book>(response);
}

export async function getBookContent(id: number): Promise<BookContent> {
  const response = await fetch(`${API_BASE_URL}/books/${id}/content`, {
    cache: "no-store",
  });

  return handleJsonResponse<BookContent>(response);
}


export async function addToLibrary(
  bookId: number,
  status: "saved" | "reading" | "finished" = "saved",
): Promise<LibraryItem> {
  const response = await fetch(`${API_BASE_URL}/library`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      book_id: bookId,
      status,
    }),
  });

  return handleJsonResponse<LibraryItem>(response);
}

export async function startReading(bookId: number): Promise<LibraryItem> {
  const response = await fetch(`${API_BASE_URL}/library/start-reading`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      book_id: bookId,
    }),
  });

  return handleJsonResponse<LibraryItem>(response);
}

export async function savePdfProgress(
  payload: SavePdfProgressPayload,
): Promise<LibraryItem> {
  const response = await fetch(
    `${API_BASE_URL}/library/${payload.bookId}/pdf-progress`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_page: payload.currentPage,
        total_pages: payload.totalPages,
        progress: payload.progressPercent,
        bookmark_page: payload.bookmarkPage ?? null,
      }),
    },
  );

  return handleJsonResponse<LibraryItem>(response);
}

export async function getLibraryItemByBookId(
  bookId: number,
): Promise<LibraryItem | null> {
  const response = await fetch(`${API_BASE_URL}/library/${bookId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  return handleJsonResponse<LibraryItem>(response);
}