import { Link } from "react-router";
import { XCircle } from "lucide-react";

export default function CannotProceed() {
  const blockedAction = "ADJUST STEP";
  const missingRequirement = "Weekly report not submitted";
  const currentWeek = 3;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Week {currentWeek}</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/enforcement" className="text-sm underline mb-4 inline-block">← Back to Enforcement Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">ENFORCEMENT SCREEN 7 OF 7</div>
          <h1 className="text-2xl mb-2">CANNOT PROCEED</h1>
          <p className="text-sm text-gray-600">Generic block screen for incomplete requirements</p>
        </div>
        
        {/* Block Message */}
        <div className="mb-8 p-12 border-4 border-red-600 bg-red-50 text-center">
          <XCircle className="w-20 h-20 mx-auto mb-6 text-red-600" />
          
          <div className="text-3xl font-bold mb-4">
            CANNOT PROCEED
          </div>
          
          <div className="max-w-lg mx-auto">
            <div className="text-sm mb-8">
              You are trying to access <strong>{blockedAction}</strong>, but a required 
              previous step has not been completed.
            </div>
            
            <div className="p-6 border-2 border-red-600 bg-white text-left mb-6">
              <div className="font-bold mb-2">MISSING REQUIREMENT:</div>
              <div className="text-sm mb-4">
                {missingRequirement}
              </div>
              <div className="text-sm text-gray-600">
                The weekly loop requires sequential completion. You cannot skip steps.
              </div>
            </div>
            
            <div className="p-6 border-2 border-black bg-white text-left mb-8">
              <div className="font-bold mb-2">WEEKLY LOOP SEQUENCE:</div>
              <div className="space-y-2 text-sm">
                <div className="p-3 border border-green-600 bg-green-50">
                  ✓ Step 1: COMMIT (completed)
                </div>
                <div className="p-3 border border-green-600 bg-green-50">
                  ✓ Step 2: EXECUTE (completed)
                </div>
                <div className="p-3 border border-red-600 bg-red-50">
                  ✗ Step 3: REPORT (missing) ← BLOCKING STEP
                </div>
                <div className="p-3 border border-gray-400 bg-gray-100 opacity-60">
                  🔒 Step 4: DIAGNOSE (locked)
                </div>
                <div className="p-3 border border-gray-400 bg-gray-100 opacity-60">
                  🔒 Step 5: ADJUST (locked) ← YOU ARE HERE
                </div>
              </div>
            </div>
            
            <div className="p-6 border-2 border-black bg-white text-left mb-8">
              <div className="font-bold mb-2">TO PROCEED:</div>
              <div className="text-sm space-y-2">
                <div>1. Submit your weekly report (Step 3)</div>
                <div>2. Wait for diagnosis to run (automatic on Saturday)</div>
                <div>3. Then you can access the adjust step (Step 5)</div>
              </div>
            </div>
            
            <Link 
              to="/screens/report" 
              className="inline-block bg-black text-white px-8 py-4 border-2 border-black hover:bg-gray-800 mb-4"
            >
              GO TO REPORT SUBMISSION
            </Link>
            
            <div className="text-xs text-gray-600">
              Complete the missing step to unlock forward progress
            </div>
          </div>
        </div>
        
        {/* Alternative Scenarios */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-4">OTHER "CANNOT PROCEED" SCENARIOS:</div>
          <div className="text-sm mb-4">
            This screen appears whenever a founder tries to access something that requires 
            a previous incomplete step:
          </div>
          
          <div className="space-y-2">
            <div className="p-3 border border-black bg-gray-50">
              <div className="font-bold mb-1">Scenario A: Trying to access RSD</div>
              <div className="text-xs text-gray-600">
                Block reason: "Stage 4 not unlocked. Complete Stages 1-3 first."
              </div>
            </div>
            
            <div className="p-3 border border-black bg-gray-50">
              <div className="font-bold mb-1">Scenario B: Trying to submit report without commit</div>
              <div className="text-xs text-gray-600">
                Block reason: "No weekly commit submitted. Cannot report on uncommitted work."
              </div>
            </div>
            
            <div className="p-3 border border-black bg-gray-50">
              <div className="font-bold mb-1">Scenario C: Trying to access Week 5 in Week 3</div>
              <div className="text-xs text-gray-600">
                Block reason: "Future weeks are not accessible. Complete current week first."
              </div>
            </div>
            
            <div className="p-3 border border-black bg-gray-50">
              <div className="font-bold mb-1">Scenario D: Trying to graduate without RSD</div>
              <div className="text-xs text-gray-600">
                Block reason: "Revenue System Document incomplete. Cannot graduate."
              </div>
            </div>
          </div>
        </div>
        
        {/* Design Pattern */}
        <div className="mb-8 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">BLOCK SCREEN PATTERN:</div>
          <div className="text-sm space-y-2">
            <div>
              <strong>1. Clear error state:</strong> Large icon + "Cannot proceed" message
            </div>
            <div>
              <strong>2. Explain why:</strong> What requirement is missing?
            </div>
            <div>
              <strong>3. Show context:</strong> Where are they in the sequence?
            </div>
            <div>
              <strong>4. Path forward:</strong> Exactly what to do to unblock
            </div>
            <div>
              <strong>5. Action button:</strong> Direct link to the blocking step
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">ENFORCEMENT MECHANISM:</div>
          <div className="text-sm space-y-1">
            <div>• Generic template for any sequential block</div>
            <div>• Clear explanation of what's missing</div>
            <div>• Visual sequence showing where founder is stuck</div>
            <div>• Direct link to unblock action</div>
            <div>• No workarounds or skip options</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-2">DESIGN PRINCIPLE:</div>
          <div className="text-sm">
            This is the universal "you can't go here" screen. It's not punitive - it's informative. 
            It clearly explains what's blocking progress and how to unblock it. The founder always 
            knows: what they're missing, why it matters, and what to do next. No confusion, no ambiguity.
          </div>
        </div>
      </div>
    </div>
  );
}
