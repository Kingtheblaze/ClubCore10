import { useEffect, useState } from "react";
import { useAuth } from "@/react-app/lib/auth";
import AdminLayout from "@/react-app/components/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/react-app/components/ui/select";
import { Input } from "@/react-app/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/react-app/components/ui/table";
import { Search, Filter, Loader2 } from "lucide-react";

interface Application {
  id: number;
  student_name: string;
  roll_number: string;
  email: string;
  phone: string | null;
  why_join: string | null;
  status: "applied" | "interview" | "selected" | "rejected";
  interview_date: string | null;
  interview_time: string | null;
  notes: string | null;
  created_at: string;
}

const statusOptions = [
  { value: "applied", label: "Applied", color: "bg-status-pending/10 text-status-pending" },
  { value: "interview", label: "Interview", color: "bg-status-interview/10 text-status-interview" },
  { value: "selected", label: "Selected", color: "bg-status-selected/10 text-status-selected" },
  { value: "rejected", label: "Rejected", color: "bg-status-rejected/10 text-status-rejected" },
];

export default function AdminApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/admin/applications");
        if (res.ok) {
          setApplications(await res.json());
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  const handleStatusChange = async (appId: number, newStatus: string) => {
    setUpdating(appId);
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? updated : app))
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.student_name.toLowerCase().includes(search.toLowerCase()) ||
      app.roll_number.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout title="Applications">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, roll number, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats Row */}
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Showing {filteredApplications.length} of {applications.length} applications
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-xl">
            <p className="text-muted-foreground mb-2">No applications yet</p>
            <p className="text-sm text-muted-foreground">
              Applications will appear here when students apply to your club
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.student_name}</TableCell>
                    <TableCell className="font-mono text-sm">{app.roll_number}</TableCell>
                    <TableCell className="text-muted-foreground">{app.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusChange(app.id, value)}
                        disabled={updating === app.id}
                      >
                        <SelectTrigger className="w-36">
                          {updating === app.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <SelectValue />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <span className={`px-2 py-0.5 rounded-full text-xs ${status.color}`}>
                                {status.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
