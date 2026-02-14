import { Link } from "react-router";

export default function DataModels() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/handoff" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Handoff Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">DATA MODELS</h1>
          <p className="text-neutral-600">Database schema for all entities</p>
        </div>
        
        {/* User Model */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">User (Founder)</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Field</th>
                  <th className="text-left py-2 font-semibold">Type</th>
                  <th className="text-left py-2 font-semibold">Required</th>
                  <th className="text-left py-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Primary key</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">email</td>
                  <td className="py-3">String</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Unique, lowercase, validated</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">name</td>
                  <td className="py-3">String</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Full name</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">cohort_id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Foreign key → Cohort</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">baseline_revenue_30d</td>
                  <td className="py-3">Decimal</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">From application</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">baseline_revenue_90d</td>
                  <td className="py-3">Decimal</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">From application</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">current_stage</td>
                  <td className="py-3">Integer</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">1-5, default: 1</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">account_status</td>
                  <td className="py-3">Enum</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">active | under_review | removed</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">consecutive_misses</td>
                  <td className="py-3">Integer</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Counter, resets on valid submission</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">created_at</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Auto-set on insert</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">updated_at</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Auto-update on change</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-neutral-50 rounded-sm text-xs">
              <strong>Indexes:</strong> email (unique), cohort_id, account_status
            </div>
          </div>
        </div>
        
        {/* WeeklyCommit Model */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">WeeklyCommit</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Field</th>
                  <th className="text-left py-2 font-semibold">Type</th>
                  <th className="text-left py-2 font-semibold">Required</th>
                  <th className="text-left py-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Primary key</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">user_id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Foreign key → User</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">week_number</td>
                  <td className="py-3">Integer</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">1-12, unique per user per week</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">action_description</td>
                  <td className="py-3">Text</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Min 20 chars, no vague words</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">target_revenue</td>
                  <td className="py-3">Decimal</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Must be &gt; 0</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">completion_date</td>
                  <td className="py-3">Date</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Must be before Friday 6pm</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">submitted_at</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Auto-set on insert</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">deadline</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Monday 9am of week</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">is_late</td>
                  <td className="py-3">Boolean</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">submitted_at &gt; deadline</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-neutral-50 rounded-sm text-xs">
              <strong>Indexes:</strong> user_id + week_number (unique composite), submitted_at<br/>
              <strong>Constraints:</strong> One commit per user per week
            </div>
          </div>
        </div>
        
        {/* WeeklyReport Model */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">WeeklyReport</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Field</th>
                  <th className="text-left py-2 font-semibold">Type</th>
                  <th className="text-left py-2 font-semibold">Required</th>
                  <th className="text-left py-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Primary key</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">user_id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Foreign key → User</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">week_number</td>
                  <td className="py-3">Integer</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">1-12, must match commit</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">commit_id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Foreign key → WeeklyCommit</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">revenue_generated</td>
                  <td className="py-3">Decimal</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Can be 0, but requires explanation</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">hours_spent</td>
                  <td className="py-3">Decimal</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Must be &gt; 0</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">narrative</td>
                  <td className="py-3">Text</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Min 50 chars</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">evidence_urls</td>
                  <td className="py-3">Array[String]</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Min 1 file, S3/storage URLs</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">submitted_at</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Auto-set on insert</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">deadline</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Friday 6pm of week</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">is_late</td>
                  <td className="py-3">Boolean</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">submitted_at &gt; deadline</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">status</td>
                  <td className="py-3">Enum</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">submitted | rejected | accepted</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">dollar_per_hour</td>
                  <td className="py-3">Decimal</td>
                  <td className="py-3">No</td>
                  <td className="py-3">Calculated: revenue / hours</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">win_rate</td>
                  <td className="py-3">Decimal</td>
                  <td className="py-3">No</td>
                  <td className="py-3">Calculated: (revenue / target) * 100</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-neutral-50 rounded-sm text-xs">
              <strong>Indexes:</strong> user_id + week_number (unique), status, submitted_at<br/>
              <strong>Validation:</strong> Cannot submit without matching commit_id
            </div>
          </div>
        </div>
        
        {/* Stage Model */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">StageProgress</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Field</th>
                  <th className="text-left py-2 font-semibold">Type</th>
                  <th className="text-left py-2 font-semibold">Required</th>
                  <th className="text-left py-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Primary key</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">user_id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Foreign key → User</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">stage_number</td>
                  <td className="py-3">Integer</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">1-5</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">status</td>
                  <td className="py-3">Enum</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">locked | in_progress | complete</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">unlocked_at</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">No</td>
                  <td className="py-3">When stage became available</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">completed_at</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">No</td>
                  <td className="py-3">When requirements met</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-neutral-50 rounded-sm text-xs">
              <strong>Logic:</strong> Stage N+1 unlocks automatically when Stage N completed_at is set
            </div>
          </div>
        </div>
        
        {/* MentorNotification Model */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">MentorNotification</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Field</th>
                  <th className="text-left py-2 font-semibold">Type</th>
                  <th className="text-left py-2 font-semibold">Required</th>
                  <th className="text-left py-2 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Primary key</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">user_id</td>
                  <td className="py-3">UUID</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Foreign key → User</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">notification_type</td>
                  <td className="py-3">Enum</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">missed_commit | missed_report | late_submission | no_evidence | removal_review</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">week_number</td>
                  <td className="py-3">Integer</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Which week triggered notification</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">created_at</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">Yes</td>
                  <td className="py-3">Auto-set on insert</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">read_at</td>
                  <td className="py-3">Timestamp</td>
                  <td className="py-3">No</td>
                  <td className="py-3">When mentor viewed notification</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-4 bg-neutral-50 rounded-sm text-xs">
              <strong>Automatic Creation:</strong> Notifications created automatically by system on lock events
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-neutral-100 border border-neutral-300 rounded-sm">
          <div className="font-semibold mb-4">ADDITIONAL MODELS NEEDED:</div>
          <div className="space-y-2 text-sm text-neutral-700">
            <div>• <strong>Cohort:</strong> id, name, start_date, end_date, mentor_id</div>
            <div>• <strong>RevenueSystemDocument:</strong> id, user_id, sections (JSON), completion_percentage, submitted_at</div>
            <div>• <strong>AuditLog:</strong> id, user_id, action_type, metadata (JSON), created_at</div>
            <div>• <strong>Intervention:</strong> id, user_id, reason, scheduled_at, outcome</div>
          </div>
        </div>
      </div>
    </div>
  );
}