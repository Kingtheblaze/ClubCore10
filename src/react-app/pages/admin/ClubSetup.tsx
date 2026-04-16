import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/react-app/lib/auth";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Button } from "@/react-app/components/ui/button";
import { Input } from "@/react-app/components/ui/input";
import { Textarea } from "@/react-app/components/ui/textarea";
import { Label } from "@/react-app/components/ui/label";
import { Loader2, Save, Building } from "lucide-react";

interface ClubData {
  id?: number;
  name: string;
  description: string;
  logo_url: string;
  contact_email: string;
  google_form_url?: string;
}

export default function ClubSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isNewClub, setIsNewClub] = useState(true);
  const [formData, setFormData] = useState<ClubData>({
    name: "",
    description: "",
    logo_url: "",
    contact_email: "",
    google_form_url: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          if (data.club) {
            setFormData({
              id: data.club.id,
              name: data.club.name || "",
              description: data.club.description || "",
              logo_url: data.club.logo_url || "",
              contact_email: data.club.contact_email || "",
              google_form_url: data.club.google_form_url || "",
            });
            setIsNewClub(false);
          } else if (data.email) {
            setFormData((prev) => ({ ...prev, contact_email: data.email }));
          }
        }
      } catch (error) {
        console.error("Error fetching club:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchClub();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/clubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage(isNewClub ? "Club created successfully!" : "Club updated successfully!");
        setIsNewClub(false);
        if (isNewClub) {
          setTimeout(() => navigate("/admin"), 1500);
        }
      } else {
        const error = await res.json();
        setMessage(error.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Failed to save club. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Club Settings">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNewClub ? "Set Up Your Club" : "Club Settings"}>
      <div className="max-w-2xl">
        {isNewClub && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Building className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-lg mb-1">Welcome to ClubCore!</h2>
                <p className="text-muted-foreground text-sm">
                  Let's set up your club profile. This information will be visible to students
                  when they apply.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <Label htmlFor="name">Club Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Tech Entrepreneurship Cell"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Tell students about your club, its mission, and what makes it special..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
                placeholder="club@example.com"
              />
            </div>

            <div>
              <Label htmlFor="logo_url">Logo URL (optional)</Label>
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, logo_url: e.target.value }))}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste a link to your club's logo image
              </p>
            </div>

            <div>
              <Label htmlFor="google_form_url">Google Form URL (for Applications)</Label>
              <Input
                id="google_form_url"
                type="url"
                value={formData.google_form_url || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, google_form_url: e.target.value }))}
                placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Paste your Google Form embed URL here to start accepting applications
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg text-sm ${
                message.includes("success")
                  ? "bg-status-selected/10 text-status-selected border border-status-selected/20"
                  : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting} className="glow-primary">
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isNewClub ? "Create Club" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
