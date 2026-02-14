import { Link } from "react-router";
import { Lock, AlertTriangle } from "lucide-react";

export default function LockedDashboard() {
  const currentWeek = 3;
  const currentStage = 1;
  const baselineRevenue = 2400;
  const currentRevenue = 3100;
  const missedAction = "WEEKLY COMMIT";
  const deadline = "Monday, Feb 10 at 9:00am";
  const hoursOverdue = 6;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">COHORT_2026_03</div>
          <div className="text-sm text-red-600 font-bold">⚠️ WEEK LOCKED</div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto p-8">
        <Link to="/enforcement" className="text-sm underline mb-4 inline-block">← Back to Enforcement Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">ENFORCEMENT SCREEN 1 OF 7</div>
          <h1 className="text-2xl mb-2">LOCKED DASHBOARD</h1>
          <p className="text-sm text-gray-600">Dashboard when founder missed commit deadline</p>
        </div>
        
        {/* Critical Lock Alert */}
        <div className="mb-8 p-8 border-4 border-red-600 bg-red-50">
          <div className="flex items-start gap-4 mb-6">
            <Lock className="w-12 h-12 text-red-600" />
            <div className="flex-1">
              <div className="text-2xl font-bold mb-2">WEEK {currentWeek} LOCKED</div>
              <div className="text-sm mb-4">
                You cannot proceed with this week's activities. Your progress is frozen.
              </div>
            </div>
          </div>
          
          <div className="p-6 border-2 border-red-600 bg-white mb-6">
            <div className="font-bold mb-2">REASON:</div>
            <div className="text-sm mb-4">
              {missedAction} was not submitted by the deadline.
            </div>
            <div className="text-sm text-gray-600">
              <div>Deadline: {deadline}</div>
              <div>Current time: {hoursOverdue} hours overdue</div>
            </div>
          </div>
          
          <div className="p-6 border-2 border-red-600 bg-white mb-6">
            <div className="font-bold mb-2">WHAT IS LOCKED:</div>
            <ul className="text-sm space-y-1">
              <li>✗ Cannot submit weekly report</li>
              <li>✗ Cannot access execution log</li>
              <li>✗ Stage progress frozen</li>
              <li>✗ Week will not count toward requirements</li>
            </ul>
          </div>
          
          <div className="p-6 border-2 border-red-600 bg-white mb-6">
            <div className="font-bold mb-2">MENTOR VISIBILITY:</div>
            <div className="text-sm mb-2">
              ⚠️ Your mentor has been automatically notified of this missed deadline.
            </div>
            <div className="text-sm text-gray-600">
              They can see: What you missed, when it was due, how long overdue.
            </div>
          </div>
          
          <div className="p-6 border-2 border-black bg-gray-100">
            <div className="font-bold mb-2">HOW TO UNLOCK:</div>
            <div className="text-sm mb-4">
              Submit your weekly commit now. Late submissions are allowed but flagged.
            </div>
            <Link 
              to="/screens/commit" 
              className="inline-block bg-black text-white px-8 py-4 border-2 border-black hover:bg-gray-800"
            >
              SUBMIT COMMIT NOW (LATE)
            </Link>
          </div>
        </div>
        
        {/* Dimmed Dashboard Info */}
        <div className="opacity-40 pointer-events-none">
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border-2 border-black p-6">
              <div className="text-xs text-gray-500 mb-2">WEEK</div>
              <div className="text-3xl font-bold mb-1">{currentWeek} of 12</div>
            </div>
            
            <div className="border-2 border-black p-6">
              <div className="text-xs text-gray-500 mb-2">CURRENT STAGE</div>
              <div className="text-3xl font-bold mb-1">STAGE {currentStage}</div>
            </div>
            
            <div className="border-2 border-black p-6">
              <div className="text-xs text-gray-500 mb-2">REVENUE DELTA</div>
              <div className="text-3xl font-bold mb-1">1.29x</div>
              <div className="text-sm text-gray-600">
                ${currentRevenue} / ${baselineRevenue} baseline
              </div>
            </div>
          </div>
          
          <div className="border-2 border-black p-8 mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-4 border-2 border-black">
                <Lock className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">LOCKED</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Next required action information is hidden until you submit your commit.
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">ENFORCEMENT MECHANISM:</div>
          <div className="text-sm space-y-1">
            <div>• Lock is immediate (triggers at 9:01am Monday)</div>
            <div>• Mentor notification is automatic</div>
            <div>• Dashboard becomes mostly non-functional</div>
            <div>• Week will not count toward stage requirements even if completed late</div>
            <div>• Founder must submit makeup work to compensate</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-2">DESIGN PRINCIPLE:</div>
          <div className="text-sm">
            The lock is impossible to ignore. Founder cannot "work around" it. 
            The only path forward is through the blocked action.
          </div>
        </div>
      </div>
    </div>
  );
}
