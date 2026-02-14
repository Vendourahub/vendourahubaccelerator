import { Link } from "react-router";

export default function ValidationRules() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/handoff" className="text-sm text-neutral-600 hover:text-black mb-6 inline-block">← Back to Handoff Index</Link>
        
        <div className="mb-12">
          <h1 className="text-3xl mb-3">VALIDATION RULES</h1>
          <p className="text-neutral-600">Field validation, error messages, client/server split</p>
        </div>
        
        {/* Commit Validation */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Weekly Commit Validation</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Field</th>
                  <th className="text-left py-2 font-semibold">Rule</th>
                  <th className="text-left py-2 font-semibold">Client</th>
                  <th className="text-left py-2 font-semibold">Server</th>
                  <th className="text-left py-2 font-semibold">Error Message</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">action_description</td>
                  <td className="py-3">Min length: 20 chars</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Action is too short. Describe specifically what you will do."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">action_description</td>
                  <td className="py-3">No vague words</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Vague commitment detected: '[word]'. Be specific about what you will do."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">target_revenue</td>
                  <td className="py-3">Required, &gt; 0</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Enter a specific revenue target (must be &gt; $0)."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">target_revenue</td>
                  <td className="py-3">Type: decimal</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Revenue must be a valid number."</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">completion_date</td>
                  <td className="py-3">Required, before Friday 6pm</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Completion date must be before Friday 6pm (report deadline)."</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-6 p-4 bg-neutral-50 rounded-sm">
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Vague Words List (Block These)</div>
              <div className="text-xs font-mono">
                ['work on', 'try to', 'maybe', 'explore', 'think about', 'consider', 'attempt', 'start']
              </div>
            </div>
          </div>
        </div>
        
        {/* Report Validation */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Weekly Report Validation</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Field</th>
                  <th className="text-left py-2 font-semibold">Rule</th>
                  <th className="text-left py-2 font-semibold">Client</th>
                  <th className="text-left py-2 font-semibold">Server</th>
                  <th className="text-left py-2 font-semibold">Error Message</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">revenue_generated</td>
                  <td className="py-3">Required, &gt;= 0</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Enter revenue generated (use $0 if none, but explain why in narrative)."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">hours_spent</td>
                  <td className="py-3">Required, &gt; 0</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Enter hours spent (must be &gt; 0)."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">narrative</td>
                  <td className="py-3">Min length: 50 chars</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Narrative is too short. Explain what happened (minimum 50 characters)."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">evidence_urls</td>
                  <td className="py-3">Required, min 1 file</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓✓✓</td>
                  <td className="py-3">"Evidence is required. Upload at least one file showing your work."</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono text-xs">commit_id</td>
                  <td className="py-3">Must exist for week</td>
                  <td className="py-3"></td>
                  <td className="py-3">✓✓✓</td>
                  <td className="py-3">"Cannot submit report without commit. Submit your weekly commit first."</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-sm">
              <div className="text-sm font-semibold mb-2">⚠️ CRITICAL: Evidence Validation</div>
              <div className="text-xs text-neutral-700 space-y-2">
                <div>Server MUST verify evidence_urls array contains at least 1 valid URL</div>
                <div>Server MUST verify all URLs are accessible (200 response)</div>
                <div>Server MUST verify URLs point to files in authorized storage (S3 bucket)</div>
                <div>Reject report immediately if evidence validation fails</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Application Validation */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Application Validation</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Field</th>
                  <th className="text-left py-2 font-semibold">Rule</th>
                  <th className="text-left py-2 font-semibold">Client</th>
                  <th className="text-left py-2 font-semibold">Server</th>
                  <th className="text-left py-2 font-semibold">Error Message</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">email</td>
                  <td className="py-3">Valid email format</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Enter a valid email address."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">name</td>
                  <td className="py-3">Min length: 2 chars</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Enter your full name."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">baseline_revenue_30d</td>
                  <td className="py-3">Required, &gt;= 0</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">"Enter your revenue for the last 30 days (can be $0)."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3 font-mono text-xs">commitment_questions</td>
                  <td className="py-3">All must be YES</td>
                  <td className="py-3">✓</td>
                  <td className="py-3">✓✓✓</td>
                  <td className="py-3">"Application rejected: Cannot commit to program requirements. Reapply in 90 days."</td>
                </tr>
              </tbody>
            </table>
            
            <div className="mt-6 p-4 bg-neutral-50 rounded-sm">
              <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">Commitment Questions (Auto-Reject if Any "NO")</div>
              <ul className="text-xs space-y-1">
                <li>• Can you commit 15 hours/week to revenue-generating activities?</li>
                <li>• Will you submit weekly revenue reports every Friday at 6pm?</li>
                <li>• Are you comfortable with your mentor seeing when you miss deadlines?</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* File Upload Validation */}
        <div className="mb-8 bg-white border border-neutral-200 rounded-sm overflow-hidden">
          <div className="bg-neutral-900 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">File Upload Validation (Evidence)</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 font-semibold">Validation</th>
                  <th className="text-left py-2 font-semibold">Rule</th>
                  <th className="text-left py-2 font-semibold">Where</th>
                  <th className="text-left py-2 font-semibold">Error Message</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100">
                  <td className="py-3">File type</td>
                  <td className="py-3">png, jpg, jpeg, pdf, doc, docx</td>
                  <td className="py-3">Client + Server</td>
                  <td className="py-3">"File type not allowed. Upload images or documents only."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3">File size</td>
                  <td className="py-3">Max 10MB per file</td>
                  <td className="py-3">Client + Server</td>
                  <td className="py-3">"File too large. Maximum size: 10MB."</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-3">Total files</td>
                  <td className="py-3">Max 10 files per report</td>
                  <td className="py-3">Client + Server</td>
                  <td className="py-3">"Too many files. Maximum: 10 files per report."</td>
                </tr>
                <tr>
                  <td className="py-3">Virus scan</td>
                  <td className="py-3">Must pass virus check</td>
                  <td className="py-3">Server</td>
                  <td className="py-3">"File failed security scan. Cannot upload."</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Validation Pattern Summary */}
        <div className="p-8 bg-neutral-100 border border-neutral-300 rounded-sm">
          <div className="font-semibold mb-4">VALIDATION PATTERN:</div>
          <div className="space-y-4 text-sm text-neutral-700">
            <div>
              <strong>Client-side (✓):</strong> Immediate feedback, better UX, but can be bypassed
            </div>
            <div>
              <strong>Server-side (✓):</strong> Required for all validations, source of truth
            </div>
            <div>
              <strong>Server-side CRITICAL (✓✓✓):</strong> Business logic enforcement, cannot be client-only
            </div>
            <div className="pt-4 border-t border-neutral-300">
              <strong>Error Response Format:</strong>
              <pre className="mt-2 p-3 bg-white rounded text-xs font-mono">
{`{
  "error": "validation_failed",
  "message": "Human-readable error",
  "field": "field_name",
  "details": "Additional context"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}