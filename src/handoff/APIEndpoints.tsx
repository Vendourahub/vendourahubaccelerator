import { Link } from "react-router";

export default function APIEndpoints() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/handoff" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Handoff Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">API ENDPOINTS</h1>
          <p className="text-neutral-600">REST API specification with request/response examples</p>
        </div>
        
        {/* Dashboard Endpoint */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">GET /api/v1/dashboard</h2>
            <span className="text-xs bg-green-600 px-3 py-1 rounded-sm">Auth Required</span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Description</div>
              <div className="text-sm text-neutral-700">
                Returns all data needed for founder dashboard view
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Response (200 OK)</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "user": {
    "id": "uuid",
    "name": "Sarah Chen",
    "email": "sarah@example.com"
  },
  "cohort": {
    "id": "uuid",
    "name": "COHORT_2026_03",
    "current_week": 3,
    "total_weeks": 12
  },
  "stage": {
    "current": 1,
    "name": "REVENUE BASELINE",
    "progress": "1/2 reports complete"
  },
  "revenue": {
    "baseline": 2400.00,
    "current": 3100.00,
    "delta": 1.29
  },
  "next_action": {
    "type": "report",
    "name": "Submit Weekly Report",
    "deadline": "2026-02-14T18:00:00Z",
    "hours_remaining": 28
  },
  "weekly_loop": {
    "week_number": 3,
    "steps": [
      {
        "number": 1,
        "name": "Commit",
        "status": "complete",
        "detail": "Reach out to 10 past clients"
      },
      {
        "number": 2,
        "name": "Execute",
        "status": "in_progress",
        "detail": "In progress (Monday-Friday)"
      },
      // ... more steps
    ]
  },
  "locks": [],
  "flags": []
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Response With Lock (200 OK)</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  // ... same as above
  "locks": [
    {
      "type": "week_locked",
      "reason": "No commit submitted by Monday 9am",
      "blocking": ["report", "execute"],
      "unlock_action": "submit_commit"
    }
  ],
  "flags": [
    {
      "type": "mentor_notified",
      "reason": "Late commit submission",
      "notified_at": "2026-02-10T14:34:00Z"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Submit Commit Endpoint */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">POST /api/v1/commits</h2>
            <span className="text-xs bg-green-600 px-3 py-1 rounded-sm">Auth Required</span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Description</div>
              <div className="text-sm text-neutral-700">
                Submit weekly revenue commitment
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Request Body</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "week_number": 3,
  "action_description": "Call 20 leads from last month's webinar...",
  "target_revenue": 5000.00,
  "completion_date": "2026-02-14"
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Response (201 Created)</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "id": "uuid",
  "week_number": 3,
  "action_description": "Call 20 leads...",
  "target_revenue": 5000.00,
  "completion_date": "2026-02-14",
  "submitted_at": "2026-02-10T08:45:00Z",
  "deadline": "2026-02-10T09:00:00Z",
  "is_late": false,
  "locks_removed": ["report_submission"]
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Error (400 Bad Request) - Vague Commit</div>
              <pre className="bg-neutral-900 text-red-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "error": "validation_failed",
  "message": "Vague commitment detected: 'work on'",
  "field": "action_description",
  "details": "Be specific about what you will do."
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Error (409 Conflict) - Already Exists</div>
              <pre className="bg-neutral-900 text-red-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "error": "commit_exists",
  "message": "You have already submitted a commit for week 3",
  "existing_commit_id": "uuid"
}`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Submit Report Endpoint */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">POST /api/v1/reports</h2>
            <span className="text-xs bg-green-600 px-3 py-1 rounded-sm">Auth Required</span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Description</div>
              <div className="text-sm text-neutral-700">
                Submit weekly revenue report with evidence
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Request Body</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "week_number": 3,
  "revenue_generated": 3500.00,
  "hours_spent": 12.5,
  "narrative": "I called 20 leads as planned. 5 were interested...",
  "evidence_urls": [
    "https://s3.../evidence1.png",
    "https://s3.../evidence2.pdf"
  ]
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Response (201 Created)</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "id": "uuid",
  "week_number": 3,
  "revenue_generated": 3500.00,
  "hours_spent": 12.5,
  "narrative": "I called 20 leads...",
  "evidence_urls": ["..."],
  "submitted_at": "2026-02-14T17:45:00Z",
  "deadline": "2026-02-14T18:00:00Z",
  "is_late": false,
  "status": "accepted",
  "calculations": {
    "dollar_per_hour": 280.00,
    "win_rate": 70.00
  },
  "stage_progress_updated": true,
  "new_stage": null
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Error (400 Bad Request) - No Evidence</div>
              <pre className="bg-neutral-900 text-red-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "error": "validation_failed",
  "message": "Evidence is required",
  "field": "evidence_urls",
  "details": "Upload at least one file showing your work"
}`}
              </pre>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Error (403 Forbidden) - No Commit</div>
              <pre className="bg-neutral-900 text-red-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "error": "report_locked",
  "message": "Cannot submit report without commit",
  "details": "You did not submit a weekly commit on Monday",
  "unlock_action": "submit_commit"
}`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Get Revenue Map Endpoint */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">GET /api/v1/stages</h2>
            <span className="text-xs bg-green-600 px-3 py-1 rounded-sm">Auth Required</span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Description</div>
              <div className="text-sm text-neutral-700">
                Returns all stages with progress and lock status
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Response (200 OK)</div>
              <pre className="bg-neutral-900 text-green-400 p-4 rounded-sm text-xs overflow-x-auto">
{`{
  "current_stage": 1,
  "current_week": 3,
  "stages": [
    {
      "number": 1,
      "name": "REVENUE BASELINE",
      "weeks": "Weeks 1-2",
      "status": "in_progress",
      "objective": "Establish current revenue capability",
      "requirements": [
        "Log all existing revenue sources",
        "Submit 2 consecutive weekly reports with evidence"
      ],
      "progress": "1/2 reports complete",
      "unlock_condition": "2 valid weekly reports submitted",
      "unlocked_at": "2026-02-03T00:00:00Z",
      "completed_at": null
    },
    {
      "number": 2,
      "name": "REVENUE DIAGNOSIS",
      "weeks": "Weeks 3-4",
      "status": "locked",
      "objective": "Identify highest-leverage revenue action",
      "requirements": ["..."],
      "progress": "Not started",
      "unlock_condition": "Stage 1 complete",
      "lock_reason": "Waiting for Stage 1 completion",
      "unlocked_at": null,
      "completed_at": null
    }
    // ... stages 3, 4, 5
  ]
}`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Additional Endpoints Summary */}
        <div className="p-8 bg-neutral-100 border border-neutral-300 rounded-sm">
          <div className="font-semibold mb-4">ADDITIONAL ENDPOINTS NEEDED:</div>
          <div className="space-y-3 text-sm text-neutral-700">
            <div className="flex justify-between items-center p-3 bg-white rounded-sm">
              <span className="font-mono text-xs">GET /api/v1/commits/:week_number</span>
              <span className="text-xs text-neutral-500">Get commit for specific week</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-sm">
              <span className="font-mono text-xs">POST /api/v1/evidence/upload</span>
              <span className="text-xs text-neutral-500">Upload evidence file (returns URL)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-sm">
              <span className="font-mono text-xs">GET /api/v1/reports/history</span>
              <span className="text-xs text-neutral-500">All past reports with calculations</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-sm">
              <span className="font-mono text-xs">POST /api/v1/rsd</span>
              <span className="text-xs text-neutral-500">Save/submit Revenue System Document</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-sm">
              <span className="font-mono text-xs">GET /api/v1/mentor/notifications</span>
              <span className="text-xs text-neutral-500">Mentor-only: list of flags</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-sm">
              <span className="font-mono text-xs">POST /api/v1/interventions</span>
              <span className="text-xs text-neutral-500">Mentor-only: schedule review call</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
