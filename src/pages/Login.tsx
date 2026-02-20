import { Link, useNavigate } from "react-router";
import { useState } from "react";
import React from "react";
import { AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from '../lib/auth';
import * as storage from '../lib/localStorage';
import logoImage from '../assets/ffa6cb3f0d02afe82155542d62a0d3bbbbcaa910.png';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setVerificationMessage("");
    setIsLoading(true);
    
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }
    
    try {
      // Sign in (localStorage mode)
      const result = await signIn(email, password);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
        setIsLoading(false);
        return;
      }
      
      // Check user type - only founders can use this login
      if (result.user?.user_type !== 'founder') {
        setError('This login is for founders only. Admins should use /admin/login');
        setIsLoading(false);
        return;
      }
      
      // Get founder profile from localStorage
      const founder = storage.getFounder(result.user!.id);
      
      if (!founder) {
        setError('Founder profile not found');
        setIsLoading(false);
        return;
      }
      
      if (!founder.onboarding_completed) {
        navigate("/onboarding");
      } else {
        navigate("/founder/dashboard");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Sign in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const requiresVerification = false; // Email verification not needed in localStorage mode
  
  // Make error message more friendly
  const displayError = error;

  const handleResendVerification = async () => {
    // Not applicable in localStorage mode
    setVerificationMessage('Email verification not required for this login method.');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img src={logoImage} alt="Vendoura" className="h-12 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-neutral-600">
            Sign in to access your founder dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800 w-full">
                  <div>{displayError}</div>
                  {requiresVerification && (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={isResendingVerification || resendCooldown > 0}
                      className="mt-3 text-xs px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
                    >
                      {isResendingVerification ? 'Resending...' : resendCooldown > 0 ? `Retry in ${resendCooldown}s` : 'Resend verification email'}
                    </button>
                  )}
                  {verificationMessage && (
                    <div className="mt-2 text-xs text-red-700">{verificationMessage}</div>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                placeholder="you@example.com"
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
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 outline-none"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
          
          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>� Founder Login</strong><br />
              This login is for <strong>founders</strong> participating in Vendoura's program.<br />
              <br />
              <strong>Admins:</strong> Please use <Link to="/admin/login" className="underline font-medium">admin login page</Link>
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-sm">
          <span className="text-neutral-600">Don't have an account? </span>
          <Link to="/apply" className="text-neutral-900 font-medium hover:underline">
            Apply now
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}