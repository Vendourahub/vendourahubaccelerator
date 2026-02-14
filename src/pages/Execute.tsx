// Execute Page - Monday-Friday: Log execution hours
import { useState, useEffect } from "react";
import { Clock, Play, Pause, CheckCircle, AlertCircle, TrendingUp, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router";
import { getFounderData } from "../lib/auth";
import { formatCurrency } from "../lib/currency";
import { formatWATDate, formatWATTime, getNextFriday6pm } from "../lib/time";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { HelpPanel } from "../components/HelpPanel";

interface ExecutionLog {
  id: string;
  date: string;
  hours: number;
  description: string;
  revenue_impact?: number;
}

interface TimerState {
  isActive: boolean;
  startTime: number;
  elapsedSeconds: number;
  description: string;
}

export default function Execute() {
  const [founder, setFounder] = useState<any>(null);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [todayHours, setTodayHours] = useState("");
  const [description, setDescription] = useState("");
  const [revenueImpact, setRevenueImpact] = useState("");
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [showAutoFillNotice, setShowAutoFillNotice] = useState(false);

  // Load founder data and timer state on mount
  useEffect(() => {
    loadFounderData();
    loadTimerState();
    loadExecutionLogs();
  }, []);

  // Persist timer state to localStorage and update every second
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive) {
      // Save timer state
      const timerState: TimerState = {
        isActive: true,
        startTime: Date.now() - (timerSeconds * 1000),
        elapsedSeconds: timerSeconds,
        description: description
      };
      localStorage.setItem('vendoura_timer', JSON.stringify(timerState));
      
      // Update timer every second
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          const newSeconds = prev + 1;
          // Update localStorage with new elapsed time
          const state: TimerState = {
            isActive: true,
            startTime: Date.now() - (newSeconds * 1000),
            elapsedSeconds: newSeconds,
            description: description
          };
          localStorage.setItem('vendoura_timer', JSON.stringify(state));
          return newSeconds;
        });
      }, 1000);
    } else {
      // Clear timer from localStorage when stopped
      localStorage.removeItem('vendoura_timer');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerSeconds, description]);

  const loadTimerState = () => {
    const savedTimer = localStorage.getItem('vendoura_timer');
    if (savedTimer) {
      try {
        const timerState: TimerState = JSON.parse(savedTimer);
        if (timerState.isActive) {
          // Calculate elapsed time since timer was started
          const now = Date.now();
          const elapsed = Math.floor((now - timerState.startTime) / 1000);
          setTimerSeconds(elapsed);
          setIsTimerActive(true);
          setDescription(timerState.description || "");
        }
      } catch (err) {
        console.error("Error loading timer state:", err);
      }
    }
  };

  const loadFounderData = async () => {
    try {
      const founderData = await getFounderData();
      if (founderData) {
        setFounder(founderData);
      }
    } catch (error) {
      console.error("Error loading founder data:", error);
    }
  };

  const loadExecutionLogs = async () => {
    try {
      setLoadingLogs(true);
      const founderData = await getFounderData();
      
      if (!founderData) {
        setLoadingLogs(false);
        return;
      }

      const weekNumber = founderData.current_week || founderData.currentWeek || 1;
      
      // Fetch execution logs from server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eddbcb21/execution/logs/${founderData.id}/${weekNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      } else {
        setLogs([]);
      }
    } catch (error) {
      console.error("Error loading execution logs:", error);
      setLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleStartTimer = () => {
    setIsTimerActive(true);
    setTimerSeconds(0);
  };

  const handleStopTimer = () => {
    setIsTimerActive(false);
    const hours = (timerSeconds / 3600).toFixed(2);
    setTodayHours(hours);
    // Show a toast or notification that hours were auto-filled
    setShowAutoFillNotice(true);
    setTimeout(() => {
      setShowAutoFillNotice(false);
    }, 2000);
  };

  const handleResetTimer = () => {
    setIsTimerActive(false);
    setTimerSeconds(0);
    localStorage.removeItem('vendoura_timer');
  };

  const handleLogHours = async () => {
    if (!todayHours || parseFloat(todayHours) <= 0 || !description) {
      alert("Please enter hours and description");
      return;
    }

    if (!founder) {
      alert("Founder data not loaded");
      return;
    }

    setLoading(true);
    try {
      const weekNumber = founder.current_week || founder.currentWeek || 1;
      
      // Save to server
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eddbcb21/execution/logs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            founder_id: founder.id,
            week_number: weekNumber,
            hours: parseFloat(todayHours),
            description,
            revenue_impact: revenueImpact ? parseFloat(revenueImpact) : 0,
            date: new Date().toISOString().split('T')[0]
          })
        }
      );

      if (response.ok) {
        // Reload logs
        await loadExecutionLogs();
        
        // Reset form
        setTodayHours("");
        setDescription("");
        setRevenueImpact("");
        setTimerSeconds(0);
        handleResetTimer();
        
        alert("Hours logged successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to log hours: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error logging hours:", error);
      alert("Failed to log hours. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this log?")) {
      return;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-eddbcb21/execution/logs/${logId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        await loadExecutionLogs();
      } else {
        alert("Failed to delete log");
      }
    } catch (error) {
      console.error("Error deleting log:", error);
      alert("Failed to delete log");
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalWeekHours = logs.reduce((sum, log) => sum + log.hours, 0);
  const totalWeekRevenue = logs.reduce((sum, log) => sum + (log.revenue_impact || 0), 0);
  const nextFriday = getNextFriday6pm();

  if (!founder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Execute: Log Your Hours</h1>
            <p className="text-neutral-600">
              Track time spent on your weekly commit. Execution beats planning.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-600 mb-1">Week {founder.current_week || founder.currentWeek}</div>
            <div className="text-2xl font-bold">{totalWeekHours.toFixed(1)}h</div>
            <div className="text-xs text-neutral-500">This week</div>
          </div>
        </div>

        {/* Deadline Warning */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-blue-900">Report due: {formatWATDate(nextFriday)} at {formatWATTime(nextFriday)}</div>
            <div className="text-sm text-blue-700">Log hours daily. Friday you'll report total revenue generated.</div>
          </div>
        </div>
      </div>

      {/* Timer - Runs in Background */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200 p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Work Timer</h2>
          {isTimerActive && (
            <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full animate-pulse">
              RUNNING IN BACKGROUND
            </span>
          )}
        </div>
        
        <div className="text-center mb-8">
          <div className="text-6xl font-bold mb-4 font-mono text-neutral-900">{formatTime(timerSeconds)}</div>
          <div className="text-sm text-neutral-600">
            {isTimerActive ? "Timer continues even when you leave this page" : "Current session"}
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          {!isTimerActive ? (
            <button
              onClick={handleStartTimer}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Play className="w-5 h-5" />
              Start Timer
            </button>
          ) : (
            <button
              onClick={handleStopTimer}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Pause className="w-5 h-5" />
              Stop & Log Hours
            </button>
          )}
          <button
            onClick={handleResetTimer}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
          >
            Reset
          </button>
        </div>

        {isTimerActive && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
            <p className="text-sm text-green-800 font-medium">
              ⏱️ Timer is running! You can navigate to other pages, and it will keep tracking your time.
            </p>
          </div>
        )}
      </div>

      {/* Log Hours Form */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-xl font-bold mb-6">Log Completed Work</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hours Worked</label>
            <input
              type="number"
              step="0.1"
              value={todayHours}
              onChange={(e) => setTodayHours(e.target.value)}
              placeholder="e.g., 3.5"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
            {showAutoFillNotice && (
              <div className="mt-1 text-sm text-green-500">
                Hours auto-filled from timer
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">What did you do? (Be specific)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Called 20 leads from webinar list, 5 booked demos for next week"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 min-h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Revenue Impact (Optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-neutral-500">₦</span>
              <input
                type="number"
                value={revenueImpact}
                onChange={(e) => setRevenueImpact(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>
            <p className="text-xs text-neutral-500 mt-1">If this work directly generated revenue today</p>
          </div>

          <button
            onClick={handleLogHours}
            disabled={loading || !todayHours || !description}
            className="w-full px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {loading ? "Logging..." : "Log Hours"}
          </button>
        </div>
      </div>

      {/* This Week's Logs */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">This Week's Execution Log</h2>
          <div className="text-right">
            <div className="text-sm text-neutral-600">Total Revenue Impact</div>
            <div className="text-xl font-bold text-green-600">{formatCurrency(totalWeekRevenue)}</div>
          </div>
        </div>

        {loadingLogs ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-lg">
            <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium mb-1">No hours logged this week</p>
            <p className="text-sm text-neutral-500">Start the timer and get to work!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-500" />
                        <span className="font-bold">{log.hours.toFixed(1)}h</span>
                      </div>
                      <div className="text-sm text-neutral-500">{new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      {log.revenue_impact && log.revenue_impact > 0 && (
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                          +{formatCurrency(log.revenue_impact)}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700">{log.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteLog(log.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Productivity Insight */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <div className="font-bold text-purple-900 mb-2">Execution Insight</div>
            {totalWeekHours > 0 && totalWeekRevenue > 0 ? (
              <div className="text-sm text-purple-800">
                <p className="mb-2">
                  Your <strong>{formatCurrency(totalWeekRevenue)}</strong> revenue from <strong>{totalWeekHours.toFixed(1)} hours</strong> means you're generating <strong>{formatCurrency(totalWeekRevenue / totalWeekHours)}</strong> per hour.
                </p>
                <p className="text-xs text-purple-700">
                  Focus on activities with the highest ₦/hour ratio. Eliminate low-value work.
                </p>
              </div>
            ) : (
              <div className="text-sm text-purple-800">
                Log hours with revenue impact to see your ₦/hour productivity metric.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/commit" className="p-6 bg-white border border-neutral-200 rounded-lg hover:border-neutral-900 hover:shadow-lg transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900" />
            <div className="font-bold group-hover:text-neutral-900">View This Week's Commit</div>
          </div>
          <div className="text-sm text-neutral-600">See what you committed to accomplish</div>
        </Link>

        <Link to="/report" className="p-6 bg-white border border-neutral-200 rounded-lg hover:border-neutral-900 hover:shadow-lg transition-all group">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900" />
            <div className="font-bold group-hover:text-neutral-900">Submit Friday Report</div>
          </div>
          <div className="text-sm text-neutral-600">Report your weekly revenue results</div>
        </Link>
      </div>

      {/* Help Panel */}
      <HelpPanel 
        sections={[
          {
            title: "How to Use the Timer",
            content: "Click 'Start Timer' when you begin working on your weekly commit. The timer runs in the background even if you leave this page. When you finish a work session, click 'Stop & Log Hours' to automatically fill in your hours.",
            type: "info"
          },
          {
            title: "Friday Deadline",
            content: `You must submit your Revenue Report by ${formatWATDate(nextFriday)} at ${formatWATTime(nextFriday)}. Missing this deadline will lock your dashboard.`,
            type: "warning"
          },
          {
            title: "Be Specific in Descriptions",
            content: (
              <div>
                <p className="mb-2"><strong>Good:</strong> "Called 25 leads from Q4 webinar list, 3 booked demos for next week, 2 requested pricing"</p>
                <p className="mb-2"><strong>Bad:</strong> "Made some calls" or "Worked on outreach"</p>
                <p className="text-xs opacity-75 mt-2">Specific descriptions help you identify what actually drives results.</p>
              </div>
            ),
            type: "tip"
          },
          {
            title: "Revenue Impact Tracking",
            content: "Only log revenue in the 'Revenue Impact' field if you actually closed a sale or received payment that day. Use this to see which activities generate real revenue vs. just busy work.",
            type: "success"
          },
          {
            title: "Daily Logging Best Practice",
            content: "Log hours daily at the end of each workday instead of trying to remember everything on Friday. Daily logging is more accurate and helps you spot patterns in what's working.",
            type: "tip"
          }
        ]}
        storageKey="execute_help_panel"
      />
    </div>
  );
}