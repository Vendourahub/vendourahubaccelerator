import { Link } from "react-router";
import { Lock, XCircle } from "lucide-react";

export default function LockedReport() {
  const currentWeek = 3;
  const committedAction = "NOT SUBMITTED";
  const blockReason = "You did not submit a weekly commit on Monday.";
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Week {currentWeek} Report</div>
          <div className="text-sm text-red-600 font-bold">🔒 LOCKED</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/enforcement" className="text-sm underline mb-4 inline-block">← Back to Enforcement Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">ENFORCEMENT SCREEN 2 OF 7 — CRITICAL</div>
          <h1 className="text-2xl mb-2">LOCKED REPORT SCREEN</h1>
          <p className="text-sm text-gray-600">Report submission blocked - no commit submitted</p>
        </div>
        
        {/* Cannot Proceed Block */}
        <div className="p-12 border-4 border-red-600 bg-red-50 text-center mb-8">
          <Lock className="w-20 h-20 mx-auto mb-6 text-red-600" />
          
          <div className="text-3xl font-bold mb-4">CANNOT SUBMIT REPORT</div>
          
          <div className="max-w-lg mx-auto mb-8">
            <div className="text-sm mb-6">
              {blockReason}
            </div>
            
            <div className="p-6 border-2 border-red-600 bg-white text-left mb-6">
              <div className="font-bold mb-2">WHY THIS IS BLOCKED:</div>
              <div className="text-sm space-y-2">
                <div>
                  You cannot report on work you didn't commit to. The weekly loop requires:
                </div>
                <div className="pl-4">
                  <div>1. COMMIT (Monday) ← YOU ARE HERE</div>
                  <div>2. EXECUTE (Mon-Fri)</div>
                  <div>3. REPORT (Friday) ← BLOCKED</div>
                </div>
                <div className="mt-4">
                  Skipping the commit step breaks the accountability mechanism.
                </div>
              </div>
            </div>
            
            <div className="p-6 border-2 border-black bg-white text-left mb-8">
              <div className="font-bold mb-2">TO UNLOCK REPORT:</div>
              <div className="text-sm space-y-2">
                <div>1. Submit your weekly commit (even if late)</div>
                <div>2. Wait for system to process (instant)</div>
                <div>3. Return to this screen to submit report</div>
              </div>
            </div>
            
            <Link 
              to="/screens/commit" 
              className="inline-block bg-black text-white px-8 py-4 border-2 border-black hover:bg-gray-800 mb-4"
            >
              GO TO COMMIT SCREEN
            </Link>
            
            <div className="text-xs text-gray-600">
              Note: Late commits are flagged and this week may not count toward stage requirements
            </div>
          </div>
        </div>
        
        {/* Grayed Out Form */}
        <div className="opacity-20 pointer-events-none">
          <div className="mb-6 p-6 border-2 border-black bg-gray-50">
            <div className="font-bold mb-2">YOUR COMMITMENT:</div>
            <div className="text-sm">{committedAction}</div>
          </div>
          
          <div className="space-y-6">
            <div className="border-2 border-black p-6">
              <label className="block font-bold mb-2">
                How much revenue did you generate this week?
              </label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">$</span>
                <input 
                  type="number"
                  disabled
                  className="flex-1 border-2 border-black p-4 text-xl bg-gray-100"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="border-2 border-black p-6">
              <label className="block font-bold mb-2">
                How many hours did you spend?
              </label>
              <input 
                type="number"
                disabled
                className="border-2 border-black p-4 w-32 bg-gray-100"
                placeholder="0"
              />
            </div>
            
            <div className="border-2 border-black p-6">
              <label className="block font-bold mb-2">
                Upload Evidence (REQUIRED)
              </label>
              <div className="border-2 border-dashed border-gray-400 p-8 text-center bg-gray-100">
                <div className="text-sm text-gray-400">Upload disabled</div>
              </div>
            </div>
            
            <div className="border-2 border-black p-6">
              <label className="block font-bold mb-2">
                What happened? (Narrative)
              </label>
              <textarea 
                disabled
                className="w-full border-2 border-black p-4 min-h-40 bg-gray-100"
                placeholder="Form is disabled"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">ENFORCEMENT MECHANISM:</div>
          <div className="text-sm space-y-1">
            <div>• Form is completely disabled (not just validation)</div>
            <div>• Submit button does not exist</div>
            <div>• Clear explanation of why it's blocked</div>
            <div>• Clear path to unlock (submit commit)</div>
            <div>• No workarounds or exceptions</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-2">DESIGN PRINCIPLE:</div>
          <div className="text-sm">
            Cannot bypass. Cannot ignore. The only way forward is backward (complete the missed step).
            This enforces the sequential nature of the weekly loop.
          </div>
        </div>
      </div>
    </div>
  );
}
