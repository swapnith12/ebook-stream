import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { getBook, getStreamUrl } from "@/lib/api";
import { Book } from "@/lib/books";

/**
 * Streams the PDF from the Paybook stream-service through the api-gateway.
 * The browser's built-in PDF viewer issues HTTP range requests, which the
 * stream-service forwards to Cloudinary, so large books load progressively.
 */
export default function ReaderPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/login?redirect=/reader/${id}`, { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate, id]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    let cancelled = false;
    getBook(id)
      .then((b) => { if (!cancelled) setBook(b); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load book"); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [authLoading, isAuthenticated, id]);

  if (authLoading || !isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Couldn't open this book</h1>
        <p className="text-muted-foreground">{error ?? "Book not found"}</p>
        <Button onClick={() => navigate("/")}>Back to catalog</Button>
      </div>
    );
  }

  const streamUrl = getStreamUrl(book.id);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="border-b bg-background/95 backdrop-blur h-12 flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/book/${book.id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium truncate">{book.title}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline truncate">· {book.author}</span>
        </div>
        <div className="flex items-center gap-2">
          {book.pageCount > 0 && (
            <span className="text-xs text-muted-foreground hidden sm:inline">{book.pageCount} pages</span>
          )}
          <Button variant="ghost" size="sm" asChild>
            <a href={streamUrl} target="_blank" rel="noopener noreferrer" className="gap-1.5">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Open in new tab</span>
            </a>
          </Button>
        </div>
      </header>

      {/* PDF viewer */}
      <iframe
        key={book.id}
        src={streamUrl}
        title={book.title}
        className="flex-1 w-full border-0 bg-muted"
      />
    </div>
  );
}
