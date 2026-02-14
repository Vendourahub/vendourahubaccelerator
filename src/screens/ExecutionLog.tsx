import { Link } from "react-router";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function ExecutionLog() {
  const currentWeek = 3;
  const committedAction = "Call 20 leads from last month's webinar to offer 15% discount on annual plan";
  const targetRevenue = 5000;
  const completionDate = "Friday, Feb 14";
  
  const [hoursSpent, setHoursSpent] = useState("");
  const [notes, setNotes] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Week {currentWeek} Execution</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/screens" className="text-sm underline mb-4 inline-block">← Back to Screen Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">SCREEN 3 OF 6</div>
          <h1 className="text-2xl mb-2">EXECUTION LOG</h1>
          <p className="text-sm text-gray-600">Track your work and prepare evidence for Friday</p>
        </div>
        
        {/* Your Commitment */}
        <div className="mb-8 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">YOUR COMMITMENT FOR THIS WEEK:</div>
          <div className="text-sm mb-4">{committedAction}</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-bold">Target Revenue:</span> ${targetRevenue.toLocaleString()}
            </div>
            <div>
              <span className="font-bold">Due Date:</span> {completionDate}
            </div>
          </div>
        </div>
        
        {/* Time Tracking */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-4">TIME TRACKING (OPTIONAL)</div>
          <div className="text-sm mb-4">
            Track hours spent on this action. You'll need this for your Friday report.
          </div>
          <div className="flex items-center gap-4">
            <label className="font-bold">Hours spent so far:</label>
            <input 
              type="number"
              step="0.5"
              value={hoursSpent}
              onChange={(e) => setHoursSpent(e.target.value)}
              className="border-2 border-black p-2 w-32"
              placeholder="0"
            />
            <span className="text-sm text-gray-600">hours</span>
          </div>
        </div>
        
        {/* Evidence Preparation */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-4">EVIDENCE PREPARATION</div>
          <div className="text-sm mb-4">
            Start collecting evidence now. You'll upload this with your Friday report.
          </div>
          
          <div className="mb-4 p-4 bg-gray-50">
            <div className="text-sm font-bold mb-2">WHAT COUNTS AS EVIDENCE:</div>
            <ul className="text-sm space-y-1">
              <li>✓ Screenshots of conversations (emails, DMs, calls)</li>
              <li>✓ Receipts or invoices</li>
              <li>✓ Signed contracts or agreements</li>
              <li>✓ Payment confirmations (Stripe, PayPal, bank)</li>
              <li>✓ Meeting confirmations or recordings</li>
              <li>✗ Your word alone (not sufficient)</li>
            </ul>
          </div>
          
          <div className="border-2 border-dashed border-gray-400 p-8 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm text-gray-600 mb-2">
              Evidence upload will be available on Friday when you submit your report
            </div>
            <div className="text-xs text-gray-500">
              For now, collect screenshots and files. You'll upload them on Friday.
            </div>
          </div>
          
          {evidenceFiles.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-bold mb-2">FILES READY:</div>
              <div className="space-y-2">
                {evidenceFiles.map((file, i) => (
                  <div key={i} className="border border-black p-2 text-sm">
                    {file}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Execution Notes */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-4">EXECUTION NOTES</div>
          <div className="text-sm mb-4">
            Keep notes as you work. What's working? What's not? Use these for your Friday report.
          </div>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border-2 border-black p-4 min-h-40"
            placeholder="Example: Called 8 leads today. 3 were interested, 2 asked for follow-up next week. 3 said no. Average call time: 12 minutes."
          />
        </div>
        
        {/* Next Step */}
        <div className="border-2 border-black p-6 bg-gray-50">
          <div className="font-bold mb-2">NEXT STEP: SUBMIT REPORT</div>
          <div className="text-sm mb-4">
            Report submission opens on Friday at 12pm. Deadline: Friday 6pm.
          </div>
          <Link 
            to="/screens/report" 
            className="inline-block bg-black text-white px-6 py-3 border-2 border-black"
          >
            PREVIEW REPORT SCREEN →
          </Link>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">SCREEN FUNCTION:</div>
          <div className="text-sm">Bridges commit → report. Reminds founder to capture evidence. Optional tracking helps prepare for Friday.</div>
        </div>
      </div>
    </div>
  );
}
