import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function CreateSuperAdmin() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [response, setResponse] = useState<any>(null);

  const createSuperAdmin = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    setResponse(null);

    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-eddbcb21/auth/admin/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: 'emmanuel@vendoura.com',
          password: 'Alome!28$..',
          name: 'Alome Emmanuel',
          role: 'super_admin'
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setResponse(data);
      } else {
        setError(data.error || 'Failed to create admin account');
        setResponse(data);
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      console.error('Error creating super admin:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-xl border border-neutral-200 p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-6">Create Super Admin Account</h1>

        <div className="bg-neutral-50 rounded-lg p-4 mb-6 space-y-2">
          <div className="text-sm">
            <span className="font-medium">Email:</span> emmanuel@vendoura.com
          </div>
          <div className="text-sm">
            <span className="font-medium">Password:</span> Alome!28$..
          </div>
          <div className="text-sm">
            <span className="font-medium">Name:</span> Alome Emmanuel
          </div>
          <div className="text-sm">
            <span className="font-medium">Role:</span> super_admin
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-red-900 mb-1">Error</div>
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-green-900 mb-1">Success!</div>
              <div className="text-sm text-green-700">Super admin account created successfully</div>
            </div>
          </div>
        )}

        {response && (
          <div className="bg-neutral-50 rounded-lg p-4 mb-6">
            <div className="text-sm font-medium mb-2">API Response:</div>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        <button
          onClick={createSuperAdmin}
          disabled={loading || success}
          className="w-full py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Account Created
            </>
          ) : (
            'Create Super Admin Account'
          )}
        </button>

        {success && (
          <div className="mt-6 text-center">
            <a
              href="/admin/login"
              className="text-neutral-600 hover:text-neutral-900 underline text-sm"
            >
              Go to Admin Login →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
