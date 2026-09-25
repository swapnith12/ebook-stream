import { ApiBook, Book, normalizeBook } from "./books";

/**
 * Paybook api-gateway client.
 *
 * Auth is a `sessionId` httpOnly cookie issued by the auth-service and checked
 * by the gateway, so every request is sent with `credentials: "include"`.
 * In development VITE_API_URL is a relative path proxied by Vite (see vite.config.ts).
 */
export const API_BASE = (import.meta.env.VITE_API_URL || "/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export const isUnauthorized = (err: unknown) =>
  err instanceof ApiError && (err.status === 401 || err.status === 403);

async function apiCall<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);

  // Let the browser set multipart boundaries for FormData bodies.
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  name: string | null;
  email?: string | null;
  googleId?: string | null;
  isAdmin: boolean;
}

interface AuthResponse {
  success: boolean;
  user: AuthUser;
}

/** Dummy email/password login (dev accounts defined in Auth_service). */
export const login = (email: string, password: string) =>
  apiCall<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getMe = () => apiCall<AuthResponse>("/auth/me");

export const logout = () => apiCall<{ success: boolean }>("/auth/logout", { method: "POST" });

/** Full-page redirect entry point for Google OAuth. */
export const googleLoginUrl = `${API_BASE}/auth/google`;

// ---------------------------------------------------------------------------
// Books
// ---------------------------------------------------------------------------

export const getBooks = async (): Promise<Book[]> => {
  const books = await apiCall<ApiBook[]>("/books/allBooks");
  return books.map(normalizeBook);
};

export const getBook = async (id: string): Promise<Book> => {
  const book = await apiCall<ApiBook>(`/books/${encodeURIComponent(id)}`);
  return normalizeBook(book);
};

export interface BookMetadata {
  title: string;
  author?: string;
  genre?: string;
  description?: string;
  coverUrl?: string;
  publishedYear?: string | number;
  pageCount?: string | number;
}

const toFormData = (meta: Partial<BookMetadata>, file?: File | null) => {
  const fd = new FormData();
  Object.entries(meta).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      fd.append(key, String(value));
    }
  });
  if (file) fd.append("file", file); // multer field name in book-service
  return fd;
};

/** Admin: upload a PDF plus metadata. */
export const uploadBook = async (meta: BookMetadata, file: File): Promise<Book> => {
  const book = await apiCall<ApiBook>("/books/upload", {
    method: "POST",
    body: toFormData(meta, file),
  });
  return normalizeBook(book);
};

/** Admin: update metadata and optionally replace the file. */
export const updateBook = async (
  id: string,
  meta: Partial<BookMetadata>,
  file?: File | null
): Promise<Book> => {
  const book = await apiCall<ApiBook>(`/books/update/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: toFormData(meta, file),
  });
  return normalizeBook(book);
};

/** Admin: delete a book and its Cloudinary asset. */
export const deleteBook = (id: string) =>
  apiCall<{ message: string }>(`/books/delete/${encodeURIComponent(id)}`, { method: "DELETE" });

// ---------------------------------------------------------------------------
// Stream
// ---------------------------------------------------------------------------

/** URL of the authenticated PDF stream (supports HTTP range requests). */
export const getStreamUrl = (bookId: string) => `${API_BASE}/stream/${encodeURIComponent(bookId)}`;
