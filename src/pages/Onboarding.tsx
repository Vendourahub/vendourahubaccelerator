import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import React from "react";
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { getCurrentUser, completeFounderOnboarding } from "../lib/authManager";
import { formatCurrency, CURRENCY_SYMBOL } from "../lib/currency";

export default function Onboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    businessModel: "b2b_saas" as const,
    productDescription: "",
    customerCount: "",
    pricing: "",
    revenueBaseline30d: 0,
    revenueBaseline90d: 0
  });
  
  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        navigate("/login");
        return;
      }
      
      setUser(currentUser);
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);
  
  // Show loading state while checking auth
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }
  
  const handleComplete = async () => {
    setSubmitting(true);
    
    try {
      // Convert customerCount and pricing from string to number
      const onboardingData = {
        business_name: formData.businessName,
        business_model: formData.businessModel,
        product_description: formData.productDescription,
        customer_count: parseInt(formData.customerCount) || 0,
        pricing: formData.pricing,
        revenue_baseline_30d: formData.revenueBaseline30d,
        revenue_baseline_90d: formData.revenueBaseline90d,
        current_week: 1,
        current_stage: 'stage_1',
        is_locked: false,
        missed_weeks: 0,
      };

      console.log('🚀 Submitting onboarding data:', onboardingData);
      
      const result = await completeFounderOnboarding(onboardingData);
      
      if (result.success) {
        console.log('✅ Onboarding completed successfully, navigating to dashboard');
        navigate("/founder/dashboard");
      } else {
        console.error("❌ Failed to complete onboarding:", result.error);
        alert(result.error || "Failed to save your information. Please try again.");
        setSubmitting(false);
      }
    } catch (error: any) {
      console.error("❌ Error completing onboarding:", error);
      alert(`An error occurred: ${error.message || 'Please try again.'}`);
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="font-bold text-2xl">Vendoura Accelerator</div>
        </div>
      </header>
      
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Progress */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <StepIndicator number={1} active={step === 1} complete={step > 1} />
            <div className="flex-1 h-0.5 bg-neutral-200">
              <div className={`h-full bg-neutral-900 transition-all ${step > 1 ? 'w-full' : 'w-0'}`} />
            </div>
            <StepIndicator number={2} active={step === 2} complete={step > 2} />
          </div>
          
          <h1 className="text-3xl font-bold mb-3">
            {step === 1 ? "Let's tailor your growth plan" : "Set your revenue baseline"}
          </h1>
          <p className="text-neutral-600">
            {step === 1 
              ? "Share a few details so we can tailor weekly actions and mentor feedback." 
              : "These numbers are your starting line. We will track progress from here."}
          </p>
        </div>
        
        {/* Step 1: Business Context */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 space-y-6">
            <div>
              <label className="block font-medium mb-2">Business name *</label>
              <input 
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="e.g., Vendoura Labs"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">Business model *</label>
              <select 
                value={formData.businessModel}
                onChange={(e) => setFormData({...formData, businessModel: e.target.value as any})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              >
                <option value="b2b_saas">B2B SaaS</option>
                <option value="b2c_saas">B2C SaaS</option>
                <option value="ecommerce">E-commerce</option>
                <option value="services">Services / Consulting</option>
                <option value="marketplace">Marketplace</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block font-medium mb-2">What do you sell, and who is it for? *</label>
              <textarea 
                required
                value={formData.productDescription}
                onChange={(e) => setFormData({...formData, productDescription: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent min-h-24"
                placeholder="e.g., WhatsApp automation for salons that helps manage bookings and reminders."
              />
              <div className="text-xs text-neutral-500 mt-2">
                The clearer this is, the better we can tailor your weekly actions.
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-2">Active customers today *</label>
              <input 
                type="number"
                required
                min="0"
                value={formData.customerCount}
                onChange={(e) => setFormData({...formData, customerCount: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                placeholder="e.g., 25"
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">Typical pricing *</label>
              <div className="flex items-center gap-3">
                <span className="text-2xl text-neutral-400">₦</span>
                <input 
                  type="number"
                  required
                  min="0"
                  value={formData.pricing}
                  onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                  placeholder="e.g., 10000"
                />
                <span className="text-neutral-600">per hour</span>
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                A typical price point we should use when planning weekly actions.
              </div>
            </div>
            
            <button 
              onClick={() => setStep(2)}
              disabled={!formData.businessName || !formData.productDescription || !formData.customerCount || !formData.pricing}
              className="w-full py-4 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              Next: set your baseline
            </button>
          </div>
        )}
        
        {/* Step 2: Revenue Baseline */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <strong>Why we ask:</strong> This is how we measure progress. 
                  The goal is 2x growth by Week 8 and 4x by Week 12.
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 space-y-6">
              <div>
                <label className="block font-medium mb-2">Revenue (Last 30 Days) *</label>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-neutral-400">{CURRENCY_SYMBOL}</span>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={formData.revenueBaseline30d || ""}
                    onChange={(e) => setFormData({...formData, revenueBaseline30d: parseFloat(e.target.value) || 0})}
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
                  <span className="text-2xl text-neutral-400">{CURRENCY_SYMBOL}</span>
                  <input 
                    type="number"
                    required
                    min="0"
                    value={formData.revenueBaseline90d || ""}
                    onChange={(e) => setFormData({...formData, revenueBaseline90d: parseFloat(e.target.value) || 0})}
                    className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent text-lg"
                    placeholder="4200000"
                  />
                </div>
                <div className="text-xs text-neutral-500 mt-2">
                  Total revenue generated in the last 90 days
                </div>
              </div>
              
              {formData.revenueBaseline30d > 0 && (
                <div className="p-6 bg-neutral-50 rounded-lg">
                  <div className="text-sm font-medium mb-3">Your Growth Targets:</div>
                  <div className="space-y-2 text-sm text-neutral-700">
                    <div className="flex justify-between">
                      <span>Week 8 Target (2x):</span>
                      <span className="font-bold">{formatCurrency(formData.revenueBaseline30d * 2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Week 12 Target (4x):</span>
                      <span className="font-bold">{formatCurrency(formData.revenueBaseline30d * 4)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 pt-6">
                <button 
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button 
                  onClick={handleComplete}
                  disabled={!formData.revenueBaseline30d || !formData.revenueBaseline90d || submitting}
                  className="flex-1 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {submitting ? "Saving..." : "Complete Setup & Go to Dashboard"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepIndicator({ number, active, complete }: { number: number; active: boolean; complete: boolean }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
      complete 
        ? 'bg-green-600 text-white' 
        : active 
          ? 'bg-neutral-900 text-white' 
          : 'bg-neutral-200 text-neutral-500'
    }`}>
      {complete ? <CheckCircle className="w-5 h-5" /> : number}
    </div>
  );
}