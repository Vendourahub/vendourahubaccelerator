import { Link } from "react-router";
import { XCircle, AlertTriangle, Upload } from "lucide-react";

export default function EvidenceRejected() {
  const currentWeek = 3;
  const submittedAt = "Friday, Feb 14 at 5:47pm";
  const rejectedAt = "Friday, Feb 14 at 5:48pm";
  const resubmissionDeadline = "Friday, Feb 14 at 6:00pm";
  const minutesRemaining = 12;
  
  const submittedData = {
    revenue: 3500,
    hours: 12,
    narrative: "I called 20 leads from last month's webinar. 5 were interested and 2 signed contracts for a total of $3,500."
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Week {currentWeek} Report</div>
          <div className="text-sm text-red-600 font-bold">✗ REJECTED</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/enforcement" className="text-sm underline mb-4 inline-block">← Back to Enforcement Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">ENFORCEMENT SCREEN 3 OF 7</div>
          <h1 className="text-2xl mb-2">EVIDENCE REJECTED</h1>
          <p className="text-sm text-gray-600">Report submitted without valid evidence</p>
        </div>
        
        {/* Rejection Alert */}
        <div className="mb-8 p-8 border-4 border-red-600 bg-red-50">
          <div className="flex items-start gap-4 mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
            <div className="flex-1">
              <div className="text-2xl font-bold mb-2">REPORT REJECTED</div>
              <div className="text-sm mb-4">
                Your Week {currentWeek} report has been rejected because no evidence was provided.
              </div>
            </div>
          </div>
          
          <div className="p-6 border-2 border-red-600 bg-white mb-6">
            <div className="font-bold mb-2">REJECTION REASON:</div>
            <div className="text-sm mb-4">
              ✗ No evidence files uploaded
            </div>
            <div className="text-sm text-gray-600">
              <div>Submitted: {submittedAt}</div>
              <div>Rejected: {rejectedAt}</div>
            </div>
          </div>
          
          <div className="p-6 border-2 border-red-600 bg-white mb-6">
            <div className="font-bold mb-2">⚠️ URGENT DEADLINE:</div>
            <div className="text-sm mb-2">
              You can resubmit until: {resubmissionDeadline}
            </div>
            <div className="text-xl font-bold">
              {minutesRemaining} minutes remaining
            </div>
          </div>
          
          <div className="p-6 border-2 border-black bg-white">
            <div className="font-bold mb-2">IF YOU MISS RESUBMISSION DEADLINE:</div>
            <ul className="text-sm space-y-1">
              <li>• This week counts as MISSED</li>
              <li>• Stage progress remains frozen</li>
              <li>• Counts toward 2-week removal review</li>
              <li>• Mentor will be notified</li>
            </ul>
          </div>
        </div>
        
        {/* What Was Submitted */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-4">WHAT YOU SUBMITTED (WITHOUT EVIDENCE):</div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 border border-black">
              <div className="text-xs text-gray-500 mb-1">REVENUE</div>
              <div className="text-xl font-bold">${submittedData.revenue.toLocaleString()}</div>
            </div>
            <div className="p-4 border border-black">
              <div className="text-xs text-gray-500 mb-1">HOURS</div>
              <div className="text-xl font-bold">{submittedData.hours}</div>
            </div>
          </div>
          
          <div className="p-4 border border-black mb-4">
            <div className="text-xs text-gray-500 mb-1">NARRATIVE</div>
            <div className="text-sm">{submittedData.narrative}</div>
          </div>
          
          <div className="p-4 border-2 border-red-600 bg-red-50">
            <div className="text-xs text-gray-500 mb-1">EVIDENCE</div>
            <div className="font-bold text-red-600">✗ NONE PROVIDED</div>
          </div>
        </div>
        
        {/* Resubmit Section */}
        <div className="mb-8 p-8 border-4 border-black bg-gray-50">
          <div className="text-xl font-bold mb-4">RESUBMIT WITH EVIDENCE</div>
          
          <div className="mb-6 p-4 border-2 border-black bg-white">
            <div className="font-bold mb-2">WHAT COUNTS AS EVIDENCE:</div>
            <ul className="text-sm space-y-1">
              <li>✓ Screenshots of conversations (emails, DMs)</li>
              <li>✓ Signed contracts or proposals</li>
              <li>✓ Payment receipts (Stripe, PayPal, bank transfer)</li>
              <li>✓ Invoices sent to clients</li>
              <li>✓ Meeting confirmations</li>
              <li>✗ Your word alone (NOT sufficient)</li>
              <li>✗ Vague screenshots without context</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <div className="font-bold mb-2">UPLOAD EVIDENCE NOW:</div>
            <div 
              className="border-2 border-dashed border-black p-8 text-center cursor-pointer hover:bg-gray-100"
            >
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm font-bold mb-1">Click to upload files</div>
              <div className="text-xs text-gray-600">
                You must provide proof of the $3,500 revenue you claimed
              </div>
            </div>
          </div>
          
          <button className="bg-black text-white px-8 py-4 border-2 border-black hover:bg-gray-800 w-full">
            RESUBMIT REPORT WITH EVIDENCE
          </button>
          
          <div className="text-xs text-center text-gray-600 mt-3">
            {minutesRemaining} minutes until deadline
          </div>
        </div>
        
        <div className="p-6 border-2 border-red-600 bg-red-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-bold mb-2">MENTOR NOTIFICATION SENT:</div>
              <div className="text-sm">
                Your mentor has been notified that you submitted a report without evidence. 
                They can see your claim of $3,500 and the fact that no proof was provided.
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">ENFORCEMENT MECHANISM:</div>
          <div className="text-sm space-y-1">
            <div>• Validation happens immediately on submission</div>
            <div>• Report rejected within seconds</div>
            <div>• Founder has until original deadline to fix</div>
            <div>• After deadline, week counts as MISSED</div>
            <div>• No evidence = no credit (even with revenue narrative)</div>
          </div>
        </div>
        
        <div className="mt-8 p-6 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-2">DESIGN PRINCIPLE:</div>
          <div className="text-sm">
            Evidence is non-negotiable. Revenue claims without proof are treated as no submission. 
            This prevents self-deception and enforces the evidence habit.
          </div>
        </div>
      </div>
    </div>
  );
}
