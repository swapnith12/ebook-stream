import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEMO_ACCOUNTS = [
  { label: "Reader", email: "user@example.com", password: "user123" },
  { label: "Admin", email: "admin@example.com", password: "admin123" },
];

const OAUTH_ERRORS: Record<string, string> = {
  google_failed: "Google sign-in failed. Please try again.",
  google_not_configured: "Google sign-in is not configured on the server.",
};

export default function LoginPage() {
  const { login, loginWithGoogle, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(OAUTH_ERRORS[searchParams.get("error") ?? ""] ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirect} replace />;
  }

  const submit = async (emailValue: string, passwordValue: string) => {
    setError("");
    setIsSubmitting(true);
    try {
      const user = await login(emailValue, passwordValue);
      toast({ title: "Welcome back!", description: `Signed in as ${user.name ?? user.email}.` });
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(email, password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Sign in to start reading books</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" className="w-full gap-2" onClick={loginWithGoogle}>
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.2 14.7 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12S6.6 21.8 12 21.8c5.7 0 9.4-4 9.4-9.6 0-.6-.1-1.1-.2-1.6H12z" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or use a demo account</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-xs text-center text-muted-foreground uppercase">Demo accounts (click to sign in)</p>
            {DEMO_ACCOUNTS.map((acct) => (
              <button
                key={acct.email}
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setEmail(acct.email);
                  setPassword(acct.password);
                  submit(acct.email, acct.password);
                }}
                className="w-full flex justify-between p-2 rounded bg-muted text-xs text-muted-foreground hover:bg-muted/70 transition-colors disabled:opacity-50"
              >
                <span>{acct.label}: {acct.email}</span>
                <span>{acct.password}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
