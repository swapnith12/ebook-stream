import { books } from "@/data/books";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Tag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const genres = [...new Set(books.map((b) => b.genre))];
  const avgRating = (books.reduce((s, b) => s + b.rating, 0) / books.length).toFixed(1);

  const stats = [
    { label: "Total Books", value: books.length, icon: BookOpen, color: "text-primary" },
    { label: "Categories", value: genres.length, icon: Tag, color: "text-accent-foreground" },
    { label: "Avg Rating", value: avgRating, icon: TrendingUp, color: "text-primary" },
    { label: "Authors", value: new Set(books.map((b) => b.author)).size, icon: Users, color: "text-accent-foreground" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
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
          <div className="space-y-3">
            {books.slice(0, 5).map((book) => (
              <div key={book.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors">
                <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                </div>
                <span className="text-xs text-muted-foreground">{book.genre}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
