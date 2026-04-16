import { Link } from "react-router";
import { Button } from "@/react-app/components/ui/button";
import StatusTracker from "@/react-app/components/StatusTracker";
import { ArrowRight, CheckCircle, Users, Zap, Shield, BarChart3, Bell, FileText } from "lucide-react";
export default function HomePage() {
  return <div className="min-h-screen dark bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">CC</span>
              </div>
              <span className="font-display font-semibold text-lg">ClubCore</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <Link to="/clubs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Browse Clubs
              </Link>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#for-clubs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                For Clubs
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="glow-primary">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Zap className="w-4 h-4" />
                Real-time tracking for college clubs
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                No More
                <span className="text-gradient"> WhatsApp PDFs</span>
                <br />
                or Spreadsheet Chaos
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                ClubCore replaces scattered Google Forms and endless WhatsApp groups with a 
                live applicant tracking system. Students see their status instantly. 
                Club heads manage everything in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/clubs">
                  <Button size="lg" className="glow-primary w-full sm:w-auto">
                    Browse Clubs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/track">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Track Application
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-status-selected" />
                  Free for students
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-status-selected" />
                  Instant updates
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-status-selected" />
                  No signup required
                </div>
              </div>
            </div>
            
            {/* Right - Status Tracker Demo */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl opacity-30" />
              <div className="relative space-y-4">
                <StatusTracker currentStatus="interview" clubName="Tech Entrepreneurship Cell" applicationDate="Jan 10, 2025" interviewDate="Jan 18, 2025" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-status-selected/10 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-status-selected" />
                      </div>
                      <span className="text-sm font-medium">Cultural Society</span>
                    </div>
                    <span className="text-xs text-status-selected font-medium">Selected!</span>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-status-pending/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-status-pending" />
                      </div>
                      <span className="text-sm font-medium">Finance Club</span>
                    </div>
                    <span className="text-xs text-status-pending font-medium">Under Review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-4">The Recruitment Nightmare</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every semester, the same chaos unfolds across college campuses
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-background border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Google Forms Black Hole</h3>
              <p className="text-sm text-muted-foreground">
                Students submit applications and hear nothing. Was it rejected? Still processing? 
                Lost in a spreadsheet? Nobody knows.
              </p>
            </div>
            
            <div className="bg-background border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">WhatsApp PDF Chaos</h3>
              <p className="text-sm text-muted-foreground">
                Club heads post a 10-page PDF of "Selected Roll Numbers" in a group. 
                500 students scroll and search for their number.
              </p>
            </div>
            
            <div className="bg-background border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Spreadsheet Hell</h3>
              <p className="text-sm text-muted-foreground">
                Club coordinators juggle Excel sheets, manually track 300+ applicants, 
                and inevitably lose track of who's been interviewed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold mb-4">
              One Dashboard. <span className="text-gradient">Complete Clarity.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ClubCore brings HR-grade applicant tracking to college clubs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
            icon: Zap,
            title: "Real-Time Status Updates",
            description: "Students see their application status the moment it changes. No more waiting or wondering."
          }, {
            icon: Users,
            title: "Multi-Club Dashboard",
            description: "Applied to 5 clubs? Track all applications in one place with personalized updates."
          }, {
            icon: Shield,
            title: "Club Admin Portal",
            description: "Manage applications, schedule interviews, and announce results with a single click."
          }, {
            icon: Bell,
            title: "Instant Notifications",
            description: "Get notified when your status changes. No more checking WhatsApp groups every hour."
          }, {
            icon: BarChart3,
            title: "Analytics for Clubs",
            description: "Track applicant flow, interview completion rates, and more with built-in analytics."
          }, {
            icon: FileText,
            title: "Activity Management",
            description: "Clubs can showcase their events, activities, and recruitment timeline in one place."
          }].map((feature, i) => <div key={i} className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple for students. Powerful for club administrators.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* For Students */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                For Students
              </div>
              <div className="space-y-8">
                {[{
                step: "1",
                title: "Enter Your Roll Number",
                description: "No signup. No password. Just your roll number."
              }, {
                step: "2",
                title: "See All Applications",
                description: "View every club you've applied to in one dashboard."
              }, {
                step: "3",
                title: "Track Live Status",
                description: "Applied → Interview → Selected. Watch it happen in real-time."
              }].map(item => <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-primary-foreground">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
            
            {/* For Clubs */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
                For Club Admins
              </div>
              <div className="space-y-8">
                {[{
                step: "1",
                title: "Create Your Club Profile",
                description: "Sign up with Google. Set up your club in minutes."
              }, {
                step: "2",
                title: "Import or Collect Applications",
                description: "Create forms or import from existing spreadsheets."
              }, {
                step: "3",
                title: "Update Status with One Click",
                description: "Dropdown select: Interview → Selected. Student sees it instantly."
              }].map(item => <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-accent-foreground">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="font-display font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="for-clubs" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-card border border-border rounded-3xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 gradient-mesh opacity-50" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold mb-4">
                  Ready to Streamline Your Club Recruitment?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Join dozens of college clubs already using ClubCore to manage their recruitment process. 
                  Free to get started, powerful enough to scale.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/login">
                    <Button size="lg" className="glow-primary w-full sm:w-auto">
                      Register Your Club
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to="/track">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      I'm a Student
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-background/50 backdrop-blur border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Tech Entrepreneurship Cell</p>
                      <p className="text-xs text-muted-foreground">247 applicants this season</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Applied</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Interviewed</span>
                      <span className="font-medium text-status-interview">89</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Selected</span>
                      <span className="font-medium text-status-selected">32</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">CC</span>
              </div>
              <span className="font-display font-semibold">ClubCore</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for college clubs. Loved by students.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/clubs" className="hover:text-foreground transition-colors">Browse Clubs</Link>
              <Link to="/track" className="hover:text-foreground transition-colors">Track Application</Link>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>;
}
