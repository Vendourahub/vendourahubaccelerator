import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export default function RefinedDashboard() {
  // Mock data
  const founderName = "Sarah Chen";
  const currentWeek = 3;
  const totalWeeks = 12;
  const currentStage = 1;
  const stageName = "REVENUE BASELINE";
  const stageProgress = "1/2 reports complete";
  const baselineRevenue = 2400;
  const currentRevenue = 3100;
  const revenueDelta = 1.29;
  const nextAction = "Submit Weekly Report";
  const nextDeadline = "Friday, Feb 14 at 6:00pm";
  const hoursRemaining = 28;
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top Nav */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="font-semibold">Vendoura</div>
          <div className="flex items-center gap-6 text-sm text-neutral-600">
            <div>Cohort 2026_03</div>
            <div>{founderName}</div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-12">
        <Link to="/refined" className="text-sm text-neutral-600 hover:text-black mb-8 inline-block">← Back to Refined Index</Link>
        
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Dashboard</div>
          <h1 className="text-3xl">Week {currentWeek} of {totalWeeks}</h1>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {/* Week Progress */}
          <div className="bg-white p-8 rounded-sm border border-neutral-200">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Week Progress</div>
            <div className="text-4xl font-semibold mb-4">{currentWeek}<span className="text-neutral-400">/{totalWeeks}</span></div>
            <div className="bg-neutral-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-neutral-900 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Current Stage */}
          <div className="bg-white p-8 rounded-sm border border-neutral-200">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Current Stage</div>
            <div className="text-4xl font-semibold mb-2">Stage {currentStage}</div>
            <div className="text-sm text-neutral-600 mb-2">{stageName}</div>
            <div className="text-xs text-neutral-500">{stageProgress}</div>
          </div>
          
          {/* Revenue Delta */}
          <div className="bg-white p-8 rounded-sm border border-neutral-200">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Revenue Delta</div>
            <div className="text-4xl font-semibold mb-2">{revenueDelta}x</div>
            <div className="text-sm text-neutral-600">
              ${currentRevenue.toLocaleString()} current
            </div>
            <div className="text-xs text-neutral-500">
              ${baselineRevenue.toLocaleString()} baseline
            </div>
          </div>
        </div>
        
        {/* Next Required Action */}
        <div className="bg-white p-10 rounded-sm border-2 border-neutral-900 mb-12">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Next Required Action</div>
              <div className="text-2xl font-semibold mb-3">{nextAction}</div>
              <div className="text-neutral-600 mb-1">Due: {nextDeadline}</div>
              <div className="text-sm text-neutral-500">{hoursRemaining} hours remaining</div>
            </div>
            <Link 
              to="/refined/report" 
              className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-sm hover:bg-neutral-800 transition-colors"
            >
              <span>Go to Report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        {/* Weekly Loop Status */}
        <div className="bg-white p-8 rounded-sm border border-neutral-200 mb-12">
          <div className="text-sm font-semibold mb-6">Week {currentWeek} Loop Status</div>
          <div className="space-y-3">
            <LoopStep 
              number="1"
              name="Commit"
              status="complete"
              detail="Reach out to 10 past clients for referrals"
            />
            <LoopStep 
              number="2"
              name="Execute"
              status="in-progress"
              detail="In progress (Monday-Friday)"
            />
            <LoopStep 
              number="3"
              name="Report"
              status="pending"
              detail="Due Friday 6pm"
            />
            <LoopStep 
              number="4"
              name="Diagnose"
              status="locked"
              detail="Unlocks after report submitted"
            />
            <LoopStep 
              number="5"
              name="Adjust"
              status="locked"
              detail="Unlocks after diagnosis"
            />
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-4">
          <Link to="/refined/commit" className="p-4 bg-white border border-neutral-200 hover:border-neutral-400 rounded-sm transition-colors">
            <div className="text-sm font-medium">Commit</div>
          </Link>
          <Link to="/screens/execute" className="p-4 bg-white border border-neutral-200 hover:border-neutral-400 rounded-sm transition-colors">
            <div className="text-sm font-medium">Execute</div>
          </Link>
          <Link to="/refined/map" className="p-4 bg-white border border-neutral-200 hover:border-neutral-400 rounded-sm transition-colors">
            <div className="text-sm font-medium">Revenue Map</div>
          </Link>
          <Link to="/screens/rsd" className="p-4 bg-white border border-neutral-200 hover:border-neutral-400 rounded-sm transition-colors">
            <div className="text-sm font-medium">RSD</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoopStep({ 
  number, 
  name, 
  status, 
  detail 
}: { 
  number: string; 
  name: string; 
  status: 'complete' | 'in-progress' | 'pending' | 'locked';
  detail: string;
}) {
  const getStatusStyles = () => {
    switch (status) {
      case 'complete': 
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          badge: 'bg-green-100 text-green-700',
          text: '✓ Complete'
        };
      case 'in-progress': 
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          badge: 'bg-blue-100 text-blue-700',
          text: '→ In Progress'
        };
      case 'pending': 
        return {
          border: 'border-neutral-200',
          bg: 'bg-white',
          badge: 'bg-neutral-100 text-neutral-600',
          text: 'Pending'
        };
      case 'locked': 
        return {
          border: 'border-neutral-200',
          bg: 'bg-neutral-50',
          badge: 'bg-neutral-100 text-neutral-500',
          text: 'Locked'
        };
    }
  };
  
  const styles = getStatusStyles();
  
  return (
    <div className={`border ${styles.border} ${styles.bg} p-4 rounded-sm flex items-start gap-4`}>
      <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-sm font-medium flex-shrink-0">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="font-medium">{name}</div>
          <div className={`text-xs px-2 py-1 rounded-sm ${styles.badge}`}>
            {styles.text}
          </div>
        </div>
        <div className="text-sm text-neutral-600">{detail}</div>
      </div>
    </div>
  );
}
