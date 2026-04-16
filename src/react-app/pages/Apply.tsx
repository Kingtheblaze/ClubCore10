import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { ArrowLeft, Loader2, CheckCircle, Users } from "lucide-react";

interface Club {
  id: number;
  name: string;
  description: string | null;
  logo_url: string | null;
  contact_email: string | null;
  google_form_url: string | null;
}

export default function ApplyPage() {
  const { clubId } = useParams();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    student_name: "",
    roll_number: "",
    email: "",
    phone: "",
    why_join: "",
  });

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch(`/api/clubs/${clubId}`);
        if (res.ok) {
          setClub(await res.json());
        } else {
          setError("Club not found");
        }
      } catch {
        setError("Failed to load club");
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClub();
    }
  }, [clubId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          club_id: parseInt(clubId!),
          ...formData,
          roll_number: formData.roll_number.toUpperCase(),
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen dark bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen dark bg-background">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-status-selected/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-status-selected" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">Application Submitted!</h1>
            <p className="text-muted-foreground mb-6">
              Your application to <strong>{club?.name}</strong> has been received. 
              You can track your status using your roll number.
            </p>
            <div className="space-y-3">
              <Link to={`/track?roll=${formData.roll_number}`}>
                <Button className="w-full">Track My Application</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark bg-background">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative min-h-screen">
        {/* Header */}
        <header className="border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <Link to="/clubs" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Clubs
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-2xl mx-auto px-4 py-12">
          {error && !club ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <Link to="/clubs">
                <Button variant="outline" className="mt-4">View All Clubs</Button>
              </Link>
            </div>
          ) : club && (
            <>
              {/* Club Info */}
              <div className="bg-card border border-border rounded-xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {club.logo_url ? (
                      <img src={club.logo_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <Users className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h1 className="font-display text-xl font-bold">Apply to {club.name}</h1>
                    {club.description && (
                      <p className="text-muted-foreground text-sm mt-1">{club.description}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Application Content */}
              <div className="space-y-8">
                {club.google_form_url ? (
                  <>
                    <div className="bg-card border border-border rounded-xl p-4 overflow-hidden">
                      <div className="flex items-center gap-2 mb-4 px-2">
                        <div className="w-2 h-2 rounded-full bg-status-selected animate-pulse" />
                        <span className="text-sm font-medium">Recruitment Form</span>
                      </div>
                      <iframe
                        src={club.google_form_url}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        marginHeight={0}
                        marginWidth={0}
                        className="rounded-lg bg-white"
                      >
                        Loading…
                      </iframe>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                      <h2 className="font-display font-bold text-lg mb-2">Register for Tracking</h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Once you've filled the Google Form above, register your details here so you can track your application status.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="student_name">Full Name *</Label>
                            <Input
                              id="student_name"
                              value={formData.student_name}
                              onChange={(e) => setFormData((prev) => ({ ...prev, student_name: e.target.value }))}
                              placeholder="Enter your name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="roll_number">Roll Number *</Label>
                            <Input
                              id="roll_number"
                              value={formData.roll_number}
                              onChange={(e) => setFormData((prev) => ({ ...prev, roll_number: e.target.value.toUpperCase() }))}
                              placeholder="e.g., 21BCS001"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="your.email@college.edu"
                            required
                          />
                        </div>
                        <Button type="submit" disabled={submitting} className="w-full glow-primary">
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Complete My Registration"}
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                      <div>
                        <Label htmlFor="student_name">Full Name *</Label>
                        <Input
                          id="student_name"
                          value={formData.student_name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, student_name: e.target.value }))}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="roll_number">Roll Number *</Label>
                        <Input
                          id="roll_number"
                          value={formData.roll_number}
                          onChange={(e) => setFormData((prev) => ({ ...prev, roll_number: e.target.value.toUpperCase() }))}
                          placeholder="e.g., 21BCS001"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          You'll use this to track your application status
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@college.edu"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      <div>
                        <Label htmlFor="why_join">Why do you want to join?</Label>
                        <Textarea
                          id="why_join"
                          value={formData.why_join}
                          onChange={(e) => setFormData((prev) => ({ ...prev, why_join: e.target.value }))}
                          placeholder="Tell us about yourself and why you'd be a great fit..."
                          rows={4}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                        {error}
                      </div>
                    )}

                    <Button type="submit" disabled={submitting} className="w-full glow-primary" size="lg">
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
