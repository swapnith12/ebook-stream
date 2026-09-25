import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, PLACEHOLDER_COVER, UNKNOWN_AUTHOR } from "@/lib/books";
import { getBooks } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Tag, FileText, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBooks()
      .then(setBooks)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load books"))
      .finally(() => setIsLoading(false));
  }, []);

  const genres = new Set(books.map((b) => b.genre));
  const authors = new Set(books.map((b) => b.author).filter((a) => a !== UNKNOWN_AUTHOR));
  const totalPages = books.reduce((s, b) => s + b.pageCount, 0);

  const stats = [
    { label: "Total Books", value: books.length, icon: BookOpen, color: "text-primary" },
    { label: "Categories", value: genres.size, icon: Tag, color: "text-accent-foreground" },
    { label: "Total Pages", value: totalPages.toLocaleString(), icon: FileText, color: "text-primary" },
    { label: "Authors", value: authors.size, icon: Users, color: "text-accent-foreground" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {error && (
        <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-4">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Books</CardTitle>
        </CardHeader>
        <CardContent>
          {books.length === 0 ? (
            <p className="text-sm text-muted-foreground">No books uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {books.slice(0, 5).map((book) => (
                <div
                  key={book.id}
                  onClick={() => navigate(`/book/${book.id}`)}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors cursor-pointer"
                >
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-10 h-14 object-cover rounded bg-muted"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_COVER; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{book.genre}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
