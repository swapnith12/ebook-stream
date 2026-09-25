import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { genres } from "@/lib/books";
import { uploadBook } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_MB = 100;

export default function AdminUploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    pageCount: "",
    publishedYear: "",
    coverUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const pickFile = (f: File | null | undefined) => {
    setError("");
    if (!f) return setFile(null);
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      return setError("Only PDF files are supported.");
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      return setError(`File is too large. Maximum size is ${MAX_FILE_MB} MB.`);
    }
    setFile(f);
    if (!form.title) update("title", f.name.replace(/\.pdf$/i, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please choose a PDF file to upload.");

    setIsSubmitting(true);
    try {
      const book = await uploadBook(
        {
          title: form.title.trim(),
          author: form.author,
          genre: form.genre,
          description: form.description,
          pageCount: form.pageCount,
          publishedYear: form.publishedYear,
          coverUrl: form.coverUrl,
        },
        file
      );
      toast({ title: "Book uploaded!", description: `"${book.title}" has been added to the catalog.` });
      navigate("/admin/books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {error && (
              <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md">{error}</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" required value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" value={form.author} onChange={(e) => update("author", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Genre</Label>
                <Select value={form.genre} onValueChange={(v) => update("genre", v)}>
                  <SelectTrigger><SelectValue placeholder="Select genre" /></SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Page Count</Label>
                <Input
                  id="pages"
                  type="number"
                  min={0}
                  placeholder="auto"
                  value={form.pageCount}
                  onChange={(e) => update("pageCount", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Published Year</Label>
                <Input
                  id="year"
                  type="number"
                  min={0}
                  max={new Date().getFullYear()}
                  value={form.publishedYear}
                  onChange={(e) => update("publishedYear", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover">Cover Image URL</Label>
              <Input
                id="cover"
                type="url"
                placeholder="Optional. Leave empty to use the PDF's first page."
                value={form.coverUrl}
                onChange={(e) => update("coverUrl", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>PDF File *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0])}
              />
              {file ? (
                <div className="flex items-center justify-between gap-3 border rounded-lg p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-8 w-8 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => pickFile(null)} disabled={isSubmitting}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); pickFile(e.dataTransfer.files?.[0]); }}
                  className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Click to upload or drag & drop</p>
                  <p className="text-xs mt-1">PDF up to {MAX_FILE_MB} MB. Stored on Cloudinary.</p>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
              ) : (
                "Upload Book"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
