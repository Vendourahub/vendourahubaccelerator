import { Link } from "react-router";
import { FileText, Layout, Lock, TestTube, Code, Palette, Users, BarChart } from "lucide-react";

export default function ProjectIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold">Vendoura — Development Hub</h1>
          <p className="text-neutral-600 mt-2">Revenue-focused accountability accelerator</p>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Public Pages */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Layout className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Public Pages</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <NavCard 
              to="/"
              title="Landing Page"
              description="Revenue-focused value prop, 12-week timeline, requirements"
              icon={<Layout className="w-5 h-5" />}
            />
            <NavCard 
              to="/apply"
              title="Application"
              description="Revenue baseline capture + commitment screening with auto-reject"
              icon={<FileText className="w-5 h-5" />}
            />
          </div>
        </section>
        
        {/* Founder Dashboard & Pages */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Founder Pages</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <NavCard 
              to="/refined/dashboard"
              title="Dashboard"
              description="Current state, next action, lock status"
              icon={<BarChart className="w-5 h-5" />}
            />
            <NavCard 
              to="/refined/commit"
              title="Weekly Commit"
              description="Force specific revenue action (Mon 9am)"
              icon={<FileText className="w-5 h-5" />}
            />
            <NavCard 
              to="/screens/execute"
              title="Execution Log"
              description="Track hours, capture evidence"
              icon={<FileText className="w-5 h-5" />}
            />
            <NavCard 
              to="/refined/report"
              title="Revenue Report"
              description="Submit revenue + evidence (Fri 6pm)"
              icon={<FileText className="w-5 h-5" />}
            />
            <NavCard 
              to="/refined/map"
              title="Revenue Map"
              description="5-stage progression + lock states"
              icon={<Layout className="w-5 h-5" />}
            />
            <NavCard 
              to="/screens/rsd"
              title="Revenue System Doc"
              description="Build repeatable playbook (Stage 4)"
              icon={<FileText className="w-5 h-5" />}
            />
          </div>
        </section>
        
        {/* Enforcement Mechanics */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Enforcement Mechanics</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <NavCard 
              to="/enforcement/locked-dashboard"
              title="Locked Dashboard"
              description="Missed commit deadline state"
              icon={<Lock className="w-5 h-5" />}
              variant="warning"
            />
            <NavCard 
              to="/enforcement/locked-report"
              title="Locked Report"
              description="Cannot submit without commit"
              icon={<Lock className="w-5 h-5" />}
              variant="warning"
            />
            <NavCard 
              to="/enforcement/evidence-rejected"
              title="Evidence Rejected"
              description="Report without valid evidence"
              icon={<Lock className="w-5 h-5" />}
              variant="warning"
            />
            <NavCard 
              to="/enforcement/late-submission"
              title="Late Submission"
              description="Mentor notified automatically"
              icon={<Lock className="w-5 h-5" />}
              variant="warning"
            />
            <NavCard 
              to="/enforcement/removal-review"
              title="Removal Review"
              description="2 consecutive misses"
              icon={<Lock className="w-5 h-5" />}
              variant="danger"
            />
            <NavCard 
              to="/enforcement/stage-locked"
              title="Stage Locked"
              description="Requirements not met"
              icon={<Lock className="w-5 h-5" />}
              variant="warning"
            />
          </div>
        </section>
        
        {/* Development Documentation */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Code className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Development Documentation</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <NavCard 
              to="/flows"
              title="Phase 1: Flow Architecture"
              description="5 critical flows mapping founder journey"
              icon={<Code className="w-5 h-5" />}
            />
            <NavCard 
              to="/page-inventory"
              title="Phase 3: Page Inventory"
              description="14 mandatory pages with enforcement justification"
              icon={<FileText className="w-5 h-5" />}
            />
            <NavCard 
              to="/screens"
              title="Phase 4: Wireframe Screens"
              description="6 core screens + 7 enforcement states"
              icon={<Layout className="w-5 h-5" />}
            />
            <NavCard 
              to="/refined"
              title="Phase 5: UI Refinement"
              description="Spacing, hierarchy, minimal color"
              icon={<Palette className="w-5 h-5" />}
            />
            <NavCard 
              to="/handoff"
              title="Phase 6: Design-to-Code Handoff"
              description="Data models, API, state logic, validation"
              icon={<Code className="w-5 h-5" />}
            />
            <NavCard 
              to="/testing"
              title="Phase 7: Founder Testing"
              description="Validate revenue movement (not UX opinions)"
              icon={<TestTube className="w-5 h-5" />}
            />
          </div>
        </section>
        
        {/* System Status */}
        <section>
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Development Status</h3>
              <Link 
                to="/phase2"
                className="text-sm text-neutral-600 hover:text-neutral-900 underline"
              >
                View Phase 2 Checklist
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <StatusItem label="Phase 0: System Freeze" status="complete" />
              <StatusItem label="Phase 1: Flow Architecture" status="complete" />
              <StatusItem label="Phase 2: Complete Implementation" status="complete" />
              <StatusItem label="Phase 3: Page Inventory Docs" status="complete" />
              <StatusItem label="Phase 4: Wireframe Screens" status="complete" />
              <StatusItem label="Phase 5: UI Refinement" status="complete" />
              <StatusItem label="Phase 6: Design Handoff" status="complete" />
              <StatusItem label="Phase 7: Testing Framework" status="complete" />
            </div>
          </div>
        </section>
        
        {/* Admin: 4 pages */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Admin / Mentor Pages</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <NavCard 
              to="/admin/cohort"
              title="Cohort Overview"
              description="Monitor all founders' weekly completion status"
              icon={<BarChart className="w-5 h-5" />}
            />
            <NavCard 
              to="/admin/analytics"
              title="Revenue Analytics"
              description="Cohort-level metrics, $ per hour by tactic"
              icon={<BarChart className="w-5 h-5" />}
            />
            <NavCard 
              to="/admin/interventions"
              title="Intervention Panel"
              description="Auto-flagged founders requiring action"
              icon={<Lock className="w-5 h-5" />}
            />
            <NavCard 
              to="/admin/tracking"
              title="Data Tracking"
              description="System health, red flags, export tools"
              icon={<BarChart className="w-5 h-5" />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function NavCard({ 
  to, 
  title, 
  description, 
  icon,
  variant = "default"
}: { 
  to: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  variant?: "default" | "warning" | "danger";
}) {
  const variantStyles = {
    default: "bg-white border-neutral-200 hover:border-neutral-400 hover:shadow-md",
    warning: "bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-md",
    danger: "bg-red-50 border-red-200 hover:border-red-400 hover:shadow-md"
  };
  
  return (
    <Link 
      to={to} 
      className={`block p-6 border-2 rounded-lg transition-all ${variantStyles[variant]}`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="text-neutral-600">{icon}</div>
        <div className="font-bold flex-1">{title}</div>
      </div>
      <p className="text-sm text-neutral-600">{description}</p>
    </Link>
  );
}

function StatusItem({ 
  label, 
  status 
}: { 
  label: string; 
  status: "complete" | "in-progress" | "pending";
}) {
  const statusConfig = {
    complete: { color: "text-green-700", bg: "bg-green-100", text: "Complete" },
    "in-progress": { color: "text-blue-700", bg: "bg-blue-100", text: "In Progress" },
    pending: { color: "text-neutral-500", bg: "bg-neutral-100", text: "Pending" }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <span className={`text-xs px-3 py-1 rounded-full ${config.bg} ${config.color} font-medium`}>
        {config.text}
      </span>
    </div>
  );
}