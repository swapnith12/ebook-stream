import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowLeft, Clock, Loader2, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { getBook, getBooks } from "@/lib/api";
import { Book, PLACEHOLDER_COVER, UNCATEGORIZED } from "@/lib/books";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [related, setRelated] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchBook = async () => {
      setIsLoading(true);
      setBook(null);
      setRelated([]);
      try {
        const bookData = await getBook(id || "");
        if (cancelled) return;
        setBook(bookData);

        try {
          const allBooks = await getBooks();
          if (cancelled) return;
          const sameGenre = bookData.genre !== UNCATEGORIZED
            ? allBooks.filter((b) => b.genre === bookData.genre && b.id !== bookData.id)
            : allBooks.filter((b) => b.id !== bookData.id);
          setRelated(sameGenre.slice(0, 4));
        } catch (err) {
          console.error("Failed to fetch related books:", err);
        }
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchBook();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Book not found</h1>
        <Button onClick={() => navigate("/")}>Back to catalog</Button>
      </div>
    );
  }

  const handleReadNow = () => {
    if (!isAuthenticated) {
      navigate("/login?redirect=/reader/" + book.id);
    } else {
      navigate("/reader/" + book.id);
    }
  };

  const added = new Date(book.createdAt);

  return (
    <div className="container py-8">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6 gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="grid md:grid-cols-[300px_1fr] gap-10">
        <div className="aspect-[2/3] overflow-hidden rounded-xl shadow-xl bg-muted">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER_COVER; }}
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">{book.genre}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">by {book.author}</p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm">{book.pageCount} pages</span>
              </div>
              {book.publishedYear && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{book.publishedYear}</span>
                </div>
              )}
              {!Number.isNaN(added.getTime()) && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm">Added {added.toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {book.description ? (
              <p className="text-foreground/80 leading-relaxed max-w-prose">{book.description}</p>
            ) : (
              <p className="text-muted-foreground italic">No description available.</p>
            )}
          </div>

          <div className="mt-8">
            <Button size="lg" onClick={handleReadNow} className="gap-2">
              <BookOpen className="h-5 w-5" />
              Read Now
            </Button>
            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground mt-2">Sign in required to read</p>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">
            {book.genre !== UNCATEGORIZED ? `More in ${book.genre}` : "More books"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((b) => (
              <div key={b.id} onClick={() => navigate(`/book/${b.id}`)} className="group cursor-pointer">
                <div className="aspect-[2/3] overflow-hidden rounded-lg shadow-md mb-3 bg-muted">
                  <img
                    src={b.coverUrl}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_COVER; }}
                  />
                </div>
                <h3 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">{b.title}</h3>
                <p className="text-xs text-muted-foreground">{b.author}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
