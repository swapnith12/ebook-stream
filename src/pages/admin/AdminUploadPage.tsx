import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { genres } from "@/data/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "", author: "", genre: "", description: "", pageCount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Book uploaded!", description: `"${form.title}" has been added to the catalog.` });
    navigate("/admin/books");
  };

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Upload New Book</h2>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Upload className="h-5 w-5" /> Book Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" required value={form.author} onChange={(e) => update("author", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Genre</Label>
                <Select value={form.genre} onValueChange={(v) => update("genre", v)}>
                  <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                  <SelectContent>
                    {genres.filter((g) => g !== "All").map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Page Count</Label>
                <Input id="pages" type="number" value={form.pageCount} onChange={(e) => update("pageCount", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click to upload or drag & drop</p>
                <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>EPUB File</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click to upload EPUB file</p>
                <p className="text-xs mt-1">EPUB format only</p>
              </div>
            </div>
            <Button type="submit" className="w-full">Upload Book</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
