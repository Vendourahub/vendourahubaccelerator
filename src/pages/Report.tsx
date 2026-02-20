// Report Page - Friday 6pm: Submit revenue report with evidence
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { AlertCircle, CheckCircle, Upload, TrendingUp, Clock, Loader2, Camera, FileText } from "lucide-react";
import { getCurrentFounder } from "../lib/authManager";
import { founderService } from "../lib/founderService";
import { formatCurrency } from "../lib/currency";
import { formatWATDate, formatWATTime, getNextFriday6pm, getNextSunday6pm } from "../lib/time";
import { HelpPanel } from "../components/HelpPanel";

interface WeeklyReport {
  id: string;
  week_number: number;
  revenue_generated: number;
  evidence_urls: string[];
  evidence_description: string;
  submitted_at: string;
  status: string;
}

export default function Report() {
  const [founder, setFounder] = useState<any>(null);
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [commits, setCommits] = useState<any[]>([]);
  const [revenue, setRevenue] = useState("");
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [newEvidenceUrl, setNewEvidenceUrl] = useState("");
  const [hoursSpent, setHoursSpent] = useState("");
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFounderData();
  }, []);

  const loadFounderData = async () => {
    try {
      const storedFounder = await getFounderData();
      if (storedFounder) {
        setFounder(storedFounder);
      }

      // Load live data from Supabase
      const profile = await founderService.getMyProfile();
      if (profile) {
        setFounder(profile);
      }

      // Load past reports
      const liveReports = await founderService.getMyReports();
      if (liveReports && liveReports.length > 0) {
        setReports(liveReports);
      }
      
      // Load commits to find current week's commit
      const liveCommits = await founderService.getMyCommits();
      if (liveCommits) {
        setCommits(liveCommits);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAddEvidenceUrl = () => {
    if (newEvidenceUrl && newEvidenceUrl.startsWith("http")) {
      setEvidenceUrls([...evidenceUrls, newEvidenceUrl]);
      setNewEvidenceUrl("");
    } else {
      alert("Please enter a valid URL starting with http:// or https://");
    }
  };

  const handleRemoveEvidenceUrl = (index: number) => {
    setEvidenceUrls(evidenceUrls.filter((_, i) => i !== index));
  };

  const handleSubmitReport = async () => {
    if (!revenue || parseFloat(revenue) < 0) {
      alert("Please enter revenue amount (can be 0)");
      return;
    }

    if (evidenceUrls.length === 0 && !evidenceDescription) {
      alert("Please provide either evidence URLs or description of evidence");
      return;
    }
    
    if (!hoursSpent || parseFloat(hoursSpent) <= 0) {
      alert("Please enter hours spent (must be > 0)");
      return;
    }
    
    if (!narrative) {
      alert("Please provide a narrative of what you did");
      return;
    }

    setLoading(true);
    try {
      const currentWeek = founder.current_week || founder.currentWeek || 1;
      
      // Find the commit for this week
      const currentCommit = commits.find(c => c.week_number === currentWeek);
      
      if (!currentCommit) {
        alert("No commit found for this week. Please submit a commit first on the Commit page.");
        setLoading(false);
        return;
      }
      
      const result = await founderService.submitReport({
        week_number: currentWeek,
        commit_id: currentCommit.id,
        revenue_generated: parseFloat(revenue),
        hours_spent: parseFloat(hoursSpent),
        narrative: narrative,
        evidence_urls: evidenceUrls,
        deadline: getNextFriday6pm().toISOString(),
        is_late: false,
        status: 'submitted'
      });
      
      if (result) {
        alert("Revenue report submitted successfully! Check back Sunday for diagnosis.");
        setRevenue("");
        setEvidenceDescription("");
        setEvidenceUrls([]);
        setHoursSpent("");
        setNarrative("");
        loadFounderData();
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextFriday = getNextFriday6pm();
  const nextSunday = getNextSunday6pm();

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
            <h1 className="text-2xl font-bold mb-2">Revenue Report</h1>
            <p className="text-neutral-600">
              Report this week's revenue with evidence. Due Friday 6pm WAT.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-600 mb-1">Week {founder.current_week || founder.currentWeek}</div>
            <div className="text-2xl font-bold">Stage {founder.current_stage || founder.currentStage}</div>
          </div>
        </div>

        {/* Deadline Warning */}
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-red-900">DEADLINE: {formatWATDate(nextFriday)} at {formatWATTime(nextFriday)}</div>
            <div className="text-sm text-red-700">Missing this deadline will lock your account. Evidence is required.</div>
          </div>
        </div>
      </div>

      {/* Report Form */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <h2 className="text-xl font-bold mb-6">This Week's Revenue</h2>
        
        <div className="space-y-6">
          {/* Revenue Amount */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Total Revenue Generated <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center gap-3">
              <span className="text-neutral-600 font-bold text-2xl">₦</span>
              <input
                type="number"
                step="1000"
                min="0"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="flex-1 border-2 border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-lg text-3xl font-bold transition-colors"
                placeholder="150000"
              />
            </div>
            <div className="text-sm text-neutral-600 mt-2">
              Enter total revenue from this week's execution. If you generated ₦0, enter 0.
            </div>
          </div>

          {/* Evidence URLs */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Evidence Links <span className="text-red-600">*</span>
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newEvidenceUrl}
                  onChange={(e) => setNewEvidenceUrl(e.target.value)}
                  className="flex-1 border-2 border-neutral-300 focus:border-neutral-900 focus:outline-none p-3 rounded-lg transition-colors"
                  placeholder="https://imgur.com/abc123 or https://drive.google.com/..."
                />
                <button
                  onClick={handleAddEvidenceUrl}
                  className="px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
                >
                  Add Link
                </button>
              </div>

              {evidenceUrls.length > 0 && (
                <div className="space-y-2">
                  {evidenceUrls.map((url, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <Upload className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-sm text-green-900 hover:underline truncate"
                      >
                        {url}
                      </a>
                      <button
                        onClick={() => handleRemoveEvidenceUrl(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-neutral-600 mt-2">
              Upload screenshots to Imgur, Google Drive, or Dropbox, then paste links here
            </div>
          </div>

          {/* Evidence Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Evidence Description <span className="text-red-600">*</span>
            </label>
            <textarea
              value={evidenceDescription}
              onChange={(e) => setEvidenceDescription(e.target.value)}
              className="w-full border-2 border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-lg min-h-32 transition-colors"
              placeholder="Describe your evidence: 'Screenshot 1 shows bank alert for ₦75,000 from Client ABC. Screenshot 2 shows signed contract for ₦75,000. Total: ₦150,000 from 2 clients.'"
            />
            <div className="text-sm text-neutral-600 mt-2">
              Explain what each piece of evidence shows. Be specific about amounts and sources.
            </div>
          </div>

          {/* Hours Spent */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Hours Spent <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={hoursSpent}
              onChange={(e) => setHoursSpent(e.target.value)}
              className="w-full border-2 border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-lg text-xl font-bold transition-colors"
              placeholder="10.5"
            />
            <div className="text-sm text-neutral-600 mt-2">
              Enter the total number of hours you spent on this week's tasks.
            </div>
          </div>

          {/* Narrative */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Narrative <span className="text-red-600">*</span>
            </label>
            <textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="w-full border-2 border-neutral-300 focus:border-neutral-900 focus:outline-none p-4 rounded-lg min-h-32 transition-colors"
              placeholder="Describe what you did this week: 'I worked on project X, completed task Y, and collaborated with team Z.'"
            />
            <div className="text-sm text-neutral-600 mt-2">
              Provide a brief description of your activities and accomplishments for the week.
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmitReport}
              disabled={loading || !revenue || (evidenceUrls.length === 0 && !evidenceDescription) || !hoursSpent || !narrative}
              className="flex-1 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Revenue Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Past Reports */}
      {reports.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <h2 className="text-xl font-bold mb-6">Past Reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-4 border-2 border-neutral-200 rounded-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-medium">Week {report.week_number}</div>
                    <div className="text-sm text-neutral-600">
                      Submitted: {formatWATDate(new Date(report.submitted_at))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(report.revenue_generated)}
                    </div>
                    <div className={`text-sm ${
                      report.status === 'approved' ? 'text-green-600' :
                      report.status === 'submitted' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {report.status === 'approved' ? '✓ Verified' :
                       report.status === 'submitted' ? 'Under Review' :
                       'Needs Revision'}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-700">{report.evidence_description}</p>
                {report.evidence_urls.length > 0 && (
                  <div className="mt-3 text-sm text-neutral-600">
                    {report.evidence_urls.length} evidence file(s) attached
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <FileText className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-green-900 mb-2">Next: Review & Adjust</h3>
            <p className="text-green-800 mb-4">
              After submitting your report, review your $ per hour on the Map page by {formatWATDate(nextSunday)} at {formatWATTime(nextSunday)}.
            </p>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Go to Stage Map
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Help Panel */}
      <HelpPanel 
        sections={[
          {
            title: "What Counts as Evidence?",
            content: (
              <div>
                <p className="mb-2 font-bold">✓ ACCEPTED:</p>
                <ul className="mb-3 space-y-1 text-sm">
                  <li>• Bank transaction screenshots/alerts</li>
                  <li>• Signed contracts with payment amounts</li>
                  <li>• Invoice screenshots showing payment received</li>
                  <li>• Payment gateway confirmations (Paystack, Flutterwave)</li>
                  <li>• Client email confirmations of payment</li>
                </ul>
                <p className="mb-2 font-bold text-red-700">✗ NOT ACCEPTED:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Verbal promises or "pending" payments</li>
                  <li>• Unsigned contracts or proposals</li>
                  <li>• Screenshots without payment proof</li>
                </ul>
              </div>
            ),
            type: "info"
          },
          {
            title: "Friday 6pm WAT Deadline",
            content: `Your revenue report MUST be submitted by ${formatWATDate(nextFriday)} at ${formatWATTime(nextFriday)}. Missing this deadline will lock your account until the next week. Late submissions are flagged and may affect your standing in the program.`,
            type: "warning"
          },
          {
            title: "How to Upload Evidence",
            content: (
              <div>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>Take clear screenshots of payment proof on your device</li>
                  <li>Upload to <strong>Imgur.com</strong> (easiest, no account needed) or <strong>Google Drive/Dropbox</strong></li>
                  <li>Copy the share link</li>
                  <li>Paste link into "Evidence Links" field on this page</li>
                  <li>Add all evidence links, then describe what each shows</li>
                </ol>
                <p className="text-xs opacity-75 mt-2">Pro tip: Number your screenshots (1, 2, 3) to match your description</p>
              </div>
            ),
            type: "tip"
          },
          {
            title: "Writing Good Evidence Descriptions",
            content: (
              <div>
                <p className="mb-2"><strong>GOOD:</strong> "Screenshot 1: Bank alert showing ₦75,000 from TechCorp Ltd on Jan 15. Screenshot 2: Signed contract dated Jan 10 for ₦75,000 monthly retainer. Total: ₦75,000"</p>
                <p className="mb-2 text-red-700"><strong>BAD:</strong> "Got paid by client" or "Screenshot shows money"</p>
                <p className="text-xs opacity-75 mt-2">Be specific about amounts, dates, and client names (or use Client A, B, C if confidential)</p>
              </div>
            ),
            type: "success"
          },
          {
            title: "What If I Generated ₦0?",
            content: "It's okay to report ₦0 revenue if you genuinely generated no revenue this week. Enter 0 in the revenue field, provide evidence of your execution (emails sent, calls made, meetings held), and explain what you learned in the narrative. Honesty is required - the system is designed to help you improve, not punish honest reporting.",
            type: "info"
          },
          {
            title: "Report Review Process",
            content: "After submission, your report goes 'Under Review'. Program managers verify evidence within 48 hours. If approved, revenue is added to your total. If rejected, you'll be notified with specific reasons and given 24 hours to resubmit with correct evidence.",
            type: "info"
          }
        ]}
        storageKey="report_help_panel"
      />
    </div>
  );
}