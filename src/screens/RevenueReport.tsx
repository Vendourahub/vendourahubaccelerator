import { Link } from "react-router";
import { useState } from "react";
import { Upload, AlertTriangle, X } from "lucide-react";

export default function RevenueReport() {
  const currentWeek = 3;
  const deadline = "Friday, Feb 14 at 6:00pm";
  const hoursUntilDeadline = 3;
  const committedAction = "Call 20 leads from last month's webinar to offer 15% discount on annual plan";
  const targetRevenue = 5000;
  
  const [revenueGenerated, setRevenueGenerated] = useState("");
  const [hoursSpent, setHoursSpent] = useState("");
  const [narrative, setNarrative] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState<Array<{name: string, size: string}>>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const handleFileUpload = () => {
    // Simulate file upload
    setEvidenceFiles([
      ...evidenceFiles,
      { name: "email_screenshot_1.png", size: "245 KB" },
      { name: "stripe_payment.pdf", size: "89 KB" }
    ]);
  };
  
  const removeFile = (index: number) => {
    setEvidenceFiles(evidenceFiles.filter((_, i) => i !== index));
  };
  
  const validateReport = () => {
    if (!revenueGenerated || revenueGenerated === "0") {
      return "Enter revenue generated (use $0 if none, but explain why in narrative).";
    }
    
    if (!hoursSpent || parseFloat(hoursSpent) <= 0) {
      return "Enter hours spent (must be > 0).";
    }
    
    if (narrative.length < 50) {
      return "Narrative is too short. Explain what happened (minimum 50 characters).";
    }
    
    if (evidenceFiles.length === 0) {
      return "Evidence is required. Upload at least one file showing your work.";
    }
    
    return null;
  };
  
  const handleSubmit = () => {
    const validationError = validateReport();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError("");
    setSubmitted(true);
  };
  
  if (submitted) {
    const revenue = parseFloat(revenueGenerated);
    const hours = parseFloat(hoursSpent);
    const dollarPerHour = (revenue / hours).toFixed(2);
    const winRate = ((revenue / targetRevenue) * 100).toFixed(0);
    
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b-2 border-black p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-bold">VENDOURA</div>
            <div className="text-sm">Week {currentWeek} Report</div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-8">
          <div className="border-2 border-green-600 bg-green-50 p-8 mb-8">
            <div className="text-2xl font-bold mb-4">✓ REPORT SUBMITTED</div>
            <div className="text-sm mb-6">
              Your Week {currentWeek} report has been recorded. Diagnosis will be available Saturday.
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="border-2 border-black bg-white p-4">
                <div className="text-xs text-gray-500 mb-1">REVENUE</div>
                <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
              </div>
              <div className="border-2 border-black bg-white p-4">
                <div className="text-xs text-gray-500 mb-1">$ PER HOUR</div>
                <div className="text-2xl font-bold">${dollarPerHour}</div>
              </div>
              <div className="border-2 border-black bg-white p-4">
                <div className="text-xs text-gray-500 mb-1">WIN RATE</div>
                <div className="text-2xl font-bold">{winRate}%</div>
              </div>
            </div>
            
            <Link 
              to="/screens/dashboard" 
              className="inline-block bg-black text-white px-6 py-3 border-2 border-black"
            >
              RETURN TO DASHBOARD
            </Link>
          </div>
          
          <div className="p-6 border-2 border-black bg-gray-50">
            <div className="font-bold mb-2">NEXT STEPS:</div>
            <div className="text-sm space-y-1">
              <div>• Saturday: Diagnosis will be calculated and mentor will review</div>
              <div>• Sunday: You must submit your ADJUST for next week (due 6pm)</div>
              <div>• Monday: New week begins, new commit required</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b-2 border-black p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-bold">VENDOURA</div>
          <div className="text-sm">Week {currentWeek} Report</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/screens" className="text-sm underline mb-4 inline-block">← Back to Screen Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">SCREEN 4 OF 6 — CRITICAL</div>
          <h1 className="text-2xl mb-2">REVENUE REPORT</h1>
          <p className="text-sm text-gray-600">Submit weekly revenue with evidence</p>
        </div>
        
        {/* Deadline Warning */}
        <div className="mb-6 p-4 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-1">⚠️ CRITICAL DEADLINE: {deadline}</div>
          <div className="text-sm">Time remaining: {hoursUntilDeadline} hours</div>
          <div className="text-sm mt-2">
            Missing this deadline will FREEZE your stage progress and notify your mentor.
          </div>
        </div>
        
        {/* Your Commitment */}
        <div className="mb-8 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">YOUR COMMITMENT:</div>
          <div className="text-sm mb-4">{committedAction}</div>
          <div className="text-sm">
            <span className="font-bold">Target Revenue:</span> ${targetRevenue.toLocaleString()}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 border-2 border-red-600 bg-red-50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-bold mb-1">CANNOT SUBMIT</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <div className="space-y-6 mb-8">
          {/* Revenue Generated */}
          <div className="border-2 border-black p-6">
            <label className="block font-bold mb-2">
              How much revenue did you generate this week?
            </label>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">$</span>
              <input 
                type="number"
                value={revenueGenerated}
                onChange={(e) => setRevenueGenerated(e.target.value)}
                className="flex-1 border-2 border-black p-4 text-xl"
                placeholder="0"
              />
            </div>
            <div className="text-xs text-gray-600">
              If $0, explain why in the narrative below. Be honest.
            </div>
          </div>
          
          {/* Hours Spent */}
          <div className="border-2 border-black p-6">
            <label className="block font-bold mb-2">
              How many hours did you spend on this action?
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="number"
                step="0.5"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
                className="border-2 border-black p-4 w-32"
                placeholder="0"
              />
              <span className="text-sm text-gray-600">hours</span>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              This calculates your $ per hour. Be accurate.
            </div>
          </div>
          
          {/* Evidence Upload */}
          <div className="border-2 border-black p-6">
            <label className="block font-bold mb-2">
              Upload Evidence (REQUIRED)
            </label>
            <div className="text-sm mb-4">
              You must provide proof of your work. No evidence = report rejected.
            </div>
            
            <div 
              onClick={handleFileUpload}
              className="border-2 border-dashed border-black p-8 text-center cursor-pointer hover:bg-gray-50"
            >
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm font-bold mb-1">Click to upload files</div>
              <div className="text-xs text-gray-600">
                Screenshots, receipts, invoices, contracts, emails, payment confirmations
              </div>
            </div>
            
            {evidenceFiles.length > 0 && (
              <div className="mt-4">
                <div className="text-sm font-bold mb-2">UPLOADED FILES:</div>
                <div className="space-y-2">
                  {evidenceFiles.map((file, i) => (
                    <div key={i} className="border-2 border-black p-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold">{file.name}</div>
                        <div className="text-xs text-gray-600">{file.size}</div>
                      </div>
                      <button 
                        onClick={() => removeFile(i)}
                        className="p-1 hover:bg-gray-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Narrative */}
          <div className="border-2 border-black p-6">
            <label className="block font-bold mb-2">
              What happened? (Narrative)
            </label>
            <div className="text-sm mb-4">
              Explain the results. What worked? What didn't? Be specific.
            </div>
            <textarea 
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="w-full border-2 border-black p-4 min-h-40"
              placeholder="Example: I called 20 leads as planned. Reached 14 of them. 5 were interested and asked for proposals. 2 signed contracts immediately ($3,500 total). The other 3 need more time. 6 were not interested. Main learning: leads from webinar are warmer than cold calls."
            />
            <div className="text-xs text-gray-600 mt-1">
              Minimum 50 characters. Your mentor will read this.
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="border-4 border-black p-8 bg-gray-50">
          <div className="font-bold mb-4">READY TO SUBMIT REPORT?</div>
          <div className="text-sm mb-6">
            Once submitted, this report is locked and will be reviewed by your mentor.
          </div>
          
          <div className="mb-6 p-4 border-2 border-black bg-white">
            <div className="text-sm font-bold mb-2">BEFORE SUBMITTING, CHECK:</div>
            <div className="space-y-1 text-sm">
              <div>□ Revenue amount entered</div>
              <div>□ Hours spent entered</div>
              <div>□ Evidence files uploaded</div>
              <div>□ Narrative explains what happened</div>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit}
            className="bg-black text-white px-8 py-4 border-2 border-black hover:bg-gray-800 w-full"
          >
            SUBMIT REPORT
          </button>
        </div>
        
        <div className="mt-12 p-6 border-2 border-red-600 bg-red-50">
          <div className="font-bold mb-2">⚠️ CRITICAL LOCK POINT:</div>
          <div className="text-sm">This is the most important screen in Vendoura. No report = stage progress freezes. Report without evidence = rejected.</div>
        </div>
      </div>
    </div>
  );
}
