import { useState } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/api';

export default function DatabaseCheck() {
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const tables = [
    'system_settings',
    'founder_profiles',
    'waitlist',
    'admin_users',
    'weekly_commits',
    'weekly_reports',
    'notification_templates',
    'interventions',
    'intervention_actions',
    'evidence_submissions'
  ];

  const checkDatabase = async () => {
    setChecking(true);
    const checkResults = [];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        checkResults.push({
          table,
          exists: !error,
          error: error ? {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          } : null,
          rowCount: data?.length || 0
        });
      } catch (err: any) {
        checkResults.push({
          table,
          exists: false,
          error: {
            message: err.message || 'Unknown error',
            stack: err.stack
          },
          rowCount: 0
        });
      }
    }

    setResults(checkResults);
    setChecking(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl border-2 border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8">
            <Database className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-center mb-2">Database Diagnostics</h1>
            <p className="text-center text-blue-100">Check which tables exist in your Supabase database</p>
          </div>

          {/* Action Button */}
          <div className="p-6 border-b border-neutral-200 bg-neutral-50">
            <button
              onClick={checkDatabase}
              disabled={checking}
              className="w-full px-6 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {checking ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Checking Database...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Run Database Check
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4">Results</h2>
              
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {results.filter(r => r.exists).length}
                  </div>
                  <div className="text-sm text-green-800 font-medium">Tables Found</div>
                </div>
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-700">
                    {results.filter(r => !r.exists).length}
                  </div>
                  <div className="text-sm text-red-800 font-medium">Tables Missing</div>
                </div>
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-700">
                    {tables.length}
                  </div>
                  <div className="text-sm text-blue-800 font-medium">Total Expected</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${
                      result.exists
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {result.exists ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-lg font-mono">{result.table}</div>
                          {result.exists ? (
                            <div className="text-sm text-green-800">
                              ✅ Table exists
                            </div>
                          ) : (
                            <div className="text-sm text-red-800 font-medium">
                              ❌ Table NOT found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {result.error && (
                      <div className="mt-3 bg-white border border-red-200 rounded p-3">
                        <div className="text-xs font-mono text-red-900">
                          <div className="mb-1"><strong>Error Code:</strong> {result.error.code || 'N/A'}</div>
                          <div className="mb-1"><strong>Message:</strong> {result.error.message}</div>
                          {result.error.details && (
                            <div className="mb-1"><strong>Details:</strong> {result.error.details}</div>
                          )}
                          {result.error.hint && (
                            <div><strong>Hint:</strong> {result.error.hint}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Needed */}
              {results.some(r => !r.exists) && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-amber-900 text-lg mb-2">⚠️ Action Required</h3>
                      <p className="text-amber-800 mb-4">
                        Some tables are missing. You need to run the SQL setup script.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-4 border border-amber-300">
                          <div className="font-bold mb-2">Step 1: Open Supabase SQL Editor</div>
                          <a
                            href="https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                          >
                            Open SQL Editor →
                          </a>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-amber-300">
                          <div className="font-bold mb-2">Step 2: Run QUICK_FIX.sql</div>
                          <div className="text-sm text-amber-900">
                            Copy the entire contents of <code className="bg-amber-100 px-2 py-1 rounded">/QUICK_FIX.sql</code> and paste into the SQL Editor, then click RUN.
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-amber-300">
                          <div className="font-bold mb-2">Step 3: Run NOTIFICATION_TEMPLATES.sql (Optional)</div>
                          <div className="text-sm text-amber-900">
                            Copy the entire contents of <code className="bg-amber-100 px-2 py-1 rounded">/NOTIFICATION_TEMPLATES.sql</code> and paste into the SQL Editor, then click RUN.
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-amber-300">
                          <div className="font-bold mb-2">Step 4: Re-run This Check</div>
                          <div className="text-sm text-amber-900">
                            Click "Run Database Check" again to verify all tables were created.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {results.every(r => r.exists) && (
                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 mt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-green-900 text-lg mb-2">🎉 All Tables Found!</h3>
                      <p className="text-green-800 mb-4">
                        Your database is properly configured. All required tables exist.
                      </p>
                      <a
                        href="/admin/super-admin-control"
                        className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Go to Super Admin Control →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {results.length === 0 && !checking && (
            <div className="p-12 text-center">
              <Database className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <p className="text-neutral-600 mb-2">Click the button above to check your database</p>
              <p className="text-sm text-neutral-500">
                This will verify if all required tables exist in your Supabase database
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-blue-900 mb-3">ℹ️ About This Tool</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>This diagnostic tool checks if all required Supabase tables exist:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><code>system_settings</code> - Platform configuration</li>
              <li><code>founder_profiles</code> - Founder accounts</li>
              <li><code>waitlist</code> - Waitlist entries</li>
              <li><code>admin_users</code> - Admin accounts</li>
              <li><code>weekly_commits</code> - Weekly work commitments</li>
              <li><code>weekly_reports</code> - Revenue reports</li>
              <li><code>notification_templates</code> - Email templates</li>
              <li><code>interventions</code> - Founder interventions</li>
              <li><code>intervention_actions</code> - Intervention history</li>
              <li><code>evidence_submissions</code> - Evidence tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
