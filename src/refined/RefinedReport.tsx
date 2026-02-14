import { Link } from "react-router";
import { useState } from "react";
import { Upload, AlertCircle, X } from "lucide-react";

export default function RefinedReport() {
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
    if (!revenueGenerated) {
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
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="font-semibold">Vendoura</div>
            <div className="text-sm text-neutral-600">Week {currentWeek} Report</div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto px-8 py-12">
          <div className="bg-white border-2 border-green-600 rounded-sm p-10 mb-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <div className="text-2xl">✓</div>
            </div>
            
            <div className="text-2xl font-semibold mb-6">Report Submitted</div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-neutral-50 p-6 rounded-sm">
                <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Revenue</div>
                <div className="text-2xl font-semibold">${revenue.toLocaleString()}</div>
              </div>
              <div className="bg-neutral-50 p-6 rounded-sm">
                <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">$ Per Hour</div>
                <div className="text-2xl font-semibold">${dollarPerHour}</div>
              </div>
              <div className="bg-neutral-50 p-6 rounded-sm">
                <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Win Rate</div>
                <div className="text-2xl font-semibold">{winRate}%</div>
              </div>
            </div>
            
            <div className="text-sm text-neutral-600 mb-6">
              Your Week {currentWeek} report has been recorded. Diagnosis will be available Saturday.
            </div>
            
            <Link 
              to="/refined/dashboard" 
              className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-sm hover:bg-neutral-800 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
          
          <div className="bg-white border border-neutral-200 p-6 rounded-sm">
            <div className="font-medium mb-3">Next Steps</div>
            <div className="text-sm text-neutral-600 space-y-2">
              <div>• Saturday: Diagnosis will be calculated and mentor will review</div>
              <div>• Sunday: Submit your ADJUST for next week (due 6pm)</div>
              <div>• Monday: New week begins, new commit required</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="font-semibold">Vendoura</div>
          <div className="text-sm text-neutral-600">Week {currentWeek} Report</div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-8 py-12">
        <Link to="/refined" className="text-sm text-neutral-600 hover:text-black mb-8 inline-block">← Back to Refined Index</Link>
        
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Revenue Report</div>
          <h1 className="text-3xl mb-3">Submit Weekly Results</h1>
          <p className="text-neutral-600">Evidence is required. No report without proof.</p>
        </div>
        
        {/* Critical Deadline */}
        <div className="bg-red-50 border-2 border-red-600 p-6 rounded-sm mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <div className="text-lg">⚠️</div>
            </div>
            <div>
              <div className="font-semibold text-red-900 mb-1">Critical Deadline: {deadline}</div>
              <div className="text-sm text-red-700 mb-2">{hoursUntilDeadline} hours remaining</div>
              <div className="text-sm text-red-800">
                Missing this deadline will freeze your stage progress and notify your mentor.
              </div>
            </div>
          </div>
        </div>
        
        {/* Your Commitment */}
        <div className="bg-white border border-neutral-200 p-6 rounded-sm mb-8">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Your Commitment</div>
          <div className="text-neutral-900 mb-4">{committedAction}</div>
          <div className="text-sm text-neutral-600">
            Target Revenue: ${targetRevenue.toLocaleString()}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-sm mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-red-900 mb-1">Cannot Submit</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <div className="space-y-8 mb-12">
          {/* Revenue Generated */}
          <div className="bg-white border border-neutral-200 p-6 rounded-sm">
            <label className="block font-medium mb-3">
              How much revenue did you generate this week?
            </label>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl text-neutral-400">$</span>
              <input 
                type="number"
                value={revenueGenerated}
                onChange={(e) => setRevenueGenerated(e.target.value)}
                className="flex-1 border border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-sm text-xl transition-colors"
                placeholder="0"
              />
            </div>
            <div className="text-xs text-neutral-500">
              If $0, explain why in the narrative below. Be honest.
            </div>
          </div>
          
          {/* Hours Spent */}
          <div className="bg-white border border-neutral-200 p-6 rounded-sm">
            <label className="block font-medium mb-3">
              How many hours did you spend on this action?
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="number"
                step="0.5"
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
                className="border border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-sm w-32 transition-colors"
                placeholder="0"
              />
              <span className="text-sm text-neutral-500">hours</span>
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              This calculates your $ per hour. Be accurate.
            </div>
          </div>
          
          {/* Evidence Upload */}
          <div className="bg-white border border-neutral-200 p-6 rounded-sm">
            <label className="block font-medium mb-3">
              Upload Evidence <span className="text-red-600">*</span>
            </label>
            <div className="text-sm text-neutral-600 mb-4">
              You must provide proof of your work. No evidence = report rejected.
            </div>
            
            <div 
              onClick={handleFileUpload}
              className="border-2 border-dashed border-neutral-300 hover:border-neutral-400 p-8 rounded-sm text-center cursor-pointer transition-colors"
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
              <div className="text-sm font-medium mb-1">Click to upload files</div>
              <div className="text-xs text-neutral-500">
                Screenshots, receipts, invoices, contracts, emails, payment confirmations
              </div>
            </div>
            
            {evidenceFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {evidenceFiles.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-sm">
                    <div>
                      <div className="text-sm font-medium">{file.name}</div>
                      <div className="text-xs text-neutral-500">{file.size}</div>
                    </div>
                    <button 
                      onClick={() => removeFile(i)}
                      className="p-1 hover:bg-neutral-200 rounded-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Narrative */}
          <div className="bg-white border border-neutral-200 p-6 rounded-sm">
            <label className="block font-medium mb-3">
              What happened? (Narrative)
            </label>
            <div className="text-sm text-neutral-600 mb-4">
              Explain the results. What worked? What didn't? Be specific.
            </div>
            <textarea 
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="w-full border border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-sm min-h-40 transition-colors"
              placeholder="Example: I called 20 leads as planned. Reached 14 of them. 5 were interested and asked for proposals. 2 signed contracts immediately ($3,500 total)..."
            />
            <div className="text-xs text-neutral-500 mt-2">
              Minimum 50 characters. Your mentor will read this.
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="bg-white border-2 border-neutral-900 p-8 rounded-sm">
          <div className="font-medium mb-3">Ready to Submit Report?</div>
          <div className="text-sm text-neutral-600 mb-6">
            Once submitted, this report is locked and will be reviewed by your mentor.
          </div>
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-neutral-900 text-white py-4 rounded-sm hover:bg-neutral-800 transition-colors font-medium"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
