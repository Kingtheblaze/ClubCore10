import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@/react-app/lib/auth";
import HomePage from "@/react-app/pages/Home";
import LoginPage from "@/react-app/pages/Login";
import RegisterPage from "@/react-app/pages/Register";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import TrackPage from "@/react-app/pages/Track";
import ClubsPage from "@/react-app/pages/Clubs";
import ApplyPage from "@/react-app/pages/Apply";
import AdminDashboard from "@/react-app/pages/admin/Dashboard";
import AdminApplications from "@/react-app/pages/admin/Applications";
import AdminActivities from "@/react-app/pages/admin/Activities";
import ClubSetup from "@/react-app/pages/admin/ClubSetup";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/apply/:clubId" element={<ApplyPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/activities" element={<AdminActivities />} />
          <Route path="/admin/setup" element={<ClubSetup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
