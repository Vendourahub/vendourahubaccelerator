import { Link } from "react-router";
import { AlertTriangle, Lock } from "lucide-react";

export default function FounderDashboard() {
  // Mock data - demonstrating NORMAL state (on track)
  const founderName = "Sarah Chen";
  const currentWeek = 3;
  const totalWeeks = 12;
  const currentStage = 1;
  const stageName = "REVENUE BASELINE";
  const stageProgress = "1/2 reports complete";
  const baselineRevenue = 2400;
  const currentRevenue = 3100;
  const revenueDelta = 1.29; // 1.29x baseline
  const nextAction = "SUBMIT WEEKLY REPORT";
  const nextDeadline = "Friday, Feb 14 at 6:00pm";
  const hoursRemaining = 28;
  const isLocked = false;
  const mentorFlag = false;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">COHORT_2026_03</div>
          <div className="text-sm">{founderName}</div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto p-8">
        <Link to="/screens" className="text-sm underline mb-4 inline-block">← Back to Screen Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">SCREEN 1 OF 6</div>
          <h1 className="text-2xl mb-2">FOUNDER DASHBOARD</h1>
          <p className="text-sm text-gray-600">Current state + next required action</p>
        </div>
        
        {/* Status Flags */}
        {isLocked && (
          <div className="mb-6 p-4 border-2 border-red-600 bg-red-50 flex items-start gap-3">
            <Lock className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-bold mb-1">WEEK LOCKED</div>
              <div className="text-sm">You cannot proceed. Reason: No commit submitted by Monday 9am.</div>
              <div className="text-sm mt-2">
                <Link to="/screens/commit" className="underline">Submit commit now →</Link>
              </div>
            </div>
          </div>
        )}
        
        {mentorFlag && (
          <div className="mb-6 p-4 border-2 border-black bg-gray-100 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-bold mb-1">MENTOR VISIBILITY FLAG</div>
              <div className="text-sm">Your mentor has been notified of a late submission.</div>
            </div>
          </div>
        )}
        
        {/* Primary Info Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Week Progress */}
          <div className="border-2 border-black p-6">
            <div className="text-xs text-gray-500 mb-2">WEEK</div>
            <div className="text-3xl font-bold mb-1">{currentWeek} of {totalWeeks}</div>
            <div className="mt-3 bg-gray-200 h-2">
              <div 
                className="bg-black h-2" 
                style={{ width: `${(currentWeek / totalWeeks) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Stage */}
          <div className="border-2 border-black p-6">
            <div className="text-xs text-gray-500 mb-2">CURRENT STAGE</div>
            <div className="text-3xl font-bold mb-1">STAGE {currentStage}</div>
            <div className="text-sm">{stageName}</div>
            <div className="text-xs text-gray-600 mt-2">{stageProgress}</div>
          </div>
          
          {/* Revenue Delta */}
          <div className="border-2 border-black p-6">
            <div className="text-xs text-gray-500 mb-2">REVENUE DELTA</div>
            <div className="text-3xl font-bold mb-1">{revenueDelta}x</div>
            <div className="text-sm text-gray-600">
              ${currentRevenue} / ${baselineRevenue} baseline
            </div>
          </div>
        </div>
        
        {/* Next Required Action */}
        <div className="border-4 border-black p-8 mb-8">
          <div className="text-xs text-gray-500 mb-2">NEXT REQUIRED ACTION</div>
          <div className="text-2xl font-bold mb-4">{nextAction}</div>
          <div className="text-sm mb-4">Due: {nextDeadline}</div>
          <div className="text-sm text-gray-600 mb-6">Time remaining: {hoursRemaining} hours</div>
          <Link 
            to="/screens/report" 
            className="inline-block bg-black text-white px-8 py-3 border-2 border-black hover:bg-gray-800"
          >
            GO TO REPORT →
          </Link>
        </div>
        
        {/* Weekly Loop Status */}
        <div className="border-2 border-black p-6 mb-8">
          <div className="font-bold mb-4">WEEK {currentWeek} LOOP STATUS</div>
          <div className="space-y-3">
            <LoopStep 
              number="1"
              name="COMMIT"
              status="complete"
              detail="Committed: Reach out to 10 past clients for referrals"
            />
            <LoopStep 
              number="2"
              name="EXECUTE"
              status="in-progress"
              detail="In progress (Monday-Friday)"
            />
            <LoopStep 
              number="3"
              name="REPORT"
              status="pending"
              detail="Due: Friday 6pm"
            />
            <LoopStep 
              number="4"
              name="DIAGNOSE"
              status="locked"
              detail="Unlocks after report submitted"
            />
            <LoopStep 
              number="5"
              name="ADJUST"
              status="locked"
              detail="Unlocks after diagnosis"
            />
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="grid grid-cols-4 gap-4">
          <Link to="/screens/commit" className="border-2 border-black p-4 hover:bg-gray-100">
            <div className="text-sm font-bold">View Commit</div>
          </Link>
          <Link to="/screens/execute" className="border-2 border-black p-4 hover:bg-gray-100">
            <div className="text-sm font-bold">Execution Log</div>
          </Link>
          <Link to="/screens/map" className="border-2 border-black p-4 hover:bg-gray-100">
            <div className="text-sm font-bold">Revenue Map</div>
          </Link>
          <Link to="/screens/rsd" className="border-2 border-black p-4 hover:bg-gray-100">
            <div className="text-sm font-bold">RSD</div>
          </Link>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">SCREEN FUNCTION:</div>
          <div className="text-sm">Founder knows: WHERE AM I (week/stage), WHAT'S NEXT (required action + deadline), AM I LOCKED (flags visible)</div>
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
  const getStatusColor = () => {
    switch (status) {
      case 'complete': return 'border-green-600 bg-green-50';
      case 'in-progress': return 'border-blue-600 bg-blue-50';
      case 'pending': return 'border-gray-400 bg-white';
      case 'locked': return 'border-gray-300 bg-gray-100';
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'complete': return '✓ COMPLETE';
      case 'in-progress': return '→ IN PROGRESS';
      case 'pending': return '○ PENDING';
      case 'locked': return '🔒 LOCKED';
    }
  };
  
  return (
    <div className={`border-2 ${getStatusColor()} p-4 flex items-start gap-4`}>
      <div className="text-xl font-bold">{number}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold">{name}</div>
          <div className="text-xs">{getStatusText()}</div>
        </div>
        <div className="text-sm text-gray-600">{detail}</div>
      </div>
    </div>
  );
}
