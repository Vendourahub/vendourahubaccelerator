import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { FileText, AlertCircle, Lightbulb, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { getCurrentFounder } from '../lib/authManager';
import { founderService } from '../lib/founderService';
import { formatCurrency } from '../lib/currency';
import { getNextMonday9am, formatWATDate, formatWATTime } from '../lib/time';
import { HelpPanel } from '../components/HelpPanel';

export default function Commit() {
  const navigate = useNavigate();
  const [founder, setFounder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState("");
  const [target, setTarget] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [commitId, setCommitId] = useState<string | null>(null);
  
  // Load founder data and check for existing commit
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const founderData = await getCurrentFounder();
        
        if (!founderData) {
          navigate("/login");
          return;
        }
        
        setFounder(founderData);
        
        // Check if commit already exists for current week
        const commits = await founderService.getMyCommits();
        const currentWeek = founderData.current_week || founderData.currentWeek || 1;
        const existingCommit = commits.find(c => c.week_number === currentWeek);
        
        if (existingCommit) {
          setAction(existingCommit.action_description);
          setTarget(existingCommit.target_revenue.toString());
          setCompletionDate(existingCommit.completion_date.split('T')[0]);
          setCommitId(existingCommit.id);
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Error loading founder data:", err);
        setError("Failed to load your profile. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }
  
  if (!founder) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-neutral-600">Unable to load your profile. Please <Link to="/login" className="text-blue-600 hover:underline">sign in again</Link>.</p>
        </div>
      </div>
    );
  }
  
  const validateCommit = () => {
    const vagueWords = ['work on', 'try to', 'maybe', 'explore', 'think about', 'consider', 'look into'];
    const lowerAction = action.toLowerCase();
    
    for (const word of vagueWords) {
      if (lowerAction.includes(word)) {
        return `Vague commitment detected: "${word}". Be specific about what you will do.`;
      }
    }
    
    if (action.length < 30) {
      return "Action is too short. Describe specifically what you will do, who you'll target, and expected outcome.";
    }
    
    if (!target || parseFloat(target) <= 0) {
      return "Enter a specific revenue target (must be > ₦0).";
    }
    
    const targetNum = parseFloat(target);
    const avgWeeklyRevenue = (founder.revenueBaseline30d || founder.baseline_revenue_30d || 0) / 4;
    
    if (avgWeeklyRevenue > 0 && targetNum > avgWeeklyRevenue * 5) {
      return `Target seems unrealistic. Your average weekly revenue is ${formatCurrency(Math.round(avgWeeklyRevenue))}. Consider a more achievable target.`;
    }
    
    if (!completionDate) {
      return "Select a completion date.";
    }
    
    const selectedDate = new Date(completionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return "Completion date must be in the future.";
    }
    
    return null;
  };
  
  const handleSubmit = async () => {
    const validationError = validateCommit();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError("");
    setSubmitting(true);
    
    try {
      const currentWeek = founder.current_week || founder.currentWeek || 1;
      const nextMonday = getNextMonday9am();
      
      const result = await founderService.submitCommit({
        week_number: currentWeek,
        action_description: action,
        target_revenue: parseFloat(target),
        completion_date: new Date(completionDate).toISOString(),
        deadline: nextMonday.toISOString(),
        is_late: false,
        status: 'pending'
      });
      
      if (result) {
        setCommitId(result.id);
        setSubmitted(true);
      } else {
        setError("Failed to submit commit. Please try again.");
      }
    } catch (err: any) {
      console.error("Error submitting commit:", err);
      setError(err.message || "Failed to submit commit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border-2 border-green-600 rounded-xl p-10">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Commit Submitted</h1>
          <p className="text-neutral-600 mb-8">
            Your commitment is now locked. You'll report on this action Friday at 6pm WAT.
          </p>
          
          <div className="p-6 bg-neutral-50 rounded-lg mb-8">
            <div className="font-bold mb-3">Your Week {founder.current_week || founder.currentWeek || 1} Commit:</div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-neutral-500 mb-1">Action</div>
                <div className="font-medium">{action}</div>
              </div>
              <div>
                <div className="text-neutral-500 mb-1">Revenue Target</div>
                <div className="font-bold text-lg text-green-600">{formatCurrency(parseFloat(target))}</div>
              </div>
              <div>
                <div className="text-neutral-500 mb-1">Completion Date</div>
                <div className="font-medium">{new Date(completionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <div className="font-bold text-blue-600">1</div>
              </div>
              <div>
                <div className="font-bold">Next: Execute Daily</div>
                <div className="text-neutral-600">Log your work hours in the Execute page</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <div className="font-bold text-blue-600">2</div>
              </div>
              <div>
                <div className="font-bold">Friday 6pm WAT: Submit Revenue Report</div>
                <div className="text-neutral-600">Report actual revenue generated + evidence</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 text-sm">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <div className="font-bold text-blue-600">3</div>
              </div>
              <div>
                <div className="font-bold">Sunday 6pm WAT: Review & Adjust</div>
                <div className="text-neutral-600">Analyze what worked, plan next week</div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/execute" className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-center font-medium">
              Go to Execute
            </Link>
            <Link to="/dashboard" className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-center font-medium">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const currentWeek = founder.current_week || founder.currentWeek || 1;
  const nextMonday = getNextMonday9am();
  const baseline30d = founder.revenueBaseline30d || founder.baseline_revenue_30d || 0;
  const avgWeeklyRevenue = baseline30d / 4;
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Week {currentWeek} — Weekly Commit</h1>
        <p className="text-neutral-600">
          Commit to ONE specific revenue action. Be clear, measurable, and realistic.
        </p>
      </div>
      
      {/* Deadline Warning */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <div className="font-bold text-blue-900 mb-1">Deadline: {formatWATDate(nextMonday)} at {formatWATTime(nextMonday)}</div>
            <div className="text-sm text-blue-700">
              Submit before Monday 9am to avoid dashboard lock. Once submitted, commitment cannot be changed.
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      {/* Form */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-6">
        <div>
          <label className="block font-bold mb-2">
            What ONE action will you take this week to generate revenue? *
          </label>
          <textarea
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="Example: Call 50 leads from last month's webinar attendees who didn't convert, offer limited-time discount, target 5 closed deals."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 min-h-32"
          />
          <div className="flex items-start gap-2 mt-2">
            <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-600">
              <strong>Must include:</strong> Specific action, target audience, quantity/volume, expected outcome. 
              <strong className="text-red-600"> Avoid:</strong> "work on", "try to", "maybe", "explore"
            </div>
          </div>
        </div>
        
        <div>
          <label className="block font-bold mb-2">
            Revenue Target for This Week *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-neutral-500 font-bold">₦</span>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="0"
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div className="flex items-start gap-2 mt-2">
            <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-600">
              Your 30-day baseline: {formatCurrency(baseline30d)} 
              {avgWeeklyRevenue > 0 && ` (avg weekly: ${formatCurrency(Math.round(avgWeeklyRevenue))})`}. 
              Target should be challenging but achievable.
            </div>
          </div>
        </div>
        
        <div>
          <label className="block font-bold mb-2">
            Target Completion Date *
          </label>
          <input
            type="date"
            value={completionDate}
            onChange={(e) => setCompletionDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <div className="text-xs text-neutral-600 mt-2">
            When will you complete this action? Must be within this week.
          </div>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={submitting || !action || !target || !completionDate}
          className="w-full px-6 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-bold text-lg disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Commit (Cannot Be Changed)"
          )}
        </button>
      </div>
      
      {/* Commit Quality Guide */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="font-bold text-purple-900 mb-3">What Makes a Good Commit?</div>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div><strong>GOOD:</strong> "Email 100 past trial users who churned in Q4, offer 50% discount, target 10 paid conversions"</div>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div><strong>BAD:</strong> "Work on marketing" or "Try to get more customers"</div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div><strong>GOOD:</strong> "Launch referral program with ₦50k reward, contact 30 top customers personally, target 15 referrals"</div>
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div><strong>BAD:</strong> "Maybe explore partnerships" or "Think about pricing changes"</div>
          </div>
        </div>
      </div>
    </div>
  );
}