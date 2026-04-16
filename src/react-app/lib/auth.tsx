import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface GoogleUserData {
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  google_user_data?: GoogleUserData;
}

interface AuthContextType {
  user: User | null;
  isPending: boolean;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata.full_name || session.user.email?.split("@")[0] || "User",
          google_user_data: session.user.user_metadata as GoogleUserData,
        });
      }
      setIsPending(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata.full_name || session.user.email?.split("@")[0] || "User",
          google_user_data: session.user.user_metadata as GoogleUserData,
        });

        // Sync with backend
        document.cookie = `mocha_session_token=mock-session-token; path=/; samesite=none; secure`;
        document.cookie = `clubcore_user_id=${session.user.id}; path=/; samesite=none; secure`;
        document.cookie = `clubcore_user_email=${session.user.email}; path=/; samesite=none; secure`;
      } else {
        setUser(null);
        document.cookie = `mocha_session_token=; path=/; max-age=0; samesite=none; secure`;
        document.cookie = `clubcore_user_id=; path=/; max-age=0; samesite=none; secure`;
        document.cookie = `clubcore_user_email=; path=/; max-age=0; samesite=none; secure`;
      }
      setIsPending(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    setIsPending(true);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isPending, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
