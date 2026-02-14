import { Link } from "react-router";
import { AlertTriangle, XCircle } from "lucide-react";

export default function RemovalReview() {
  const founderName = "Sarah Chen";
  const missedWeeks = [2, 3];
  const currentWeek = 4;
  const reviewScheduledFor = "Wednesday, Feb 19 at 2:00pm";
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-red-600 bg-red-50 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm font-bold text-red-600">⚠️ ACCOUNT UNDER REVIEW</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/enforcement" className="text-sm underline mb-4 inline-block">← Back to Enforcement Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">ENFORCEMENT SCREEN 5 OF 7 — CRITICAL</div>
          <h1 className="text-2xl mb-2">REMOVAL REVIEW</h1>
          <p className="text-sm text-gray-600">2 consecutive weeks missed - account under review</p>
        </div>
        
        {/* Critical Status */}
        <div className="mb-8 p-12 border-4 border-red-600 bg-red-50 text-center">
          <XCircle className="w-20 h-20 mx-auto mb-6 text-red-600" />
          
          <div className="text-3xl font-bold mb-4 text-red-600">
            YOUR ACCOUNT IS UNDER REVIEW
          </div>
          
          <div className="max-w-2xl mx-auto mb-8 text-left">
            <div className="text-sm mb-6">
              You have missed 2 consecutive weeks of required submissions. Your participation 
              in COHORT_2026_03 is now being reviewed for removal.
            </div>
            
            <div className="p-6 border-2 border-red-600 bg-white mb-6">
              <div className="font-bold mb-2">MISSED WEEKS:</div>
              <div className="space-y-2">
                <div className="p-3 border border-red-600 bg-red-50">
                  <div className="font-bold">Week {missedWeeks[0]}</div>
                  <div className="text-sm">No weekly report submitted</div>
                </div>
                <div className="p-3 border border-red-600 bg-red-50">
                  <div className="font-bold">Week {missedWeeks[1]}</div>
                  <div className="text-sm">No weekly report submitted</div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-2 border-red-600 bg-white mb-6">
              <div className="font-bold mb-2">CURRENT RESTRICTIONS:</div>
              <ul className="text-sm space-y-1">
                <li>🔒 Cannot submit new commits</li>
                <li>🔒 Cannot submit reports</li>
                <li>🔒 Cannot access community</li>
                <li>🔒 Stage progress frozen</li>
                <li>✓ Can view historical data (read-only)</li>
              </ul>
            </div>
            
            <div className="p-6 border-2 border-black bg-gray-100">
              <div className="font-bold mb-2">MANDATORY REVIEW CALL SCHEDULED:</div>
              <div className="text-sm mb-4">
                Your mentor has scheduled a mandatory 1-on-1 review call.
              </div>
              <div className="text-lg font-bold mb-4">{reviewScheduledFor}</div>
              <div className="text-sm text-gray-600">
                You must attend this call. Missing it will result in automatic removal from the cohort.
              </div>
            </div>
          </div>
        </div>
        
        {/* Review Process */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-4">WHAT HAPPENS IN THE REVIEW:</div>
          <div className="text-sm mb-6">
            This is a mandatory conversation with your mentor to determine if you can continue in the program.
          </div>
          
          <div className="space-y-4">
            <div className="p-4 border-2 border-black">
              <div className="font-bold mb-2">YOU WILL BE ASKED:</div>
              <ul className="text-sm space-y-1">
                <li>• Why did you miss 2 consecutive weeks?</li>
                <li>• Can you commit to weekly submissions going forward?</li>
                <li>• Is now the right time for this program?</li>
                <li>• What would prevent future misses?</li>
              </ul>
            </div>
            
            <div className="p-4 border-2 border-black">
              <div className="font-bold mb-2">POSSIBLE OUTCOMES:</div>
              <div className="space-y-3">
                <div className="p-3 border border-green-600 bg-green-50">
                  <div className="font-bold mb-1">1. REINSTATEMENT</div>
                  <div className="text-sm">
                    You're allowed to continue with a specific plan to prevent future misses. 
                    You must submit makeup reports for both missed weeks.
                  </div>
                </div>
                <div className="p-3 border border-yellow-600 bg-yellow-50">
                  <div className="font-bold mb-1">2. MOVE TO NEXT COHORT</div>
                  <div className="text-sm">
                    If timing isn't right now, you can join the next cohort (starting in 6 weeks) 
                    with full credit for any completed weeks.
                  </div>
                </div>
                <div className="p-3 border border-red-600 bg-red-50">
                  <div className="font-bold mb-1">3. REMOVAL</div>
                  <div className="text-sm">
                    If commitment isn't there or circumstances don't allow participation, 
                    you'll be removed from the program. Partial refund may apply.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Why This Matters */}
        <div className="mb-8 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">WHY 2 CONSECUTIVE MISSES TRIGGERS REVIEW:</div>
          <div className="text-sm space-y-3">
            <div>
              <strong>Disengagement signal:</strong> Missing 2 weeks in a row indicates you're not actively 
              participating in the program. Vendoura requires consistent weekly engagement.
            </div>
            <div>
              <strong>Cohort impact:</strong> Inactive members reduce cohort momentum and set a poor 
              example for engaged founders. The community works best when everyone is committed.
            </div>
            <div>
              <strong>Your success:</strong> If you're not doing the work weekly, you won't see revenue 
              results. It's better to pause than to stay enrolled without participation.
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="p-8 border-4 border-black bg-white">
          <div className="text-xl font-bold mb-4">REQUIRED ACTIONS:</div>
          
          <div className="space-y-4">
            <div className="p-4 border-2 border-black bg-gray-50">
              <div className="font-bold mb-2">1. ATTEND REVIEW CALL</div>
              <div className="text-sm mb-3">
                {reviewScheduledFor}
              </div>
              <div className="text-sm text-gray-600">
                Calendar invite sent to your email. Missing this call = automatic removal.
              </div>
            </div>
            
            <div className="p-4 border-2 border-black bg-gray-50">
              <div className="font-bold mb-2">2. PREPARE EXPLANATION</div>
              <div className="text-sm">
                Think about why you missed 2 weeks and what would prevent future misses. 
                Be honest - this helps us determine the best path forward.
              </div>
            </div>
            
            <div className="p-4 border-2 border-black bg-gray-50">
              <div className="font-bold mb-2">3. DECIDE IF NOW IS RIGHT TIME</div>
              <div className="text-sm">
                If circumstances don't allow weekly commitment, it's okay to move to a future cohort. 
                Better to pause than to struggle through.
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">ENFORCEMENT MECHANISM:</div>
          <div className="text-sm space-y-1">
            <div>• Automatic trigger at 2 consecutive misses</div>
            <div>• All platform features locked immediately</div>
            <div>• Mentor notified automatically</div>
            <div>• Review call must happen within 48 hours</div>
            <div>• Cannot bypass review process</div>
            <div>• Decision is final (reinstate, move, or remove)</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-2">DESIGN PRINCIPLE:</div>
          <div className="text-sm">
            This is the most severe enforcement mechanism. It acknowledges that 2 consecutive misses 
            indicates a fundamental engagement problem. The human conversation (review call) is necessary 
            to determine root cause and best path forward. This protects both the founder (from wasting time) 
            and the cohort (from inactive members).
          </div>
        </div>
      </div>
    </div>
  );
}
