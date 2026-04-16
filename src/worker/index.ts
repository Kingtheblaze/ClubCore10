import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { createClient } from "@supabase/supabase-js";

const MOCHA_SESSION_TOKEN_COOKIE_NAME = "mocha_session_token";

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

interface Variables {
  user: {
    id: string;
    email: string;
    name: string;
  };
  supabase: any;
}

const mockUser = {
  id: "mock-admin-id",
  email: "admin@clubcore.com",
  name: "Club Admin",
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Middleware to initialize Supabase
app.use("*", async (c, next) => {
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY);
  c.set("supabase", supabase);
  await next();
});

const authMiddleware = async (c: any, next: () => Promise<void>) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);
  const userId = getCookie(c, "clubcore_user_id");
  const userEmail = getCookie(c, "clubcore_user_email");
  
  if (sessionToken === "mock-session-token" && userId) {
    c.set("user", {
      id: userId,
      email: userEmail || "",
      name: userEmail?.split("@")[0] || "User",
    });
    await next();
  } else {
    return c.json({ error: "Unauthorized" }, 401);
  }
};

// ============ AUTH ROUTES ============

// Get Google OAuth redirect URL
app.get("/api/oauth/google/redirect_url", async (c) => {
  return c.json({ redirectUrl: "/login" }, 200);
});

// Exchange code for session token
app.post("/api/sessions", async (c) => {
  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "mock-session-token", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

// Get current user
app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const supabase = c.get("supabase");
  
  // Check if user has a club registered
  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("admin_user_id", user.id)
    .single();
  
  return c.json({
    ...user,
    club: club || null,
  });
});

// Logout
app.get("/api/logout", async (c) => {
  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// ============ CLUB ROUTES ============

// Create or update club profile
app.post("/api/clubs", authMiddleware, async (c) => {
  const user = c.get("user");
  const supabase = c.get("supabase");
  const body = await c.req.json();
  
  const { name, description, logo_url, contact_email, google_form_url } = body;
  
  if (!name) {
    return c.json({ error: "Club name is required" }, 400);
  }
  
  // Check if user already has a club
  const { data: existing } = await supabase
    .from("clubs")
    .select("id")
    .eq("admin_user_id", user.id)
    .single();
  
  const now = new Date().toISOString();
  
  if (existing) {
    // Update existing club
    const { data: updated, error } = await supabase
      .from("clubs")
      .update({ name, description, logo_url, contact_email, google_form_url, updated_at: now })
      .eq("id", existing.id)
      .select()
      .single();
    
    if (error) return c.json({ error: error.message }, 500);
    return c.json(updated);
  } else {
    // Create new club
    const { data: newClub, error } = await supabase
      .from("clubs")
      .insert({ name, description, logo_url, contact_email, google_form_url, admin_user_id: user.id, created_at: now, updated_at: now })
      .select()
      .single();
    
    if (error) return c.json({ error: error.message }, 500);
    return c.json(newClub);
  }
});

// Get club by ID (public)
app.get("/api/clubs/:id", async (c) => {
  const id = c.req.param("id");
  const supabase = c.get("supabase");
  const { data: club } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", id)
    .single();
  
  if (!club) {
    return c.json({ error: "Club not found" }, 404);
  }
  
  return c.json(club);
});

// Get all clubs (public)
app.get("/api/clubs", async (c) => {
  const supabase = c.get("supabase");
  const { data: clubs } = await supabase
    .from("clubs")
    .select("*")
    .order("name", { ascending: true });
  
  return c.json(clubs || []);
});

// ============ ACTIVITY ROUTES ============

// Create activity
app.post("/api/activities", authMiddleware, async (c) => {
  const user = c.get("user");
  const supabase = c.get("supabase");
  const body = await c.req.json();
  
  // Get user's club
  const { data: club } = await supabase
    .from("clubs")
    .select("id")
    .eq("admin_user_id", user.id)
    .single();
  
  if (!club) {
    return c.json({ error: "You must create a club first" }, 400);
  }
  
  const { title, description, activity_date, activity_time, location, image_url } = body;
  
  if (!title) {
    return c.json({ error: "Activity title is required" }, 400);
  }
  
  const now = new Date().toISOString();
  
  const { data: newActivity, error } = await supabase
    .from("activities")
    .insert({ club_id: club.id, title, description, activity_date, activity_time, location, image_url, created_at: now, updated_at: now })
    .select()
    .single();
  
  if (error) return c.json({ error: error.message }, 500);
  return c.json(newActivity);
});

// Get activities for a club
app.get("/api/clubs/:clubId/activities", async (c) => {
  const clubId = c.req.param("clubId");
  const supabase = c.get("supabase");
  
  const { data: activities } = await supabase
    .from("activities")
    .select("*")
    .eq("club_id", clubId)
    .order("activity_date", { ascending: false });
  
  return c.json(activities || []);
});

// Delete activity
app.delete("/api/activities/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const activityId = c.req.param("id");
  const supabase = c.get("supabase");
  
  // Verify ownership via join
  const { data: activity } = await supabase
    .from("activities")
    .select("id, clubs!inner(admin_user_id)")
    .eq("id", activityId)
    .eq("clubs.admin_user_id", user.id)
    .single();
  
  if (!activity) {
    return c.json({ error: "Activity not found or unauthorized" }, 404);
  }
  
  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", activityId);
  
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

// ============ APPLICATION ROUTES ============

// Create application (public - students apply)
app.post("/api/applications", async (c) => {
  const body = await c.req.json();
  const supabase = c.get("supabase");
  
  const { club_id, student_name, roll_number, email, phone, why_join } = body;
  
  if (!club_id || !student_name || !roll_number || !email) {
    return c.json({ error: "Club ID, student name, roll number, and email are required" }, 400);
  }
  
  // Check if already applied
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("club_id", club_id)
    .eq("roll_number", roll_number.toUpperCase())
    .single();
  
  if (existing) {
    return c.json({ error: "You have already applied to this club" }, 400);
  }
  
  const now = new Date().toISOString();
  const { data: newApp, error } = await supabase
    .from("applications")
    .insert({ club_id, student_name, roll_number: roll_number.toUpperCase(), email, phone, why_join, status: "applied", created_at: now, updated_at: now })
    .select()
    .single();
  
  if (error) return c.json({ error: error.message }, 500);
  return c.json(newApp);
});

// Track applications by roll number (public)
app.get("/api/track/:rollNumber", async (c) => {
  const rollNumber = c.req.param("rollNumber").toUpperCase();
  const supabase = c.get("supabase");
  
  const { data: applications } = await supabase
    .from("applications")
    .select("*, clubs(name, logo_url)")
    .eq("roll_number", rollNumber)
    .order("created_at", { ascending: false });
  
  return c.json(applications || []);
});

// Get applications for admin's club
app.get("/api/admin/applications", authMiddleware, async (c) => {
  const user = c.get("user");
  const supabase = c.get("supabase");
  
  const { data: club } = await supabase
    .from("clubs")
    .select("id")
    .eq("admin_user_id", user.id)
    .single();
  
  if (!club) {
    return c.json({ error: "No club found" }, 400);
  }
  
  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("club_id", club.id)
    .order("created_at", { ascending: false });
  
  return c.json(applications || []);
});

// Update application status (admin only)
app.patch("/api/applications/:id", authMiddleware, async (c) => {
  const user = c.get("user");
  const appId = c.req.param("id");
  const body = await c.req.json();
  const supabase = c.get("supabase");
  
  const { status, interview_date, interview_time, notes } = body;
  
  // Verify ownership via join
  const { data: application } = await supabase
    .from("applications")
    .select("id, clubs!inner(admin_user_id)")
    .eq("id", appId)
    .eq("clubs.admin_user_id", user.id)
    .single();
  
  if (!application) {
    return c.json({ error: "Application not found or unauthorized" }, 404);
  }
  
  const now = new Date().toISOString();
  const { data: updated, error } = await supabase
    .from("applications")
    .update({ status, interview_date, interview_time, notes, updated_at: now })
    .eq("id", appId)
    .select()
    .single();
  
  if (error) return c.json({ error: error.message }, 500);
  return c.json(updated);
});

// ============ SEED DATA ROUTE ============

app.post("/api/admin/seed", authMiddleware, async (c) => {
  const user = c.get("user");
  const supabase = c.get("supabase");
  const now = new Date().toISOString();

  // 1. Create a sample club for this user
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .insert({
      name: "Tech Founders Club",
      description: "A community for aspiring entrepreneurs and tech enthusiasts. We build, pivot, and scale together.",
      logo_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=200&h=200&auto=format&fit=crop",
      contact_email: user.email,
      google_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSf12c6G0Z_p9zG80pP0M5031-vN5z9zG80pP0M5031vN5z/viewform?embedded=true",
      admin_user_id: user.id,
      created_at: now,
      updated_at: now
    })
    .select()
    .single();

  if (clubError) return c.json({ error: clubError.message }, 500);

  // 2. Create some activities
  await supabase.from("activities").insert([
    {
      club_id: club.id,
      title: "Startup Weekend",
      description: "Pitch, build, and launch a startup in 54 hours.",
      activity_date: "2026-05-15",
      activity_time: "18:00",
      location: "Innovation Hub",
      created_at: now,
      updated_at: now
    },
    {
      club_id: club.id,
      title: "Product Design Workshop",
      description: "Learn UX/UI fundamentals with industry experts.",
      activity_date: "2026-04-20",
      activity_time: "14:00",
      location: "Design Lab",
      created_at: now,
      updated_at: now
    }
  ]);

  // 3. Create sample applications
  const sampleApps = [
    { name: "John Doe", roll: "22BCS101", email: "john@example.com", status: "applied", note: "Passionate about AI" },
    { name: "Jane Smith", roll: "22BEC205", email: "jane@example.com", status: "interview", note: "Previous intern at Google" },
    { name: "Alex Johnson", roll: "22BME333", email: "alex@example.com", status: "selected", note: "Strong technical background" },
    { name: "Sam Wilson", roll: "22BCS042", email: "sam@example.com", status: "rejected", note: "Needs more experience in project management" }
  ];

  for (const app of sampleApps) {
    await supabase.from("applications").insert({
      club_id: club.id,
      student_name: app.name,
      roll_number: app.roll,
      email: app.email,
      status: app.status,
      notes: app.note,
      created_at: now,
      updated_at: now
    });
  }

  return c.json({ success: true, message: "Sample data seeded successfully!" });
});

export default app;
