import { Link } from "react-router";
import { useState, useEffect } from "react";
import React from "react";
import { AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { signUpFounder } from "../lib/authManager";
import { submitApplication, joinWaitlist, supabase, resendFounderVerificationRateLimited } from "../lib/api";
import logoImage from '../assets/ffa6cb3f0d02afe82155542d62a0d3bbbbcaa910.png';

export default function Application() {
  const [programActive, setProgramActive] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessDescription: "",
    revenue30d: "",
    revenue90d: "",
    commitment1: false, // 15 hours/week
    commitment2: false, // Weekly reports Friday 6pm
    commitment3: false, // Comfortable with mentor visibility
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState("");

  // Check if cohort program is active
  useEffect(() => {
    const checkProgramStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'applications_open')
          .single();

        if (error) {
          console.error('Error fetching settings:', error);
          setProgramActive(true); // Default to active if error
        } else {
          setProgramActive(data?.value === true || data?.value === 'true');
        }
      } catch (err) {
        console.error('Error:', err);
        setProgramActive(true); // Default to active if error
      } finally {
        setLoading(false);
      }
    };

    checkProgramStatus();
  }, []);
  
  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await joinWaitlist(formData.email, formData.name, 'application_page');
      setSubmitted(true);
      setAccepted(true);
    } catch (err: any) {
      console.error('Waitlist error:', err);
      setError(err.message || 'Failed to join waitlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Auto-reject if any commitment question is false
    const allCommitmentsAccepted = formData.commitment1 && formData.commitment2 && formData.commitment3;
    
    if (!allCommitmentsAccepted) {
      setAccepted(false);
      setSubmitted(true);
      setIsLoading(false);
      return;
    }

    try {
      // Create account using Supabase auth
      const result = await signUpFounder(
        formData.email,
        formData.password,
        {
          name: formData.name,
          user_type: 'founder',
          business_description: formData.businessDescription,
          revenue_30d: parseFloat(formData.revenue30d) || 0,
          revenue_90d: parseFloat(formData.revenue90d) || 0,
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create account');
      }
      
      // Submit application
      await submitApplication({
        email: formData.email,
        name: formData.name,
        business_name: formData.businessDescription,
        business_description: formData.businessDescription,
        business_stage: 'active',
        revenue: formData.revenue30d,
        status: 'approved', // Auto-approve if all commitments accepted
      });
      
      // Success - show acceptance screen
      setAccepted(true);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Provide helpful error messages
      if (err.message.includes('already registered') || err.message.includes('already exists')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.message.includes('Invalid email')) {
        setError('Please enter a valid email address.');
      } else if (err.message.includes('Password')) {
        setError('Password must be at least 6 characters long.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      setError('OAuth authentication coming soon. Please use email/password signup for now.');
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err.message || 'Google sign up failed');
      setIsLoading(false);
    }
  };

  const handleLinkedInSignup = async () => {
    try {
      setIsLoading(true);
      setError('OAuth authentication coming soon. Please use email/password signup for now.');
    } catch (err: any) {
      console.error('LinkedIn signup error:', err);
      setError(err.message || 'LinkedIn sign up failed');
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setVerificationMessage("");
    setIsResendingVerification(true);

    try {
      const result = await resendFounderVerificationRateLimited(formData.email);
      if (!result.success) {
        setVerificationMessage(result.error || 'Could not resend verification email. Please try again.');
        // Start cooldown timer if rate limited
        if (result.retryAfter) {
          setResendCooldown(result.retryAfter);
          const interval = setInterval(() => {
            setResendCooldown(prev => {
              if (prev <= 1) {
                clearInterval(interval);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        setVerificationMessage('Verification email sent. Check your inbox and spam folder.');
        // Set cooldown after successful send
        setResendCooldown(60);
        const interval = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } finally {
      setIsResendingVerification(false);
    }
  };
  
  if (submitted && accepted === true) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-neutral-200 p-12">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-4">Application Accepted</h1>
          <p className="text-center text-neutral-600 mb-8">
            Welcome to Vendoura! Your account has been created. Sign in to complete your onboarding and access your dashboard.
          </p>
          
          <div className="p-6 bg-neutral-50 rounded-lg mb-8">
            <div className="text-sm font-medium mb-3">Your Application:</div>
            <div className="space-y-2 text-sm text-neutral-700">
              <div><strong>Name:</strong> {formData.name}</div>
              <div><strong>Email:</strong> {formData.email}</div>
              <div>
                <span className="text-neutral-600">30-day Revenue:</span>
                <span className="ml-2 font-bold">₦{formData.revenue30d}</span>
              </div>
              <div>
                <span className="text-neutral-600">90-day Revenue:</span>
                <span className="ml-2 font-bold">₦{formData.revenue90d}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg mb-8">
            <div className="text-sm font-medium text-blue-900 mb-3">✅ Next Steps:</div>
            <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
              <li><strong>Check your email</strong> - Confirm your account before first login (check spam folder)</li>
              <li><strong>Sign in</strong> with your email and password below</li>
              <li><strong>Complete onboarding</strong> - Set up your business profile</li>
              <li><strong>Access dashboard</strong> - Submit your first weekly commit</li>
            </ol>

            <div className="mt-4">
              <button
                onClick={handleResendVerification}
                disabled={isResendingVerification || resendCooldown > 0}
                className="text-sm px-4 py-2 bg-white border border-blue-300 text-blue-800 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {isResendingVerification ? 'Resending...' : resendCooldown > 0 ? `Retry in ${resendCooldown}s` : 'Resend verification email'}
              </button>
              {verificationMessage && (
                <p className="text-xs text-blue-900 mt-2">{verificationMessage}</p>
              )}
            </div>
          </div>

          {/* Social Sign In Options */}
          <div className="space-y-3 mb-4">
            <button
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Sign in with Google</span>
            </button>

            <button
              onClick={handleLinkedInSignup}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="font-medium">Sign in with LinkedIn</span>
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">Or use email</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Link 
              to="/login" 
              className="block text-center px-6 py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-bold text-lg"
            >
              Sign In with Email
            </Link>
            <p className="text-center text-sm text-neutral-600">
              Use the email <strong>{formData.email}</strong> to sign in
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  if (submitted && accepted === false) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-red-200 p-12">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-4">Application Rejected</h1>
          <p className="text-center text-neutral-600 mb-8">
            You did not accept all commitment requirements. Vendoura requires full commitment to weekly deadlines and accountability.
          </p>
          
          <div className="p-6 bg-red-50 rounded-lg border border-red-200 mb-8">
            <div className="text-sm font-medium mb-3 text-red-900">Commitment Requirements:</div>
            <div className="space-y-2 text-sm">
              <div className={formData.commitment1 ? "text-green-700" : "text-red-700"}>
                {formData.commitment1 ? "✓" : "✗"} 15+ hours/week on revenue-generating activities
              </div>
              <div className={formData.commitment2 ? "text-green-700" : "text-red-700"}>
                {formData.commitment2 ? "✓" : "✗"} Weekly revenue reports every Friday at 6pm
              </div>
              <div className={formData.commitment3 ? "text-green-700" : "text-red-700"}>
                {formData.commitment3 ? "✓" : "✗"} Comfortable with mentor seeing when you miss deadlines
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-neutral-600">
            <p className="mb-4">If your circumstances change, you may reapply in 90 days.</p>
            <Link to="/" className="text-neutral-900 hover:underline">
              Return to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show waitlist form if program is inactive
  if (programActive === false && !submitted) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-block">
              ← Back to homepage
            </Link>
            <h1 className="text-4xl font-bold mb-3">Join the Waitlist</h1>
            <p className="text-neutral-600">
              The current cohort is full. Join the waitlist to be notified when the next cohort opens.
            </p>
          </div>

          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Cohort Status:</strong> Applications are currently closed. We'll email you with a signup link when the next cohort opens.
            </div>
          </div>

          <form onSubmit={handleWaitlistSubmit} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 space-y-6">
            <div>
              <label className="block font-medium mb-2">Full Name *</label>
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Sarah Chen"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">Email Address *</label>
              <input 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="sarah@company.com"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">Business Name (Optional)</label>
              <input 
                type="text"
                value={formData.businessDescription}
                onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="Your Business Name"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium text-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Waitlist'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show waitlist success
  if (programActive === false && submitted && accepted === true) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-neutral-200 p-12">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-4">You're on the Waitlist!</h1>
          <p className="text-center text-neutral-600 mb-8">
            We'll email you at <strong>{formData.email}</strong> when the next cohort opens with a link to complete your full application.
          </p>
          
          <div className="p-6 bg-blue-50 rounded-lg mb-8">
            <div className="text-sm font-medium mb-3 text-blue-900">What Happens Next?</div>
            <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
              <li>You'll receive a confirmation email (check spam folder)</li>
              <li>When the next cohort opens, you'll get a signup link</li>
              <li>Complete the full application within 48 hours</li>
              <li>Start your revenue acceleration journey!</li>
            </ol>
          </div>
          
          <div className="text-center">
            <Link 
              to="/" 
              className="inline-block px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-block">
            ← Back to homepage
          </Link>
          <h1 className="text-4xl font-bold mb-3">Vendoura Application</h1>
          <p className="text-neutral-600">
            This application screens for commitment and captures your revenue baseline.
          </p>
        </div>
        
        {/* Alert */}
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <strong>Important:</strong> All commitment questions must be answered "YES" for acceptance. Any "NO" results in automatic rejection.
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="Sarah Chen"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Email Address *</label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="sarah@company.com"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Password *</label>
                <input 
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block font-medium mb-2">Business Description *</label>
                <textarea 
                  required
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent min-h-24"
                  placeholder="B2B SaaS for marketing teams. 50 customers, $15K MRR."
                />
                <div className="text-xs text-neutral-500 mt-2">
                  Include: business model, customer count, what you sell
                </div>
              </div>
            </div>
          </section>
          
          {/* Revenue Baseline */}
          <section className="pt-8 border-t border-neutral-200">
            <h2 className="text-xl font-bold mb-6">Revenue Baseline</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2">Revenue (Last 30 Days) *</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-neutral-400">₦</span>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={formData.revenue30d}
                    onChange={(e) => setFormData({...formData, revenue30d: e.target.value})}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-lg"
                    placeholder="1500000"
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-2">
                  Total revenue generated in the last 30 days
                </div>
              </div>
              
              <div>
                <label className="block font-medium mb-2">Revenue (Last 90 Days) *</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-neutral-400">₦</span>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={formData.revenue90d}
                    onChange={(e) => setFormData({...formData, revenue90d: e.target.value})}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-lg"
                    placeholder="4200000"
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-2">
                  Total revenue generated in the last 90 days
                </div>
              </div>
            </div>
          </section>
          
          {/* Commitment Screening */}
          <section className="pt-8 border-t border-neutral-200">
            <h2 className="text-xl font-bold mb-3">Commitment Requirements</h2>
            <p className="text-sm text-neutral-600 mb-6">
              All three must be "YES" for acceptance. Any "NO" = automatic rejection.
            </p>
            
            <div className="space-y-4">
              <CommitmentCheckbox 
                checked={formData.commitment1}
                onChange={(checked) => setFormData({...formData, commitment1: checked})}
                label="Can you commit 15+ hours per week to revenue-generating activities?"
              />
              
              <CommitmentCheckbox 
                checked={formData.commitment2}
                onChange={(checked) => setFormData({...formData, commitment2: checked})}
                label="Will you submit weekly revenue reports every Friday at 6pm with evidence?"
              />
              
              <CommitmentCheckbox 
                checked={formData.commitment3}
                onChange={(checked) => setFormData({...formData, commitment3: checked})}
                label="Are you comfortable with your mentor seeing when you miss deadlines?"
              />
            </div>
          </section>
          
          {/* Submit */}
          <div className="pt-8 border-t border-neutral-200">
            <button 
              type="submit"
              className="w-full py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium text-lg"
            >
              Submit Application
            </button>
            <div className="text-xs text-center text-neutral-500 mt-4">
              By submitting, you confirm all information is accurate
            </div>
            {error && <div className="text-sm text-center text-red-500 mt-2">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}

function CommitmentCheckbox({ 
  checked, 
  onChange, 
  label 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  label: string;
}) {
  return (
    <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
      checked 
        ? 'border-green-500 bg-green-50' 
        : 'border-neutral-300 bg-white hover:border-neutral-400'
    }`}>
      <input 
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-5 h-5 rounded border-neutral-300"
      />
      <span className="flex-1 font-medium">{label}</span>
      {checked && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
    </label>
  );
}