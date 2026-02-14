import { Link } from "react-router";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function WeeklyCommit() {
  const currentWeek = 3;
  const deadline = "Monday, Feb 10 at 9:00am";
  const hoursUntilDeadline = 4;
  const isPastDeadline = false;
  
  const [action, setAction] = useState("");
  const [target, setTarget] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const validateCommit = () => {
    // Check for vague language
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
      <div className="min-h-screen bg-white">
        <div className="border-b-2 border-black p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="font-bold">VENDOURA</div>
            <div className="text-sm">Week {currentWeek} Commit</div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto p-8">
          <div className="border-2 border-green-600 bg-green-50 p-8">
            <div className="text-2xl font-bold mb-4">✓ COMMIT SUBMITTED</div>
            <div className="mb-6">
              <div className="text-sm font-bold mb-2">YOUR COMMITMENT:</div>
              <div className="text-sm mb-4">{action}</div>
              <div className="text-sm">
                <span className="font-bold">Target Revenue:</span> ${target}
              </div>
              <div className="text-sm">
                <span className="font-bold">Completion Date:</span> {completionDate}
              </div>
            </div>
            <div className="text-sm mb-6">
              This commitment is now locked. You will report on this action on Friday at 6pm.
            </div>
            <Link 
              to="/screens/dashboard" 
              className="inline-block bg-black text-white px-6 py-3 border-2 border-black"
            >
              RETURN TO DASHBOARD
            </Link>
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
          <div className="text-sm">Week {currentWeek} Commit</div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-8">
        <Link to="/screens" className="text-sm underline mb-4 inline-block">← Back to Screen Index</Link>
        
        <div className="mb-8">
          <div className="text-xs text-gray-500 mb-1">SCREEN 2 OF 6</div>
          <h1 className="text-2xl mb-2">WEEKLY COMMIT</h1>
          <p className="text-sm text-gray-600">State your specific revenue action for this week</p>
        </div>
        
        {/* Deadline Warning */}
        <div className="mb-6 p-4 border-2 border-black bg-gray-100">
          <div className="font-bold mb-1">DEADLINE: {deadline}</div>
          <div className="text-sm">Time remaining: {hoursUntilDeadline} hours</div>
          {isPastDeadline && (
            <div className="text-sm text-red-600 mt-2">⚠️ LATE SUBMISSION - Mentor has been notified</div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mb-8 p-6 border-2 border-black">
          <div className="font-bold mb-2">COMMIT REQUIREMENTS:</div>
          <ul className="text-sm space-y-1">
            <li>• Be specific: Say exactly what you will do</li>
            <li>• Set a revenue target: How much $ do you aim to generate?</li>
            <li>• Set a deadline: When will this be complete?</li>
            <li>• No vague language: "work on sales" = REJECTED</li>
          </ul>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 border-2 border-red-600 bg-red-50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <div className="font-bold mb-1">COMMIT REJECTED</div>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <div className="space-y-6 mb-8">
          {/* Action */}
          <div>
            <label className="block font-bold mb-2">
              What specific action will you take this week?
            </label>
            <textarea 
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full border-2 border-black p-4 min-h-32"
              placeholder="Example: Call 20 leads from last month's webinar to offer 15% discount on annual plan"
            />
            <div className="text-xs text-gray-600 mt-1">
              Be specific. Include: what, who, how many, what outcome.
            </div>
          </div>
          
          {/* Target Revenue */}
          <div>
            <label className="block font-bold mb-2">
              What is your revenue target for this action?
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">$</span>
              <input 
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="flex-1 border-2 border-black p-4 text-xl"
                placeholder="5000"
              />
            </div>
            <div className="text-xs text-gray-600 mt-1">
              This is your goal, not a guarantee. Be ambitious but realistic.
            </div>
          </div>
          
          {/* Completion Date */}
          <div>
            <label className="block font-bold mb-2">
              When will this action be complete?
            </label>
            <input 
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="border-2 border-black p-4"
            />
            <div className="text-xs text-gray-600 mt-1">
              Must be before Friday 6pm (report deadline).
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="border-2 border-black p-6">
          <div className="font-bold mb-4">READY TO COMMIT?</div>
          <div className="text-sm mb-6">
            Once submitted, this commitment is locked. You will report on this action Friday at 6pm.
          </div>
          <button 
            onClick={handleSubmit}
            className="bg-black text-white px-8 py-4 border-2 border-black hover:bg-gray-800"
          >
            SUBMIT COMMIT
          </button>
        </div>
        
        <div className="mt-12 p-6 border-2 border-black bg-gray-50">
          <div className="font-bold mb-2">SCREEN FUNCTION:</div>
          <div className="text-sm">Forces specificity. Rejects vague commits. Locks commitment once submitted.</div>
        </div>
      </div>
    </div>
  );
}
