import React, { useState } from 'react';
import { Code, Database, Key, Server, Terminal, Copy, Eye, EyeOff, Check, Settings, RefreshCw, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router';
import { getCurrentAdminSync } from '../../lib/authManager';
import * as storage from '../../lib/localStorage';

export default function DevVault() {
  const [showKeys, setShowKeys] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [showLocalStorage, setShowLocalStorage] = useState(false);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Get localStorage debug info
  const currentAdmin = getCurrentAdminSync();
  const currentAdminSession = storage.getCurrentAdmin();
  const allAdmins = storage.getAllAdmins();
  const allFounders = storage.getAllFounders();
  
  const localStorageData = {
    current_admin_session: currentAdminSession,
    current_admin_profile: currentAdmin,
    total_admins: allAdmins.length,
    total_founders: allFounders.length,
    admins_list: allAdmins.map(a => ({ id: a.id, email: a.email, role: a.admin_role })),
  };

  const credentials = {
    supabase: {
      projectId: 'idhyjerrdrcaitfmbtjd',
      url: 'https://idhyjerrdrcaitfmbtjd.supabase.co',
      anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE',
      serviceRoleKey: 'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE'
    },
    payment: {
      paystackPublicKey: 'pk_test_xxx',
      paystackSecretKey: 'sk_test_xxx',
      flutterwavePublicKey: 'FLWPUBK_TEST-xxx',
      flutterwaveSecretKey: 'FLWSECK_TEST-xxx'
    },
    email: {
      resendApiKey: 'YOUR_RESEND_API_KEY_HERE',
      fromEmail: 'noreply@vendoura.com'
    }
  };

  const databaseTables = [
    { name: 'system_settings', description: 'Global cohort configuration' },
    { name: 'founder_profiles', description: 'Founder account data' },
    { name: 'waitlist', description: 'Waitlist entries' },
    { name: 'admin_users', description: 'Admin team members' },
    { name: 'weekly_commits', description: 'Weekly work submissions' },
    { name: 'weekly_reports', description: 'Revenue reports' },
    { name: 'notification_templates', description: 'Email templates' }
  ];

  const apiEndpoints = [
    { method: 'GET', path: '/api/founders', description: 'Get all founders' },
    { method: 'GET', path: '/api/founders/:id', description: 'Get founder by ID' },
    { method: 'POST', path: '/api/founders', description: 'Create founder' },
    { method: 'PUT', path: '/api/founders/:id', description: 'Update founder' },
    { method: 'GET', path: '/api/analytics', description: 'Get cohort analytics' },
    { method: 'POST', path: '/api/interventions', description: 'Send intervention' },
    { method: 'GET', path: '/api/waitlist', description: 'Get waitlist entries' },
    { method: 'POST', path: '/api/waitlist/notify', description: 'Notify waitlist' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-lg">
              <Terminal className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Dev Vault</h1>
              <p className="text-sm sm:text-base text-neutral-300 mt-1">
                Development credentials and technical documentation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3">
            <Key className="w-4 h-4 flex-shrink-0" />
            <span>⚠️ Sensitive information - Admin access only</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={Database} label="Database Tables" value="7" />
          <StatCard icon={Key} label="API Keys" value="6" />
          <StatCard icon={Server} label="API Endpoints" value="8" />
          <StatCard icon={Code} label="Integration Status" value="Active" />
        </div>

        {/* Toggle Keys Visibility */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <button
            onClick={() => setShowKeys(!showKeys)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showKeys ? 'Hide' : 'Show'} Sensitive Keys
          </button>
        </div>

        {/* Supabase Credentials */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 bg-green-50 border-b border-green-200">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-green-700" />
              <h2 className="text-xl font-bold text-green-900">Supabase</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <CredentialItem
              label="Project ID"
              value={credentials.supabase.projectId}
              showValue={true}
              onCopy={() => copyToClipboard(credentials.supabase.projectId, 'project-id')}
              copied={copiedItem === 'project-id'}
            />
            <CredentialItem
              label="Project URL"
              value={credentials.supabase.url}
              showValue={true}
              onCopy={() => copyToClipboard(credentials.supabase.url, 'url')}
              copied={copiedItem === 'url'}
            />
            <CredentialItem
              label="Anon Key"
              value={credentials.supabase.anonKey}
              showValue={showKeys}
              onCopy={() => copyToClipboard(credentials.supabase.anonKey, 'anon-key')}
              copied={copiedItem === 'anon-key'}
            />
            <CredentialItem
              label="Service Role Key"
              value={credentials.supabase.serviceRoleKey}
              showValue={showKeys}
              onCopy={() => copyToClipboard(credentials.supabase.serviceRoleKey, 'service-key')}
              copied={copiedItem === 'service-key'}
              sensitive
            />
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 bg-purple-50 border-b border-purple-200">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-purple-700" />
              <h2 className="text-xl font-bold text-purple-900">Payment Gateways</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-bold mb-3">Paystack (Primary)</h3>
              <div className="space-y-3">
                <CredentialItem
                  label="Public Key"
                  value={credentials.payment.paystackPublicKey}
                  showValue={showKeys}
                  onCopy={() => copyToClipboard(credentials.payment.paystackPublicKey, 'paystack-pub')}
                  copied={copiedItem === 'paystack-pub'}
                />
                <CredentialItem
                  label="Secret Key"
                  value={credentials.payment.paystackSecretKey}
                  showValue={showKeys}
                  onCopy={() => copyToClipboard(credentials.payment.paystackSecretKey, 'paystack-sec')}
                  copied={copiedItem === 'paystack-sec'}
                  sensitive
                />
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-3">Flutterwave (Fallback)</h3>
              <div className="space-y-3">
                <CredentialItem
                  label="Public Key"
                  value={credentials.payment.flutterwavePublicKey}
                  showValue={showKeys}
                  onCopy={() => copyToClipboard(credentials.payment.flutterwavePublicKey, 'flutter-pub')}
                  copied={copiedItem === 'flutter-pub'}
                />
                <CredentialItem
                  label="Secret Key"
                  value={credentials.payment.flutterwaveSecretKey}
                  showValue={showKeys}
                  onCopy={() => copyToClipboard(credentials.payment.flutterwaveSecretKey, 'flutter-sec')}
                  copied={copiedItem === 'flutter-sec'}
                  sensitive
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Service */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-blue-700" />
              <h2 className="text-xl font-bold text-blue-900">Email Service (Resend)</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <CredentialItem
              label="API Key"
              value={credentials.email.resendApiKey}
              showValue={showKeys}
              onCopy={() => copyToClipboard(credentials.email.resendApiKey, 'resend-key')}
              copied={copiedItem === 'resend-key'}
              sensitive
            />
            <CredentialItem
              label="From Email"
              value={credentials.email.fromEmail}
              showValue={true}
              onCopy={() => copyToClipboard(credentials.email.fromEmail, 'from-email')}
              copied={copiedItem === 'from-email'}
            />
          </div>
        </div>

        {/* Database Schema */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-bold">Database Tables</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Table Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-neutral-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {databaseTables.map(table => (
                  <tr key={table.name} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-6 py-3">
                      <code className="bg-neutral-100 px-2 py-1 rounded text-sm font-mono">
                        {table.name}
                      </code>
                    </td>
                    <td className="px-6 py-3 text-sm text-neutral-600">{table.description}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-bold">API Endpoints</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-neutral-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {apiEndpoints.map((endpoint, index) => (
                  <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                        endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <code className="text-sm font-mono text-neutral-700">
                        {endpoint.path}
                      </code>
                    </td>
                    <td className="px-6 py-3 text-sm text-neutral-600">{endpoint.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/databasesetup"
              className="flex items-center justify-between p-4 border-2 border-green-500 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-green-700" />
                <span className="font-medium text-green-900">Database Setup Tool</span>
              </div>
              <span className="text-green-700">→</span>
            </Link>
            <a
              href={`https://supabase.com/dashboard/project/${credentials.supabase.projectId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
            >
              <span className="font-medium">Supabase Dashboard</span>
              <span className="text-neutral-400">→</span>
            </a>
            <a
              href={`https://supabase.com/dashboard/project/${credentials.supabase.projectId}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
            >
              <span className="font-medium">SQL Editor</span>
              <span className="text-neutral-400">→</span>
            </a>
            <a
              href="https://dashboard.paystack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
            >
              <span className="font-medium">Paystack Dashboard</span>
              <span className="text-neutral-400">→</span>
            </a>
            <a
              href="https://dashboard.flutterwave.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
            >
              <span className="font-medium">Flutterwave Dashboard</span>
              <span className="text-neutral-400">→</span>
            </a>
          </div>
        </div>

        {/* Local Storage Debug */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-xl font-bold mb-4">Local Storage Debug</h2>
          <div className="flex items-center gap-2 text-sm bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>⚠️ Sensitive information - Admin access only</span>
          </div>
          <div className="mt-4">
            <button
              onClick={() => setShowLocalStorage(!showLocalStorage)}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              {showLocalStorage ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showLocalStorage ? 'Hide' : 'Show'} Local Storage Data
            </button>
          </div>
          {showLocalStorage && (
            <div className="mt-4">
              <pre className="bg-neutral-100 p-4 rounded-lg text-sm font-mono">
                {JSON.stringify(localStorageData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="p-3 bg-neutral-100 rounded-lg">
          <Icon className="w-5 h-5 text-neutral-600" />
        </div>
      </div>
      <div className="text-xs sm:text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-xl sm:text-2xl font-bold text-neutral-900">{value}</div>
    </div>
  );
}

function CredentialItem({ label, value, showValue, onCopy, copied, sensitive = false }: {
  label: string;
  value: string;
  showValue: boolean;
  onCopy: () => void;
  copied: boolean;
  sensitive?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg ${sensitive ? 'bg-red-50 border border-red-200' : 'bg-neutral-50 border border-neutral-200'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium mb-2 ${sensitive ? 'text-red-900' : 'text-neutral-700'}`}>
            {label} {sensitive && <span className="text-red-600">⚠️</span>}
          </div>
          <code className={`block text-sm font-mono p-2 rounded overflow-x-auto ${
            sensitive ? 'bg-red-100 text-red-800' : 'bg-white text-neutral-700'
          }`}>
            {showValue ? value : '••••••••••••••••'}
          </code>
        </div>
        <button
          onClick={onCopy}
          className="flex-shrink-0 p-2 hover:bg-neutral-200 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-neutral-600" />
          )}
        </button>
      </div>
    </div>
  );
}