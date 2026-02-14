import { Link } from "react-router";
import { useState } from "react";
import { AlertCircle } from "lucide-react";

export default function RefinedCommit() {
  const currentWeek = 3;
  const deadline = "Monday, Feb 10 at 9:00am";
  const hoursUntilDeadline = 4;
  
  const [action, setAction] = useState("");
  const [target, setTarget] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const validateCommit = () => {
    const vagueWords = ['work on', 'try to', 'maybe', 'explore', 'think about', 'consider'];
    const lowerAction = action.toLowerCase();
    
    for (const word of vagueWords) {
      if (lowerAction.includes(word)) {
        return `Vague commitment detected: "${word}". Be specific about what you will do.`;
      }
    }
    
    if (action.length < 20) {
      return "Action is too short. Describe specifically what you will do.";
    }
    
    if (!target || parseFloat(target) <= 0) {
      return "Enter a specific revenue target (must be > $0).";
    }
    
    if (!completionDate) {
      return "Select a completion date.";
    }
    
    return null;
  };
  
  const handleSubmit = () => {
    const validationError = validateCommit();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError("");
    setSubmitted(true);
  };
  
  if (submitted) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
            <div className="font-semibold">Vendoura</div>
            <div className="text-sm text-neutral-600">Week {currentWeek} Commit</div>
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto px-8 py-12">
          <div className="bg-white border-2 border-green-600 rounded-sm p-10">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <div className="text-2xl">✓</div>
            </div>
            
            <div className="text-2xl font-semibold mb-6">Commit Submitted</div>
            
            <div className="mb-8 p-6 bg-neutral-50 rounded-sm">
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-3">Your Commitment</div>
              <div className="text-neutral-900 mb-4">{action}</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-600">Target Revenue:</span>
                  <span className="ml-2 font-medium">${target}</span>
                </div>
                <div>
                  <span className="text-neutral-600">Due:</span>
                  <span className="ml-2 font-medium">{completionDate}</span>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-neutral-600 mb-6">
              This commitment is now locked. You will report on this action Friday at 6pm.
            </div>
            
            <Link 
              to="/refined/dashboard" 
              className="inline-block bg-neutral-900 text-white px-6 py-3 rounded-sm hover:bg-neutral-800 transition-colors"
            >
              Return to Dashboard
            </Link>
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
          <div className="text-sm text-neutral-600">Week {currentWeek} Commit</div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto px-8 py-12">
        <Link to="/refined" className="text-sm text-neutral-600 hover:text-black mb-8 inline-block">← Back to Refined Index</Link>
        
        {/* Header */}
        <div className="mb-12">
          <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Weekly Commit</div>
          <h1 className="text-3xl mb-3">State Your Revenue Action</h1>
          <p className="text-neutral-600">Be specific. This commitment will be locked once submitted.</p>
        </div>
        
        {/* Deadline */}
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-sm mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <div className="text-lg">⏱</div>
            </div>
            <div>
              <div className="font-medium mb-1">Deadline: {deadline}</div>
              <div className="text-sm text-neutral-600">{hoursUntilDeadline} hours remaining</div>
            </div>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-sm mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium text-red-900 mb-1">Commit Rejected</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <div className="space-y-8 mb-12">
          {/* Action */}
          <div>
            <label className="block font-medium mb-3">
              What specific action will you take this week?
            </label>
            <textarea 
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full border border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-sm min-h-32 transition-colors"
              placeholder="Example: Call 20 leads from last month's webinar to offer 15% discount on annual plan"
            />
            <div className="text-xs text-neutral-500 mt-2">
              Be specific. Include: what, who, how many, what outcome.
            </div>
          </div>
          
          {/* Target Revenue */}
          <div>
            <label className="block font-medium mb-3">
              What is your revenue target for this action?
            </label>
            <div className="flex items-center gap-3">
              <span className="text-2xl text-neutral-400">$</span>
              <input 
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="flex-1 border border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-sm text-xl transition-colors"
                placeholder="5000"
              />
            </div>
            <div className="text-xs text-neutral-500 mt-2">
              This is your goal, not a guarantee. Be ambitious but realistic.
            </div>
          </div>
          
          {/* Completion Date */}
          <div>
            <label className="block font-medium mb-3">
              When will this action be complete?
            </label>
            <input 
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="border border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-sm transition-colors"
            />
            <div className="text-xs text-neutral-500 mt-2">
              Must be before Friday 6pm (report deadline).
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="bg-white border border-neutral-200 p-8 rounded-sm">
          <div className="font-medium mb-3">Ready to Commit?</div>
          <div className="text-sm text-neutral-600 mb-6">
            Once submitted, this commitment is locked. You will report on this action Friday at 6pm.
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full bg-neutral-900 text-white py-4 rounded-sm hover:bg-neutral-800 transition-colors font-medium"
          >
            Submit Commit
          </button>
        </div>
      </div>
    </div>
  );
}
