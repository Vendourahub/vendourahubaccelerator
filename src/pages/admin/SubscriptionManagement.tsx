import { useState, useEffect } from 'react';
import { DollarSign, CreditCard, AlertCircle, Clock, CheckCircle, XCircle, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../lib/currency';
import { formatWATDate } from '../../lib/time';
import { adminService } from '../../lib/adminServiceWrapper';
import type { FounderProfile } from '../../lib/adminServiceWrapper';

export default function SubscriptionManagement() {
  const [loading, setLoading] = useState(true);
  const [founders, setFounders] = useState<FounderProfile[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const foundersData = await adminService.getAllFounders();
      setFounders(foundersData);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionStatus = (expiry: string | null): 'active' | 'expiring' | 'expired' => {
    if (!expiry) return 'expired';
    const expiryDate = new Date(expiry);
    const now = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'expiring';
    return 'active';
  };

  const filteredFounders = founders.filter(f => {
    if (filter === 'all') return true;
    return getSubscriptionStatus(f.subscription_expiry) === filter;
  });

  const stats = {
    total: founders.length,
    active: founders.filter(f => getSubscriptionStatus(f.subscription_expiry) === 'active').length,
    expiring: founders.filter(f => getSubscriptionStatus(f.subscription_expiry) === 'expiring').length,
    expired: founders.filter(f => getSubscriptionStatus(f.subscription_expiry) === 'expired').length,
    totalRevenue: founders.length * 150000 // ₦150,000 per founder
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neutral-900 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Subscription Management</h1>
            <p className="text-sm sm:text-base text-neutral-600 mt-1">
              Monitor all founder subscriptions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={CreditCard}
            label="Total Subscriptions"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            label="Active"
            value={stats.active}
            color="green"
          />
          <StatCard
            icon={AlertCircle}
            label="Expiring Soon"
            value={stats.expiring}
            color="amber"
          />
          <StatCard
            icon={Clock}
            label="Expired"
            value={stats.expired}
            color="red"
          />
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-700" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-green-800 mb-1">Total Subscription Revenue</div>
              <div className="text-3xl font-bold text-green-900 mb-1">{formatCurrency(stats.totalRevenue)}</div>
              <div className="text-sm text-green-700">From {stats.total} active founders @ ₦150,000 each</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Founders', count: stats.total },
              { id: 'active', label: 'Active', count: stats.active },
              { id: 'expiring', label: 'Expiring Soon', count: stats.expiring },
              { id: 'expired', label: 'Expired', count: stats.expired }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === item.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {item.label} ({item.count})
              </button>
            ))}
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Founder</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Business</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-neutral-700">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-neutral-700">Expiry</th>
                  <th className="px-4 sm:px-6 py-3 text-right text-xs font-bold text-neutral-700">Amount</th>
                  <th className="px-4 sm:px-6 py-3 text-center text-xs font-bold text-neutral-700">Payment</th>
                </tr>
              </thead>
              <tbody>
                {filteredFounders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                      No subscriptions found
                    </td>
                  </tr>
                ) : (
                  filteredFounders.map(founder => {
                    const status = getSubscriptionStatus(founder.subscription_expiry);
                    return (
                      <tr key={founder.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                        <td className="px-4 sm:px-6 py-4">
                          <div className="font-medium text-sm">{founder.name}</div>
                          <div className="text-xs text-neutral-600">{founder.email}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">{founder.business_name}</td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-sm">
                          {founder.subscription_expiry 
                            ? formatWATDate(new Date(founder.subscription_expiry))
                            : 'Not set'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-right font-bold text-sm">
                          ₦150,000
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            founder.subscription_status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {founder.subscription_status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Needed */}
        {stats.expiring > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 mb-1">Action Required</div>
                <div className="text-sm text-amber-800">
                  {stats.expiring} subscription{stats.expiring > 1 ? 's' : ''} expiring within 7 days. 
                  Contact founders to renew their subscriptions.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: any;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'amber' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-xs sm:text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold text-neutral-900">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: 'active' | 'expiring' | 'expired' }) {
  const config = {
    active: { label: 'Active', bg: 'bg-green-100', text: 'text-green-700' },
    expiring: { label: 'Expiring', bg: 'bg-amber-100', text: 'text-amber-700' },
    expired: { label: 'Expired', bg: 'bg-red-100', text: 'text-red-700' }
  };

  const { label, bg, text } = config[status];

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
      {label}
    </span>
  );
}