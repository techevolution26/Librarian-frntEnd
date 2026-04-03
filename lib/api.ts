const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface Book {
  id: number ;
  title: string;
  author: string;
  cover: string;
  description: string;
  rating: number;
  pages: number;
  genre: string[];
  source_type: "text" | "pdf" | string;
  source_url: string | null;
  mime_type: string | null;
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

export interface LibrarySummary {
  all: number;
  reading: number;
  saved: number;
  finished: number;
  average_rating: number;
}

export interface ProfileStat {
  label: string;
  value: string;
}

export interface ReadingProgressItem {
  id: number;
  title: string;
  progress: number;
}

export interface ActivityItem {
  id: number;
  title: string;
  action: string;
  href: string;
}

export interface UserProfileResponse {
  name: string;
  email: string;
  plan: string;
  avatar: string | null;
  member_since: string;
  library_status: string;
  reading_mode: string;
  preferences: string[];
  stats: { label: string; value: string }[];
  favorite_books: Book[];
  recent_books: Book[];
  reading_progress: { id: number; title: string; progress: number }[];
  suggested_book: Book | null;
  recent_activity: { id: number; title: string; action: string; href: string }[];
}

export interface UserSettingsResponse {
  account: {
    full_name: string;
    email: string;
    plan: string;
  };
  appearance: {
    theme: string;
    density: string;
    reading_mode: string;
  };
  reading: {
    font_size: string;
    line_height: string;
    auto_bookmark: boolean;
    show_progress_bar: boolean;
  };
  notifications: {
    email_updates: boolean;
    reading_reminders: boolean;
    product_announcements: boolean;
  };
  privacy: {
    profile_visibility: string;
    share_reading_activity: boolean;
  };
}

export interface UpdateUserSettingsPayload {
  theme?: string;
  density?: string;
  reading_mode?: string;
  font_size?: string;
  line_height?: string;
  auto_bookmark?: boolean;
  show_progress_bar?: boolean;
  email_updates?: boolean;
  reading_reminders?: boolean;
  product_announcements?: boolean;
  profile_visibility?: string;
  share_reading_activity?: boolean;
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

export async function getUserProfile(): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    cache: "no-store",
  });

  return handleJsonResponse<UserProfileResponse>(response);
}

export async function updateUserProfile(payload: {
  full_name?: string;
  email?: string;
}): Promise<UserProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<UserProfileResponse>(response);
}

export async function uploadAvatar(file: File): Promise<UserProfileResponse> {
  const formData = new FormData();
  formData.append("avatar_file", file);

  const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
    method: "POST",
    body: formData,
  });

  return handleJsonResponse<UserProfileResponse>(response);
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

export async function getLibraryItems(): Promise<LibraryItem[]> {
  const response = await fetch(`${API_BASE_URL}/library`, {
    cache: "no-store",
  });

  return handleJsonResponse<LibraryItem[]>(response);
}

export async function getLibrarySummary(): Promise<LibrarySummary> {
  const response = await fetch(`${API_BASE_URL}/library/summary`, {
    cache: "no-store",
  });

  return handleJsonResponse<LibrarySummary>(response);
}


export async function getUserSettings(): Promise<UserSettingsResponse> {
  const response = await fetch(`${API_BASE_URL}/settings/`, {
    cache: "no-store",
  });

  return handleJsonResponse<UserSettingsResponse>(response);
}

export async function updateUserSettings(
  payload: UpdateUserSettingsPayload,
): Promise<UserSettingsResponse> {
  const response = await fetch(`${API_BASE_URL}/settings/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<UserSettingsResponse>(response);
}