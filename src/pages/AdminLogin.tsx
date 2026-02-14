import { Link, useNavigate } from "react-router";
import { useState } from "react";
import React from "react";
import { AlertCircle, Shield, Loader2, Lock } from "lucide-react";
import { signInAdmin } from "../lib/authManager";
import logoImage from '../assets/ffa6cb3f0d02afe82155542d62a0d3bbbbcaa910.png';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signInAdmin(email, password);
      
      if (result.success && result.admin) {
        // Redirect based on admin role
        let redirectPath = '/admin/cohort'; // default
        
        switch (result.admin.admin_role) {
          case 'super_admin':
            redirectPath = '/admin/superadmindashboard';
            break;
          case 'program_manager':
            redirectPath = '/admin/programmanagerdashboard';
            break;
          case 'mentor':
            redirectPath = '/admin/mentor';
            break;
          case 'observer':
            redirectPath = '/admin/observerdashboard';
            break;
          default:
            redirectPath = '/admin/cohort';
        }
        
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.error || "Invalid credentials");
      }
    } catch (err: any) {
      console.error('Admin login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
          <p className="text-neutral-600">
            Vendoura Platform Administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">{error}</div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="admin@vendoura.com"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-xs text-neutral-600 bg-neutral-50 border border-neutral-200 rounded p-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  All admin actions are logged and monitored. Unauthorized access attempts will be tracked.
                </p>
              </div>
              
              <div className="flex items-start gap-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded p-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium mb-1">LocalStorage Mode - Test Accounts:</p>
                  <div className="space-y-0.5 text-xs">
                    <div>• Super Admin: <code className="bg-blue-100 px-1 rounded">admin@vendoura.com</code> / <code className="bg-blue-100 px-1 rounded">admin123</code></div>
                    <div>• Program Manager: <code className="bg-blue-100 px-1 rounded">manager@vendoura.com</code> / <code className="bg-blue-100 px-1 rounded">manager123</code></div>
                    <div>• Mentor: <code className="bg-blue-100 px-1 rounded">mentor@vendoura.com</code> / <code className="bg-blue-100 px-1 rounded">mentor123</code></div>
                    <div>• Observer: <code className="bg-blue-100 px-1 rounded">observer@vendoura.com</code> / <code className="bg-blue-100 px-1 rounded">observer123</code></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Founders:</strong> This login is for admins only. Please use the <Link to="/login" className="underline font-medium">founder login page</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            ← Back to Vendoura
          </Link>
        </div>
      </div>
    </div>
  );
}