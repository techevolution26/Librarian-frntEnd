const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
import type { Book } from "@/lib/types";
// export interface Book {
//   id: number;
//   title: string;
//   author: string;
//   cover: string;
//   description: string;
//   rating: number;
//   pages: number;
//   genre: string[];
//   source_type: "text" | "pdf" | string;
//   source_url: string | null;
//   mime_type: string | null;
//   archived_at?: string | null;
//   visibility: "draft" | "published";
//   is_featured: boolean;
// }

export interface BookContent {
  id: number;
  title: string;
  source_type: "text" | "pdf" | string;
  content_type?: string;
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

export interface ConnectionUser {
  id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export interface UserConnection {
  id: number;
  status: "pending" | "accepted" | "declined" | "blocked";
  relationship_type: "friend" | "family" | "school" | "mentor" | "other";
  created_at: string;
  requester: ConnectionUser;
  addressee: ConnectionUser;
}

export interface CircleOwner {
  id: number;
  full_name: string;
  avatar_url: string | null;
}

export interface Circle {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  visibility: "private" | "invite_only";
  avatar_url: string | null;
  owner: CircleOwner;
  created_at: string;
  updated_at: string;
}

export interface CircleProgressUser {
  id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export interface CircleProgressUpdate {
  id: number;
  progress_percent: number;
  current_page: number | null;
  bookmark_page: number | null;
  note: string | null;
  visibility: "circle" | "connections";
  created_at: string;
  user: CircleProgressUser;
}

export interface SidebarSummary {
  full_name: string;
  avatar_url: string | null;
  role: "USER" | "ADMIN" | string;
  reading_streak_days: number;
}

export interface ConnectionUser {
  id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export interface UserConnection {
  id: number;
  status: "pending" | "accepted" | "declined" | "blocked";
  relationship_type: "friend" | "family" | "school" | "mentor" | "other";
  created_at: string;
  requester: ConnectionUser;
  addressee: ConnectionUser;
}

export interface CircleOwner {
  id: number;
  full_name: string;
  avatar_url: string | null;
}

export interface Circle {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  visibility: "private" | "invite_only";
  avatar_url: string | null;
  owner: CircleOwner;
  created_at: string;
  updated_at: string;
}

export interface CircleMemberUser {
  id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export interface CircleMember {
  id: number;
  role: "owner" | "" | "member";
  status: "invited" | "active" | "removed";
  joined_at: string | null;
  user: CircleMemberUser;
}

export interface CircleBook {
  id: number;
  title_override: string | null;
  description: string | null;
  start_date: string | null;
  target_end_date: string | null;
  status: "active" | "completed" | "archived";
  book: Book;
}

export interface CircleProgressUpdate {
  id: number;
  progress_percent: number;
  current_page: number | null;
  bookmark_page: number | null;
  note: string | null;
  visibility: "circle" | "connections";
  created_at: string;
  user: CircleMemberUser;
  book_title?: string | null;
  circle_book?: {
    id: number;
    book: {
      id: number;
      title: string;
    };
  } | null;
}

export interface AcceptedConnectionUser {
  id: number;
  full_name: string;
  email: string;
  avatar_url: string | null;
}

export interface SelectableLibraryBook {
  id: number;
  status: "reading" | "saved" | "finished";
  progress: number;
  current_page: number | null;
  bookmark_page: number | null;
  book: Book;
}

export interface CurrentUser {
  id: number;
  email: string;
  full_name: string;
  role: "USER" | "ADMIN" | string;
  avatar_url: string | null;
  plan?: string;
}

export type DiscoverSort =
  | "recommended"
  | "top-rated"
  | "newest"
  | "most-saved"
  | "trending";

export interface DiscoverBooksParams {
  q?: string;
  genre?: string;
  sort?: DiscoverSort;
  limit?: number;
  offset?: number;
}

export interface DiscoverStats {
  visible_books: number;
  top_rated: number;
  new_this_week: number;
  categories: number;
}

export interface OnboardingPreferences {
  preferred_genres: string[];
  reading_goals: string[];
  content_styles: string[];
  preferred_lengths: string[];
  weekly_target: string | null;
  onboarding_completed: boolean;
}

export interface AdminBookUploadPayload {
  title: string;
  author: string;
  cover: string;
  description: string;
  rating: number;
  pages: number;
  genreCsv: string;
  pdfFile: File;
}

export interface AdminActivityLog {
  id: number;
  admin_user_id: number | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface AdminBookMetadataPayload {
  title: string;
  author: string;
  cover: string;
  description: string;
  rating: number;
  pages: number;
  genreCsv: string;
  visibility: "draft" | "published";
}

export interface AdminBookListResponse {
  items: Book[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AdminListBooksParams {
  q?: string;
  visibility?: "all" | "draft" | "published";
  status?: "all" | "active" | "archived";
  page?: number;
  limit?: number;
}


export async function getCurrentUser(
  token: string | null,
): Promise<CurrentUser> {
  const response = await apiFetch("/auth/me", {
    headers: {
      ...buildAuthHeaders(token),
    },
  });

  return handleJsonResponse<CurrentUser>(response);
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
  detail: string | null;
  body: unknown;

  constructor(message: string, status: number, body: unknown, detail?: string | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
    this.detail = detail ?? null;
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

function buildAuthHeaders(token: string | null | undefined): HeadersInit {
  const headers: HeadersInit = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function handleJsonResponse<T>(response: Response): Promise<T> {
  const errorBody = await response
    .clone()
    .json()
    .catch(async () => {
      const text = await response.clone().text().catch(() => "");
      return text ? { detail: text } : null;
    });

  if (!response.ok) {
    const detail =
      typeof errorBody === "object" &&
        errorBody !== null &&
        "detail" in errorBody &&
        typeof (errorBody as { detail?: unknown }).detail === "string"
        ? (errorBody as { detail: string }).detail
        : null;

    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      errorBody,
      detail,
    );
  }

  return response.json() as Promise<T>;
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

export async function uploadAvatar(file: File): Promise<UserProfileResponse> {
  const formData = new FormData();
  formData.append("avatar_file", file);

  const response = await fetch("/api/profile/avatar", {
    method: "POST",
    credentials: "include",
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

// CONNECTIONS
export async function getConnections(token?: string): Promise<UserConnection[]> {
  const response = await apiFetch("/connections/", {
    headers: buildAuthHeaders(token),
  });

  return handleJsonResponse<UserConnection[]>(response);
}


export async function getSidebarSummary(
  token?: string,
): Promise<SidebarSummary> {
  const response = await apiFetch("/profile/sidebar-summary", {
    headers: buildAuthHeaders(token),
  });

  return handleJsonResponse<SidebarSummary>(response);
}

export async function inviteConnection(
  email: string,
  relationshipType: UserConnection["relationship_type"] = "friend",
): Promise<UserConnection> {
  const response = await apiFetch("/api/connections/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      relationship_type: relationshipType,
    }),
  });

  return handleJsonResponse<UserConnection>(response);
}

export async function actOnConnection(
  connectionId: number,
  action: "accept" | "decline" | "block",
): Promise<UserConnection> {
  const response = await apiFetch(`/api/connections/${connectionId}/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action }),
  });

  return handleJsonResponse<UserConnection>(response);
}

export async function getCircles(token?: string): Promise<Circle[]> {
  const response = await apiFetch("/circles/", {
    headers: buildAuthHeaders(token),
  });
  return handleJsonResponse<Circle[]>(response);
}

export async function getCircle(circleId: number, token?: string): Promise<Circle> {
  const response = await apiFetch(`/circles/${circleId}`, {
    headers: buildAuthHeaders(token),
  });
  return handleJsonResponse<Circle>(response);
}

export async function getCircleMembers(
  circleId: number,
  token?: string,
): Promise<CircleMember[]> {
  const response = await apiFetch(`/circles/${circleId}/members`, {
    headers: buildAuthHeaders(token),
  });
  return handleJsonResponse<CircleMember[]>(response);
}

export async function getCircleBooks(
  circleId: number,
  token?: string,
): Promise<CircleBook[]> {
  const response = await apiFetch(`/circles/${circleId}/books`, {
    headers: buildAuthHeaders(token),
  });
  return handleJsonResponse<CircleBook[]>(response);
}

export async function getCircleProgress(
  circleId: number,
  token?: string,
): Promise<CircleProgressUpdate[]> {
  const response = await apiFetch(`/circles/${circleId}/progress`, {
    headers: buildAuthHeaders(token),
  });
  return handleJsonResponse<CircleProgressUpdate[]>(response);
}

export async function createCircle(payload: {
  name: string;
  description?: string;
  visibility?: "private" | "invite_only";
}): Promise<Circle> {
  const response = await apiFetch("/api/circles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<Circle>(response);
}

export async function inviteCircleMember(
  circleId: number,
  userId: number,
): Promise<CircleMember> {
  const response = await apiFetch(`/api/circles/${circleId}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });
  return handleJsonResponse<CircleMember>(response);
}

export async function attachCircleBook(
  circleId: number,
  payload: {
    book_id: number;
    title_override?: string;
    description?: string;
    start_date?: string;
    target_end_date?: string;
  },
): Promise<CircleBook> {
  const response = await apiFetch(`/api/circles/${circleId}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleJsonResponse<CircleBook>(response);
}

export async function getAcceptedConnections(
  token?: string,
): Promise<AcceptedConnectionUser[]> {
  const response = await apiFetch("/connections/accepted", {
    headers: buildAuthHeaders(token),
  });

  return handleJsonResponse<AcceptedConnectionUser[]>(response);
}

export async function getSelectableLibraryBooks(
  token?: string,
): Promise<SelectableLibraryBook[]> {
  const response = await apiFetch("/library/selectable-books", {
    headers: buildAuthHeaders(token),
  });

  return handleJsonResponse<SelectableLibraryBook[]>(response);
}

export async function createCircleProgressUpdate(
  circleId: number,
  payload: {
    circle_book_id: number;
    library_item_id: number;
    note?: string | null;
    visibility?: "circle" | "connections";
  },
): Promise<CircleProgressUpdate> {
  const response = await apiFetch(`/api/circles/${circleId}/progress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<CircleProgressUpdate>(response);
}

export async function getTrendingBooks(limit = 12): Promise<Book[]> {
  const response = await apiFetch(`/books/trending?limit=${limit}`, {
    cache: "no-store",
  });

  return handleJsonResponse<Book[]>(response);
}

export async function getFeaturedBook(): Promise<Book> {
  const response = await apiFetch("/books/featured", {
    cache: "no-store",
  });

  return handleJsonResponse<Book>(response);
}


export async function getBookGenres(): Promise<string[]> {
  const response = await apiFetch("/books/genres", {
    cache: "no-store",
  });

  return handleJsonResponse<string[]>(response);
}

export async function getDiscoverBooks(
  params: DiscoverBooksParams = {},
): Promise<Book[]> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.genre) searchParams.set("genre", params.genre);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.offset) searchParams.set("offset", String(params.offset));

  const query = searchParams.toString();

  const response = await apiFetch(
    query ? `/books/discover?${query}` : "/books/discover",
    { cache: "no-store" },
  );

  return handleJsonResponse<Book[]>(response);
}

export async function getDiscoverStats(params: {
  q?: string;
  genre?: string;
}): Promise<DiscoverStats> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.genre) searchParams.set("genre", params.genre);

  const query = searchParams.toString();

  const response = await apiFetch(
    query ? `/books/discover/stats?${query}` : "/books/discover/stats",
    { cache: "no-store" },
  );

  return handleJsonResponse<DiscoverStats>(response);
}

export async function getOnboardingPreferences(
  token?: string,
): Promise<OnboardingPreferences> {
  const response = await apiFetch("/settings/onboarding", {
    headers: buildAuthHeaders(token),
    cache: "no-store",
  });

  return handleJsonResponse<OnboardingPreferences>(response);
}

export async function updateOnboardingPreferences(
  payload: OnboardingPreferences,
): Promise<OnboardingPreferences> {
  const response = await apiFetch("/api/settings/onboarding", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse<OnboardingPreferences>(response);
}

export async function logoutUser(): Promise<void> {
  const response = await apiFetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new ApiError("Failed to logout", response.status, null);
  }
}

export async function adminUploadPdfBook(
  payload: AdminBookUploadPayload,
): Promise<Book> {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("author", payload.author);
  formData.append("cover", payload.cover);
  formData.append("description", payload.description);
  formData.append("rating", String(payload.rating));
  formData.append("pages", String(payload.pages));
  formData.append("genre_csv", payload.genreCsv);
  formData.append("pdf_file", payload.pdfFile);

  const response = await fetch("/api/admin/books/upload-pdf", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleJsonResponse<Book>(response);
}

export async function adminUpdateBookPdf(
  bookId: number,
  file: File,
): Promise<Book> {
  const formData = new FormData();
  formData.append("pdf_file", file);

  const response = await fetch(`/api/admin/books/${bookId}/update-pdf`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return handleJsonResponse<Book>(response);
}

export async function adminListBooks(
  token?: string,
  params: AdminListBooksParams = {},
): Promise<AdminBookListResponse> {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set("q", params.q);
  if (params.visibility) searchParams.set("visibility", params.visibility);
  if (params.status) searchParams.set("status", params.status);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const path = query
    ? `/books/admin/list?${query}`
    : "/books/admin/list";

  if (token) {
    const response = await apiFetch(path, {
      headers: buildAuthHeaders(token),
      cache: "no-store",
    });

    return handleJsonResponse<AdminBookListResponse>(response);
  }

  const response = await fetch(
    query ? `/api/admin/books?${query}` : "/api/admin/books",
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  return handleJsonResponse<AdminBookListResponse>(response);
}

export async function adminUpdateBookMetadata(
  bookId: number,
  payload: AdminBookMetadataPayload,
): Promise<Book> {
  const formData = new FormData();

  formData.append("title", payload.title);
  formData.append("author", payload.author);
  formData.append("cover", payload.cover);
  formData.append("description", payload.description);
  formData.append("rating", String(payload.rating));
  formData.append("pages", String(payload.pages));
  formData.append("genre_csv", payload.genreCsv);
  formData.append("visibility", payload.visibility);

  const response = await fetch(`/api/admin/books/${bookId}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return handleJsonResponse<Book>(response);
}

export async function adminUploadBookCover(
  bookId: number,
  file: File,
): Promise<Book> {
  const formData = new FormData();
  formData.append("cover_file", file);

  const response = await fetch(`/api/admin/books/${bookId}/cover`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return handleJsonResponse<Book>(response);
}


export async function adminArchiveBook(bookId: number): Promise<Book> {
  const response = await fetch(`/api/admin/books/${bookId}/archive`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleJsonResponse<Book>(response);
}

export async function adminRestoreBook(bookId: number): Promise<Book> {
  const response = await fetch(`/api/admin/books/${bookId}/restore`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleJsonResponse<Book>(response);
}

export async function adminDeleteBook(bookId: number): Promise<void> {
  const response = await fetch(`/api/admin/books/${bookId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    await handleJsonResponse(response);
  }
}


export async function adminFeatureBook(bookId: number): Promise<Book> {
  const response = await fetch(`/api/admin/books/${bookId}/feature`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleJsonResponse<Book>(response);
}

export async function adminUnfeatureBook(bookId: number): Promise<Book> {
  const response = await fetch(`/api/admin/books/${bookId}/unfeature`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleJsonResponse<Book>(response);
}

export async function adminListActivity(
  token?: string,
): Promise<AdminActivityLog[]> {
  if (token) {
    const response = await apiFetch("/books/admin/activity?limit=50", {
      headers: buildAuthHeaders(token),
      cache: "no-store",
    });

    return handleJsonResponse<AdminActivityLog[]>(response);
  }

  const response = await fetch("/api/admin/activity", {
    credentials: "include",
    cache: "no-store",
  });

  return handleJsonResponse<AdminActivityLog[]>(response);
}

export async function adminGetBookById(
  bookId: number,
  token: string,
): Promise<Book> {
  const response = await apiFetch(`/books/admin/${bookId}`, {
    headers: buildAuthHeaders(token),
    cache: "no-store",
  });

  return handleJsonResponse<Book>(response);
}