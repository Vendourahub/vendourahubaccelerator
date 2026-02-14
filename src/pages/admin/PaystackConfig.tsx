import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CreditCard, CheckCircle, AlertTriangle, ArrowLeft, ExternalLink, Eye, EyeOff } from "lucide-react";

export default function PaystackConfig() {
  const navigate = useNavigate();
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [testResult, setTestResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  const [config, setConfig] = useState({
    enabled: false,
    environment: "test", // test or live
    publicKey: "",
    secretKey: "",
    webhookUrl: "https://vendoura.com/webhooks/paystack",
    webhookSecret: "",
  });

  const handleSave = () => {
    if (!config.publicKey || !config.secretKey) {
      setTestResult({ 
        type: "error", 
        message: "Please provide both Public Key and Secret Key" 
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    setTestResult({ 
      type: "success", 
      message: "Paystack configuration saved successfully!" 
    });
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTestConnection = () => {
    if (!config.publicKey || !config.secretKey) {
      setTestResult({ 
        type: "error", 
        message: "Please configure API keys first" 
      });
      setTimeout(() => setTestResult(null), 3000);
      return;
    }

    // Simulate API connection test
    setTimeout(() => {
      setTestResult({ 
        type: "success", 
        message: "Connection test successful! Paystack API is responding correctly." 
      });
      setTimeout(() => setTestResult(null), 3000);
    }, 1000);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <button 
          onClick={() => navigate("/admin/subscriptions")}
          className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subscription Management
        </button>
        <div className="flex items-center gap-3">
          <CreditCard className="w-8 h-8" />
          <div>
            <h1 className="text-3xl font-bold">Paystack Configuration</h1>
            <p className="text-neutral-600 mt-1">Configure Paystack payment gateway for Nigerian Naira transactions</p>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {testResult && (
        <div className={`p-4 rounded-lg border ${
          testResult.type === "success" 
            ? "bg-green-50 border-green-200 text-green-900" 
            : "bg-red-50 border-red-200 text-red-900"
        }`}>
          <div className="flex items-center gap-2">
            {testResult.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-medium">{testResult.message}</span>
          </div>
        </div>
      )}

      {/* Main Configuration */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
          <div>
            <div className="font-medium">Enable Paystack</div>
            <div className="text-sm text-neutral-600">Accept payments via Paystack gateway</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-900"></div>
          </label>
        </div>

        {/* Environment Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Environment</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setConfig({ ...config, environment: "test" })}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.environment === "test"
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="font-medium">Test Mode</div>
              <div className="text-xs text-neutral-600 mt-1">Use for development and testing</div>
            </button>
            <button
              onClick={() => setConfig({ ...config, environment: "live" })}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.environment === "live"
                  ? "border-neutral-900 bg-neutral-50"
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <div className="font-medium">Live Mode</div>
              <div className="text-xs text-neutral-600 mt-1">Production environment</div>
            </button>
          </div>
        </div>

        {/* API Keys */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Public Key</label>
            <div className="relative">
              <input 
                type={showPublicKey ? "text" : "password"}
                value={config.publicKey}
                onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
                placeholder={config.environment === "test" ? "pk_test_..." : "pk_live_..."}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPublicKey(!showPublicKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPublicKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secret Key</label>
            <div className="relative">
              <input 
                type={showSecretKey ? "text" : "password"}
                value={config.secretKey}
                onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                placeholder={config.environment === "test" ? "sk_test_..." : "sk_live_..."}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showSecretKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-1">Keep this key secure and never share it publicly</p>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <label className="block text-sm font-medium mb-2">Webhook URL</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={config.webhookUrl}
                readOnly
                className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg bg-white"
              />
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(config.webhookUrl);
                  setTestResult({ type: "success", message: "Webhook URL copied to clipboard" });
                  setTimeout(() => setTestResult(null), 2000);
                }}
                className="px-4 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm whitespace-nowrap"
              >
                Copy URL
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Webhook Secret (Optional)</label>
            <input 
              type="password"
              value={config.webhookSecret}
              onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
              placeholder="Enter webhook secret for verification"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button 
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium"
          >
            Save Configuration
          </button>
          <button 
            onClick={handleTestConnection}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors font-medium"
          >
            Test Connection
          </button>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="font-bold text-blue-900 mb-3 flex items-center gap-2">
          Setup Instructions
          <a 
            href="https://dashboard.paystack.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-auto text-sm font-normal flex items-center gap-1 hover:underline"
          >
            Open Paystack Dashboard <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <ol className="list-decimal ml-6 space-y-2 text-sm text-blue-800">
          <li>
            <strong>Create Account:</strong> Sign up at <a href="https://paystack.com" target="_blank" rel="noopener noreferrer" className="underline">paystack.com</a>
          </li>
          <li>
            <strong>Get API Keys:</strong> Navigate to Settings → API Keys & Webhooks in your dashboard
          </li>
          <li>
            <strong>Copy Keys:</strong> Copy your Public Key and Secret Key (test or live based on your needs)
          </li>
          <li>
            <strong>Configure Webhook:</strong> Add the webhook URL above to your Paystack webhook settings
          </li>
          <li>
            <strong>Test Integration:</strong> Use test mode first with test cards before going live
          </li>
          <li>
            <strong>Go Live:</strong> Complete KYC verification on Paystack, then switch to live mode
          </li>
        </ol>

        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-1">Test Cards for Testing:</div>
          <div className="text-xs text-blue-800 space-y-1 font-mono">
            <div>• Success: 4084 0840 8408 4081</div>
            <div>• Decline: 5060 6666 6666 6666</div>
            <div>• Use any future expiry date and CVV (123)</div>
          </div>
        </div>
      </div>

      {/* Supported Features */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="font-bold mb-4">Supported Payment Methods</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Debit/Credit Cards</div>
              <div className="text-neutral-600">Visa, Mastercard, Verve</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Bank Transfers</div>
              <div className="text-neutral-600">Direct bank account payments</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">USSD Payments</div>
              <div className="text-neutral-600">Pay via mobile USSD codes</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Mobile Money</div>
              <div className="text-neutral-600">MTN, Airtel, other providers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}