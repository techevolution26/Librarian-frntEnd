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


async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const isNextApiRoute = path.startsWith("/api/");
  const url = isNextApiRoute ? path : `${API_BASE_URL}${path}`;

  try {
    return await fetch(url, {
      credentials: "include",
      ...init,
      headers: {
        ...(init?.headers ?? {}),
      },
    });
  } catch (error) {
    throw new ApiError(
      "Service temporarily unavailable",
      503,
      error instanceof Error ? error.message : null,
    );
  }
}
export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function parseErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return (await response.json()) as unknown;
    } catch {
      return null;
    }
  }

  try {
    return await response.text();
  } catch {
    return null;
  }
}

function buildAuthHeaders(token: string | null): HeadersInit {
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function handleJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await parseErrorBody(response);

    if (response.status === 404) {
      throw new ApiError("NOT_FOUND", 404, errorBody);
    }

    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      errorBody,
    );
  }

  return (await response.json()) as T;
}

export async function login(payload: {
  email: string;
  password: string;
}) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Login failed";

    try {
      const data = await response.json();
      message = data.detail ?? message;
    } catch { }

    throw new Error(message);
  }

  return response.json();
}

export async function getUserProfile(
  token: string | null = null,
): Promise<UserProfileResponse> {
  const response = await apiFetch("/profile/", {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });

  return handleJsonResponse<UserProfileResponse>(response);
}

export async function updateUserProfile(
  payload: {
    full_name?: string;
    email?: string;
  },
  token: string | null = null,
): Promise<UserProfileResponse> {
  const response = await apiFetch("/profile/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<UserProfileResponse>(response);
}

export async function uploadAvatar(
  file: File,
  token: string | null = null,
): Promise<UserProfileResponse> {
  const formData = new FormData();
  formData.append("avatar_file", file);

  const response = await apiFetch("/profile/avatar", {
    method: "POST",
    headers: buildAuthHeaders(token),
    body: formData,
  });

  return handleJsonResponse<UserProfileResponse>(response);
}

export async function getBooks(): Promise<Book[]> {
  const response = await apiFetch("/books", {
    cache: "no-store",
  });

  return handleJsonResponse<Book[]>(response);
}

export async function getBookById(id: number): Promise<Book> {
  const response = await apiFetch(`/books/${id}`, {
    cache: "no-store",
  });

  return handleJsonResponse<Book>(response);
}

export async function getBookContent(id: number): Promise<BookContent> {
  const response = await apiFetch(`/books/${id}/content`, {
    cache: "no-store",
  });

  return handleJsonResponse<BookContent>(response);
}

export async function addToLibrary(
  bookId: number,
  status: "saved" | "reading" | "finished" = "saved",
  token: string | null = null,
): Promise<LibraryItem> {
  const response = await apiFetch("/api/library", {
    method: "POST",
    // credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(token),
    },
    body: JSON.stringify({
      book_id: bookId,
      status,
    }),
  });

  return handleJsonResponse<LibraryItem>(response);
}

export async function startReading(
  bookId: number,
  token: string | null = null,
): Promise<LibraryItem> {
  const response = await apiFetch("/api/library/start-reading", {
    method: "PATCH",
    // credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(token),
    },
    body: JSON.stringify({
      book_id: bookId,
    }),
  });

  return handleJsonResponse<LibraryItem>(response);
}

export async function savePdfProgress(
  payload: SavePdfProgressPayload,
  token: string | null = null,
): Promise<LibraryItem> {
  const response = await apiFetch(`/api/library/${payload.bookId}/pdf-progress`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(token),
    },
    body: JSON.stringify({
      current_page: payload.currentPage,
      total_pages: payload.totalPages,
      progress: payload.progressPercent,
      bookmark_page: payload.bookmarkPage ?? null,
    }),
  });

  return handleJsonResponse<LibraryItem>(response);
}

export async function getLibraryItemByBookId(
  bookId: number,
  token: string | null = null,
): Promise<LibraryItem | null> {
  const response = await apiFetch(`/library/${bookId}`, {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });

  if (response.status === 404) {
    return null;
  }

  return handleJsonResponse<LibraryItem>(response);
}

export async function getLibraryItems(
  token: string | null = null,
): Promise<LibraryItem[]> {
  const response = await apiFetch("/library/", {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });

  return handleJsonResponse<LibraryItem[]>(response);
}

export async function getLibrarySummary(
  token: string | null = null,
): Promise<LibrarySummary> {
  const response = await apiFetch("/library/summary", {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });

  return handleJsonResponse<LibrarySummary>(response);
}

export async function getUserSettings(
  token: string | null = null,
): Promise<UserSettingsResponse> {
  const response = await apiFetch("/settings/", {
    cache: "no-store",
    headers: buildAuthHeaders(token),
  });

  return handleJsonResponse<UserSettingsResponse>(response);
}

export async function updateUserSettings(
  payload: UpdateUserSettingsPayload,
  token: string | null = null,
): Promise<UserSettingsResponse> {
  const response = await apiFetch("/settings/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<UserSettingsResponse>(response);
}