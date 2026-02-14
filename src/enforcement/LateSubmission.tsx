import { Link } from "react-router";
import { AlertTriangle, Clock } from "lucide-react";

export default function LateSubmission() {
  const currentWeek = 3;
  const actionType = "WEEKLY COMMIT";
  const deadline = "Monday, Feb 10 at 9:00am";
  const submittedAt = "Monday, Feb 10 at 2:34pm";
  const hoursLate = 5.5;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Week {currentWeek}</div>
          <div className="text-sm text-orange-600 font-bold">⚠️ LATE</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/enforcement" className="text-sm underline mb-4 inline-block">← Back to Enforcement Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">ENFORCEMENT SCREEN 4 OF 7</div>
          <h1 className="text-2xl mb-2">LATE SUBMISSION</h1>
          <p className="text-sm text-gray-600">Submitted after deadline - mentor notified</p>
        </div>
        
        {/* Late Warning */}
        <div className="mb-8 p-8 border-4 border-orange-600 bg-orange-50">
          <div className="flex items-start gap-4 mb-6">
            <Clock className="w-12 h-12 text-orange-600" />
            <div className="flex-1">
              <div className="text-2xl font-bold mb-2">LATE SUBMISSION RECORDED</div>
              <div className="text-sm mb-4">
                Your {actionType} was submitted after the deadline.
              </div>
            </div>
          </div>
          
          <div className="p-6 border-2 border-orange-600 bg-white mb-6">
            <div className="font-bold mb-2">TIMING:</div>
            <div className="text-sm space-y-1">
              <div>Deadline: {deadline}</div>
              <div>Submitted: {submittedAt}</div>
              <div className="font-bold text-orange-600 mt-2">{hoursLate} hours late</div>
            </div>
          </div>
          
          <div className="p-6 border-2 border-orange-600 bg-white mb-6">
            <div className="font-bold mb-2">⚠️ MENTOR VISIBILITY FLAG:</div>
            <div className="text-sm mb-4">
              Your mentor has been automatically notified of this late submission.
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-bold mb-1">They can see:</div>
              <ul className="space-y-1">
                <li>• What was submitted late</li>
                <li>• When it was due</li>
                <li>• How many hours late</li>
                <li>• Your late submission history</li>
              </ul>
            </div>
          </div>
          
          <div className="p-6 border-2 border-black bg-white">
            <div className="font-bold mb-2">CONSEQUENCES:</div>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Permanent record:</strong> This late submission is logged and visible to your mentor indefinitely</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Week may not count:</strong> Late submissions may not count toward stage requirements (mentor decides)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Pattern tracking:</strong> Multiple late submissions trigger intervention review</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span><strong>Social pressure:</strong> Your mentor knows you missed the deadline</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Your Submission */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-4">YOUR SUBMISSION (LATE):</div>
          
          <div className="p-4 border-2 border-orange-600 bg-orange-50 mb-4">
            <div className="text-xs text-gray-500 mb-1">STATUS</div>
            <div className="font-bold">ACCEPTED BUT FLAGGED AS LATE</div>
          </div>
          
          <div className="p-4 border border-black">
            <div className="text-xs text-gray-500 mb-1">COMMITTED ACTION</div>
            <div className="text-sm">
              Call 20 leads from last month's webinar to offer 15% discount on annual plan
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="p-6 border-2 border-black bg-gray-50 mb-8">
          <div className="font-bold mb-2">YOU CAN NOW PROCEED:</div>
          <div className="text-sm mb-4">
            Despite being late, your commit has been accepted. You can continue with Week {currentWeek}.
          </div>
          <div className="text-sm mb-6">
            <strong>Next required action:</strong> Submit weekly report by Friday 6pm
          </div>
          <Link 
            to="/screens/dashboard" 
            className="inline-block bg-black text-white px-6 py-3 border-2 border-black"
          >
            RETURN TO DASHBOARD
          </Link>
        </div>
        
        {/* Pattern Warning */}
        <div className="p-6 border-2 border-red-600 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-bold mb-2">LATE SUBMISSION PATTERN WARNING:</div>
              <div className="text-sm mb-2">
                This is your 1st late submission in the past 4 weeks.
              </div>
              <div className="text-sm text-gray-600">
                If you have 3+ late submissions in a 4-week period, your mentor will schedule 
                a mandatory check-in to discuss whether Vendoura is the right fit for you right now.
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">ENFORCEMENT MECHANISM:</div>
          <div className="text-sm space-y-1">
            <div>• Late flag is permanent (cannot be removed)</div>
            <div>• Mentor notification is automatic and immediate</div>
            <div>• System tracks late submission patterns</div>
            <div>• 3+ late submissions = automatic intervention trigger</div>
            <div>• Creates social pressure without blocking progress</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-orange-600 bg-orange-50">
          <div className="font-bold mb-2">DESIGN PRINCIPLE:</div>
          <div className="text-sm">
            Late submissions are accepted (founder can continue) but flagged (mentor knows, permanent record). 
            This creates accountability without complete lockout. The social pressure of mentor visibility 
            is often more effective than a hard block.
          </div>
        </div>
      </div>
    </div>
  );
}
