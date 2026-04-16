import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import StatusTracker from "@/react-app/components/StatusTracker";
import { Search, Loader2, FileQuestion } from "lucide-react";

interface Application {
  id: number;
  club_id: number;
  club_name: string;
  club_logo: string | null;
  student_name: string;
  roll_number: string;
  status: "applied" | "interview" | "selected" | "rejected";
  interview_date: string | null;
  interview_time: string | null;
  created_at: string;
}

export default function TrackPage() {
  const [rollNumber, setRollNumber] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/track/${encodeURIComponent(rollNumber.trim())}`);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setApplications(data);
      setSearched(true);
    } catch {
      setError("Failed to fetch applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen dark bg-background">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative min-h-screen">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">CC</span>
              </div>
              <span className="font-display font-semibold">ClubCore</span>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="sm">
                Club Admin Login
              </Button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Track Your Applications</h1>
            <p className="text-muted-foreground">
              Enter your roll number to see the status of all your club applications
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your roll number (e.g., 21BCS001)"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                className="bg-card text-lg h-12"
              />
              <Button type="submit" size="lg" disabled={loading || !rollNumber.trim()}>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </form>

          {/* Results */}
          {searched && (
            <div className="space-y-6">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <FileQuestion className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">No Applications Found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    We couldn't find any applications with roll number <strong>{rollNumber}</strong>. 
                    Make sure you've entered the correct roll number or apply to clubs first.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold">
                      Applications for {applications[0]?.student_name || rollNumber}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {applications.length} application{applications.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {applications.map((app) => (
                      <StatusTracker
                        key={app.id}
                        currentStatus={app.status}
                        clubName={app.club_name}
                        applicationDate={formatDate(app.created_at)}
                        interviewDate={app.interview_date ? formatDate(app.interview_date) : undefined}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Initial State */}
          {!searched && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                  <h3 className="font-display font-semibold mb-4">How It Works</h3>
                  <div className="space-y-3 text-sm text-left">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                      <p className="text-muted-foreground">Enter your college roll number above</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                      <p className="text-muted-foreground">See all clubs you've applied to</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                      <p className="text-muted-foreground">Track your status: Applied → Interview → Selected</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  No signup required. Just your roll number.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
