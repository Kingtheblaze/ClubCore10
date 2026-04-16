import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/react-app/lib/auth";
import AdminLayout from "@/react-app/components/AdminLayout";
import { Button } from "@/react-app/components/ui/button";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  Plus,
  Database,
  Loader2,
} from "lucide-react";

interface UserWithClub {
  id: string;
  email: string;
  club: {
    id: number;
    name: string;
    description: string;
    google_form_url?: string;
  } | null;
}

interface Application {
  id: number;
  status: string;
  student_name: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserWithClub | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const fetchData = async () => {
    try {
      const userRes = await fetch("/api/users/me");
      if (userRes.ok) {
        const data = await userRes.json();
        setUserData(data);

        if (data.club) {
          const appsRes = await fetch("/api/admin/applications");
          if (appsRes.ok) {
            setApplications(await appsRes.json());
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSeed = async () => {
    if (!confirm("This will create a sample club and applications. Continue?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      if (res.ok) {
        alert("Sample data seeded! Page will refresh.");
        window.location.reload();
      } else {
        const data = await res.json();
        alert("Error: " + (data.error || "Failed to seed data"));
      }
    } catch (error) {
      alert("Failed to seed data");
    } finally {
      setSeeding(false);
    }
  };

  // If no club is set up, redirect to setup
  useEffect(() => {
    if (!loading && userData && !userData.club) {
      navigate("/admin/setup");
    }
  }, [loading, userData, navigate]);

  const stats = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    selected: applications.filter((a) => a.status === "selected").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const recentApplications = applications.slice(0, 5);

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      ) : (
        <div className="space-y-8">
          {/* Welcome */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold mb-2">
                  Welcome back, {user?.google_user_data?.given_name || "Admin"}!
                </h2>
                <p className="text-muted-foreground">
                  Managing <strong>{userData?.club?.name}</strong> recruitment
                </p>
              </div>
              {userData?.club?.google_form_url ? (
                <div className="flex items-center gap-2 bg-status-selected/20 text-status-selected px-3 py-1.5 rounded-lg border border-status-selected/30">
                  <div className="w-2 h-2 rounded-full bg-status-selected animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">Recruitment Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-muted/20 text-muted-foreground px-3 py-1.5 rounded-lg border border-border">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                  <span className="text-xs font-bold uppercase tracking-wider">Recruitment Inactive</span>
                </div>
              )}
            </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-2xl font-bold">{stats.total}</span>
              </div>
              <span className="text-sm text-muted-foreground">Total Applications</span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-status-pending/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-status-pending" />
                </div>
                <span className="text-2xl font-bold">{stats.applied}</span>
              </div>
              <span className="text-sm text-muted-foreground">Pending Review</span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-status-interview/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-status-interview" />
                </div>
                <span className="text-2xl font-bold">{stats.interview}</span>
              </div>
              <span className="text-sm text-muted-foreground">Interviewing</span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-status-selected/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-status-selected" />
                </div>
                <span className="text-2xl font-bold">{stats.selected}</span>
              </div>
              <span className="text-sm text-muted-foreground">Selected</span>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-status-rejected/10 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-status-rejected" />
                </div>
                <span className="text-2xl font-bold">{stats.rejected}</span>
              </div>
              <span className="text-sm text-muted-foreground">Not Selected</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Recent Applications</h3>
                <Link to="/admin/applications">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              {recentApplications.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No applications yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium text-sm">{app.student_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          app.status === "applied"
                            ? "bg-status-pending/10 text-status-pending"
                            : app.status === "interview"
                            ? "bg-status-interview/10 text-status-interview"
                            : app.status === "selected"
                            ? "bg-status-selected/10 text-status-selected"
                            : "bg-status-rejected/10 text-status-rejected"
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/admin/applications" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Manage Applications</p>
                      <p className="text-xs text-muted-foreground">
                        Review and update applicant status
                      </p>
                    </div>
                  </div>
                </Link>

                <Link to="/admin/activities" className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Plus className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Add Club Activity</p>
                      <p className="text-xs text-muted-foreground">
                        Post events and activities
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="pt-4 border-t border-border mt-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-dashed hover:bg-primary/5 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all group"
                    onClick={handleSeed}
                    disabled={seeding}
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center mr-3 ml-[-8px]">
                      {seeding ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Database className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Seed Sample Data</p>
                      <p className="text-[10px]">Populate for demo</p>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
