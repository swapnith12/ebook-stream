import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, matchesSearch, PLACEHOLDER_COVER } from "@/lib/books";
import { deleteBook, getBooks } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Loader2, BookOpen, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminBooksPage() {
  const navigate = useNavigate();
  const [bookList, setBookList] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getBooks()
      .then(setBookList)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load books"))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = bookList.filter((b) => matchesSearch(b, search));

  const handleDelete = async (book: Book) => {
    setDeletingId(book.id);
    try {
      await deleteBook(book.id);
      setBookList((prev) => prev.filter((b) => b.id !== book.id));
      toast({ title: "Book deleted", description: `"${book.title}" has been removed.` });
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Manage Books</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button onClick={() => navigate("/admin/upload")} className="gap-1.5">
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-4">{error}</div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : (
              <>
                {filtered.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-8 h-12 object-cover rounded bg-muted"
                          onError={(e) => { e.currentTarget.src = PLACEHOLDER_COVER; }}
                        />
                        <span className="font-medium text-sm">{book.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{book.author}</TableCell>
                    <TableCell><Badge variant="secondary">{book.genre}</Badge></TableCell>
                    <TableCell className="text-sm">{book.pageCount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(book.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Open" onClick={() => navigate(`/reader/${book.id}`)}>
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              disabled={deletingId === book.id}
                            >
                              {deletingId === book.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{book.title}"?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes the book and its file from Cloudinary. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(book)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {bookList.length === 0 ? "No books uploaded yet." : "No books found."}
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
