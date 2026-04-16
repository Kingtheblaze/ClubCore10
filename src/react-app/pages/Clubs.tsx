import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Users, ArrowRight, Loader2 } from "lucide-react";

interface Club {
  id: number;
  name: string;
  description: string | null;
  logo_url: string | null;
  contact_email: string | null;
  google_form_url: string | null;
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await fetch("/api/clubs");
        if (res.ok) {
          setClubs(await res.json());
        }
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="min-h-screen dark bg-background">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative min-h-screen">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">CC</span>
              </div>
              <span className="font-display font-semibold">ClubCore</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/track">
                <Button variant="outline" size="sm">Track Application</Button>
              </Link>
              <Link to="/login">
                <Button size="sm">Club Login</Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl font-bold mb-2">Browse Clubs</h1>
            <p className="text-muted-foreground">
              Find the perfect club for you and apply in seconds
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            </div>
          ) : clubs.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-xl">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No clubs registered yet</p>
              <p className="text-sm text-muted-foreground">
                Are you a club admin?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Register your club
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {club.logo_url ? (
                        <img src={club.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <Users className="w-7 h-7 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-display font-semibold text-lg truncate">{club.name}</h3>
                        {club.google_form_url && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-status-selected/10 text-status-selected border border-status-selected/20 animate-pulse">
                            Hiring
                          </span>
                        )}
                      </div>
                      {club.contact_email && (
                        <p className="text-xs text-muted-foreground truncate">{club.contact_email}</p>
                      )}
                    </div>
                  </div>

                  {club.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {club.description}
                    </p>
                  )}

                  <Link to={`/apply/${club.id}`}>
                    <Button className="w-full group-hover:glow-primary">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
