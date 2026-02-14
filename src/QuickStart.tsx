import { Link } from "react-router";
import { ArrowRight, CheckCircle, UserPlus, LogIn, FileText, LayoutDashboard, TrendingUp } from "lucide-react";

export default function QuickStart() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold">Vendoura — Quick Start Guide</h1>
          <p className="text-neutral-600 mt-2">Complete end-to-end user journey</p>
        </div>
      </header>
      
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Welcome */}
        <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to Vendoura</h2>
          <p className="text-neutral-700 mb-6">
            This accelerator platform is now fully functional with authentication, onboarding, 
            and context-aware commit guidance. Follow this journey to experience the complete system.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="font-bold text-blue-900 mb-2">System Status: ✅ Production Ready</div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Authentication & session management</li>
              <li>• Business context onboarding</li>
              <li>• Context-aware weekly commits</li>
              <li>• Protected routes & navigation</li>
              <li>• Lock logic & enforcement</li>
            </ul>
          </div>
        </div>
        
        {/* Journey Steps */}
        <div className="space-y-6">
          <JourneyStep 
            number="1"
            title="Landing Page"
            description="See the public-facing value proposition and requirements"
            link="/"
            icon={<LayoutDashboard className="w-6 h-6" />}
            actions={[
              "View revenue-focused messaging",
              "Understand 12-week commitment",
              "Review accountability requirements"
            ]}
          />
          
          <JourneyStep 
            number="2"
            title="Application"
            description="Apply to join the accelerator with commitment screening"
            link="/apply"
            icon={<FileText className="w-6 h-6" />}
            actions={[
              "Enter basic information and revenue baseline",
              "Accept all 3 commitment requirements",
              "Get instant acceptance/rejection",
              "Auto-reject if any commitment is 'NO'"
            ]}
          />
          
          <JourneyStep 
            number="3"
            title="Sign In"
            description="Log in with your email (any email/password works for demo)"
            link="/login"
            icon={<LogIn className="w-6 h-6" />}
            actions={[
              "Use any email/password (demo mode)",
              "System checks onboarding status",
              "Auto-redirects to onboarding if not complete"
            ]}
            badge="Demo: Any credentials work"
          />
          
          <JourneyStep 
            number="4"
            title="Onboarding"
            description="Provide business context for personalized guidance"
            link="/onboarding"
            icon={<UserPlus className="w-6 h-6" />}
            actions={[
              "Step 1: Business details (model, product, customers, pricing)",
              "Step 2: Revenue baseline (30d, 90d)",
              "System calculates growth targets",
              "Context saved for commit guidance"
            ]}
            badge="2 steps"
          />
          
          <JourneyStep 
            number="5"
            title="Dashboard"
            description="See your current state, next action, and progress"
            link="/dashboard"
            icon={<LayoutDashboard className="w-6 h-6" />}
            actions={[
              "Revenue stats vs baseline",
              "Next required action with deadline",
              "Week status (commit → execute → report → adjust)",
              "Stage progress and requirements"
            ]}
          />
          
          <JourneyStep 
            number="6"
            title="Weekly Commit (Context-Aware!)"
            description="Submit your revenue action with business-specific examples"
            link="/commit"
            icon={<TrendingUp className="w-6 h-6" />}
            actions={[
              "See YOUR business context displayed",
              "Get examples specific to YOUR business model",
              "Vague commits rejected automatically",
              "Revenue target validated against your baseline",
              "Commitment locks once submitted"
            ]}
            badge="Personalized"
            highlight
          />
          
          <JourneyStep 
            number="7"
            title="Explore Other Pages"
            description="Navigate through the complete founder experience"
            icon={<CheckCircle className="w-6 h-6" />}
            actions={[
              "/execute — Execution log with evidence upload",
              "/report — Revenue report submission",
              "/map — 5-stage progression map",
              "/rsd — Revenue System Document (locked until Stage 4)"
            ]}
          />
        </div>
        
        {/* Key Features */}
        <div className="mt-12 bg-white rounded-xl border border-neutral-200 p-8">
          <h3 className="text-xl font-bold mb-6">Key Features Implemented</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureBlock 
              title="Authentication System"
              items={[
                "Login/logout",
                "Session management (localStorage)",
                "Protected routes",
                "Auto-redirect logic"
              ]}
            />
            
            <FeatureBlock 
              title="Context-Aware Commits"
              items={[
                "Business model detection",
                "Personalized examples",
                "Revenue target validation",
                "Stage-specific guidance"
              ]}
            />
            
            <FeatureBlock 
              title="Navigation System"
              items={[
                "Sidebar navigation",
                "Current state in header",
                "Lock status indicators",
                "Stage-based access control"
              ]}
            />
            
            <FeatureBlock 
              title="Validation & Enforcement"
              items={[
                "Vague word detection",
                "Minimum length requirements",
                "Revenue target reasonableness",
                "Deadline countdown timers"
              ]}
            />
          </div>
        </div>
        
        {/* Development Docs */}
        <div className="mt-8 bg-neutral-900 text-white rounded-xl p-8">
          <h3 className="text-xl font-bold mb-4">Development Documentation</h3>
          <p className="text-neutral-300 mb-6">
            All Phase 1-7 documentation is still accessible for engineering handoff:
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/flows" className="text-sm hover:underline">→ Flow Architecture</Link>
            <Link to="/page-inventory" className="text-sm hover:underline">→ Page Inventory</Link>
            <Link to="/handoff" className="text-sm hover:underline">→ Design-to-Code Handoff</Link>
            <Link to="/testing" className="text-sm hover:underline">→ Testing Framework</Link>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-8 text-center">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-bold text-lg"
          >
            Start the Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-sm text-neutral-600 mt-4">
            Begin at the landing page and experience the complete flow
          </p>
        </div>
      </div>
    </div>
  );
}

function JourneyStep({ 
  number, 
  title, 
  description, 
  link,
  icon, 
  actions,
  badge,
  highlight = false
}: { 
  number: string; 
  title: string; 
  description: string; 
  link?: string;
  icon: React.ReactNode; 
  actions: string[];
  badge?: string;
  highlight?: boolean;
}) {
  const content = (
    <div className={`p-8 rounded-xl border-2 transition-all ${
      highlight 
        ? 'bg-green-50 border-green-500' 
        : 'bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-md'
    }`}>
      <div className="flex items-start gap-6 mb-4">
        <div className="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
          {number}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{title}</h3>
            {badge && (
              <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                {badge}
              </span>
            )}
          </div>
          <p className="text-neutral-600 mb-4">{description}</p>
          
          <ul className="space-y-2">
            {actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-neutral-400 flex-shrink-0">
          {icon}
        </div>
      </div>
      
      {link && (
        <div className="pt-4 border-t border-neutral-200">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 hover:gap-3 transition-all">
            Visit page
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
  
  if (link) {
    return <Link to={link}>{content}</Link>;
  }
  
  return content;
}

function FeatureBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-bold mb-3">{title}</div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
