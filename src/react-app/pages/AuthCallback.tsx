import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/react-app/lib/auth";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const { exchangeCodeForSessionToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    exchangeCodeForSessionToken()
      .then(() => {
        // Will redirect after user is loaded
      })
      .catch((error) => {
        console.error("Auth error:", error);
        navigate("/login?error=auth_failed");
      });
  }, [exchangeCodeForSessionToken, navigate]);

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen dark bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}
