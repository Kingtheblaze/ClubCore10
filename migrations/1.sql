
-- Clubs table
CREATE TABLE clubs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  contact_email TEXT,
  google_form_url TEXT,
  admin_user_id TEXT NOT NULL,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE INDEX idx_clubs_admin ON clubs(admin_user_id);

-- Activities table
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  club_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activity_date DATE,
  activity_time TEXT,
  location TEXT,
  image_url TEXT,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE INDEX idx_activities_club ON activities(club_id);

-- Applications table
CREATE TABLE applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  club_id INTEGER NOT NULL,
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  why_join TEXT,
  status TEXT NOT NULL,
  interview_date DATE,
  interview_time TEXT,
  notes TEXT,
  created_at DATETIME,
  updated_at DATETIME
);

CREATE INDEX idx_applications_club ON applications(club_id);
CREATE INDEX idx_applications_roll ON applications(roll_number);
CREATE INDEX idx_applications_status ON applications(status);
