import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getBooks } from "@/lib/api";
import { Book, collectGenres, matchesSearch, PLACEHOLDER_COVER } from "@/lib/books";

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load books");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const genreOptions = useMemo(() => collectGenres(books), [books]);

  // Newest uploads (books are returned sorted by createdAt desc)
  const trending = useMemo(() => books.slice(0, 3), [books]);

  const filteredBooks = useMemo(() => {
    const byGenre = selectedGenre === "All" ? books : books.filter((b) => b.genre === selectedGenre);
    return byGenre.filter((b) => matchesSearch(b, searchQuery));
  }, [books, selectedGenre, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      {!searchQuery && (
        <section className="bg-gradient-to-br from-primary/10 via-accent to-secondary/40 py-16 md:py-24">
          <div className="container">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Discover Your Next
                <span className="text-primary"> Great Read</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Browse our library of books. Stream instantly in your browser.
              </p>
              <Button size="lg" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>
                Browse Catalog <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Recently added */}
      {!searchQuery && trending.length > 0 && (
        <section className="container py-12">
          <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trending.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="group relative flex gap-4 p-4 rounded-lg border bg-card hover:shadow-lg transition-all cursor-pointer"
              >
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-24 h-36 object-cover rounded-md shadow bg-muted"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER_COVER; }}
                />
                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium">{book.pageCount} pages</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {book.genre}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catalog */}
      <section id="catalog" className="container py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold">
            {searchQuery ? `Results for "${searchQuery}"` : "Browse All Books"}
          </h2>
        </div>

        {/* Genre filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {genreOptions.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>

        {/* Book grid */}
        {filteredBooks.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            {books.length === 0 ? "No books have been uploaded yet." : "No books found."}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => navigate(`/book/${book.id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md mb-3 bg-muted">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_COVER; }}
                  />
                </div>
                <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{book.author}</p>
                <div className="flex items-center gap-1 mt-1">
                  <BookOpen className="h-3 w-3 text-primary" />
                  <span className="text-xs font-medium">{book.pageCount} pages</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
