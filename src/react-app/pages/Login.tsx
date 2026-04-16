import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { useAuth, supabase } from "@/react-app/lib/auth";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Label } from "@/react-app/components/ui/label";
import { ArrowLeft, Users, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { user, isPending } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlError = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(urlError || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !isPending) {
      navigate("/admin");
    }
  }, [user, isPending, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      // successful login will be caught by auth.tsx onAuthStateChange listener
      // which sets the user state and redirects or we can redirect manually
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen dark bg-background">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              {/* Logo */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 bg-opacity-10 shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold">Club Admin Portal</h1>
                <p className="text-muted-foreground mt-2">
                  Sign in to manage your club's recruitment
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full glow-primary mt-6"
                  disabled={loading || isPending}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Info */}
              <p className="text-sm text-muted-foreground text-center mt-6">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            {/* Student Link */}
            <div className="text-center mt-6">
              <p className="text-muted-foreground text-sm">
                Looking to track your application?
              </p>
              <Link to="/track" className="text-primary hover:underline text-sm font-medium">
                Go to Student Tracker →
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
