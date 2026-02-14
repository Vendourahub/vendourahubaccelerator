import { useState } from 'react';
import { supabase } from '../../lib/api';
import { Shield, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

export default function DiagnoseProfile() {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<any>(null);

  const runDiagnosis = async () => {
    setLoading(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      checks: []
    };

    try {
      // Check 1: Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      results.checks.push({
        name: 'Session Check',
        status: session ? 'pass' : 'fail',
        data: session ? {
          userId: session.user.id,
          email: session.user.email,
          userMetadata: session.user.user_metadata,
          hasAccessToken: !!session.access_token
        } : null,
        error: sessionError?.message
      });

      if (!session) {
        setDiagnosis(results);
        setLoading(false);
        return;
      }

      // Check 2: Call /auth/me endpoint
      try {
        const response = await fetch(
          `https://knqbtdugvessaehgwwcg.supabase.co/functions/v1/make-server-eddbcb21/auth/me`,
          {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        
        results.checks.push({
          name: 'Auth Me Endpoint',
          status: response.ok ? 'pass' : 'fail',
          data: {
            status: response.status,
            success: data.success,
            type: data.type,
            user: data.user,
            error: data.error
          }
        });
      } catch (err: any) {
        results.checks.push({
          name: 'Auth Me Endpoint',
          status: 'fail',
          error: err.message
        });
      }

      // Check 3: Try to manually create admin profile if it doesn't exist
      if (results.checks[1]?.status === 'fail' && session.user.user_metadata?.type === 'admin') {
        results.checks.push({
          name: 'Admin Profile Missing',
          status: 'warning',
          data: {
            message: 'Admin profile exists in Auth but not in KV store',
            suggestion: 'Use the "Create Missing Admin Profile" button below to fix this'
          }
        });
      }

    } catch (error: any) {
      results.checks.push({
        name: 'General Error',
        status: 'fail',
        error: error.message
      });
    }

    setDiagnosis(results);
    setLoading(false);
  };

  const createMissingAdminProfile = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('No session found. Please log in first.');
        setLoading(false);
        return;
      }

      const metadata = session.user.user_metadata;
      
      const response = await fetch(
        `https://knqbtdugvessaehgwwcg.supabase.co/functions/v1/make-server-eddbcb21/admin/create-profile`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            email: session.user.email,
            name: metadata.name || 'Admin User',
            role: metadata.role || 'super_admin'
          })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        alert('Admin profile created successfully! Please run diagnosis again.');
        await runDiagnosis();
      } else {
        alert(`Failed to create profile: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-neutral-200 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-neutral-900" />
            <h1 className="text-3xl font-bold">Admin Profile Diagnostics</h1>
          </div>

          <p className="text-neutral-600 mb-6">
            This page will help diagnose why your admin profile isn't loading correctly.
          </p>

          <button
            onClick={runDiagnosis}
            disabled={loading}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running Diagnosis...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Run Diagnosis
              </>
            )}
          </button>
        </div>

        {diagnosis && (
          <div className="space-y-4">
            {diagnosis.checks.map((check: any, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-xl border-2 p-6 ${
                  check.status === 'pass'
                    ? 'border-green-200'
                    : check.status === 'warning'
                    ? 'border-yellow-200'
                    : 'border-red-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  {check.status === 'pass' ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className={`w-6 h-6 flex-shrink-0 ${
                      check.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-2">{check.name}</h3>
                    
                    {check.error && (
                      <div className="bg-red-50 rounded p-3 mb-3">
                        <div className="text-sm font-medium text-red-900 mb-1">Error:</div>
                        <div className="text-sm text-red-700">{check.error}</div>
                      </div>
                    )}

                    {check.data && (
                      <div className="bg-neutral-50 rounded p-3">
                        <div className="text-xs font-medium text-neutral-700 mb-2">Data:</div>
                        <pre className="text-xs overflow-auto text-neutral-600">
                          {JSON.stringify(check.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Show fix button if admin profile is missing */}
            {diagnosis.checks.some((c: any) => c.name === 'Admin Profile Missing') && (
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold text-yellow-900 mb-2">Fix Available</h3>
                    <p className="text-sm text-yellow-700 mb-4">
                      Your admin account exists in Supabase Auth but is missing from the KV store. 
                      Click the button below to create the missing profile.
                    </p>
                    <button
                      onClick={createMissingAdminProfile}
                      disabled={loading}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Missing Admin Profile'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
