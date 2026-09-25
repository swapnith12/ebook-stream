/** Raw Book document as returned by the Paybook book-service. */
export interface ApiBook {
  id: string;
  title: string;
  cloudinaryId: string;
  fileUrl: string;
  TotalPages: number;
  createdAt: string;
  updatedAt: string;
  author?: string | null;
  genre?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  publishedYear?: number | null;
}

/** Book shape used by the UI, with defaults filled in. */
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverUrl: string;
  pageCount: number;
  publishedYear?: number;
  fileUrl: string;
  createdAt: string;
}

export const UNKNOWN_AUTHOR = "Unknown author";
export const UNCATEGORIZED = "Uncategorized";
export const PLACEHOLDER_COVER = "/placeholder.svg";

export const genres = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Mystery",
  "Romance",
  "Fantasy",
  "Biography",
  "Self-Help",
  "Technology",
  "Education",
];

/**
 * Cloudinary stores PDFs as `image` resources, so page 1 can be rendered as a
 * JPG by inserting a transformation into the delivery URL.
 */
export const coverFromCloudinaryPdf = (fileUrl: string): string | null => {
  if (!/res\.cloudinary\.com\/.+\/image\/upload\//.test(fileUrl)) return null;
  if (!/\.pdf(\?.*)?$/i.test(fileUrl)) return null;
  return fileUrl
    .replace("/image/upload/", "/image/upload/pg_1,w_400,h_600,c_fill,f_jpg/")
    .replace(/\.pdf(\?.*)?$/i, ".jpg");
};

export const normalizeBook = (b: ApiBook): Book => ({
  id: b.id,
  title: b.title,
  author: b.author?.trim() || UNKNOWN_AUTHOR,
  genre: b.genre?.trim() || UNCATEGORIZED,
  description: b.description?.trim() || "",
  coverUrl: b.coverUrl?.trim() || coverFromCloudinaryPdf(b.fileUrl) || PLACEHOLDER_COVER,
  pageCount: Number(b.TotalPages) || 0,
  publishedYear: b.publishedYear ?? undefined,
  fileUrl: b.fileUrl,
  createdAt: b.createdAt,
});

/** Genres present in the catalog plus the static list, de-duplicated. */
export const collectGenres = (books: Book[]): string[] => {
  const set = new Set<string>(genres);
  books.forEach((b) => set.add(b.genre));
  return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
};

export const matchesSearch = (book: Book, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    book.title.toLowerCase().includes(q) ||
    book.author.toLowerCase().includes(q) ||
    book.genre.toLowerCase().includes(q)
  );
};
