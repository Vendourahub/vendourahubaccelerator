import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, CreditCard, Calendar, AlertTriangle, Check, X, Clock, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../lib/currency";
import { adminStore } from "../../lib/adminStore";
import { formatWATDateTime } from "../../lib/time";

export default function FounderSubscriptionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const founder = adminStore.getFounder(id || "");

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!founder) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Founder Not Found</h1>
          <Link to="/admin/subscriptions" className="text-blue-600 hover:underline">
            ← Back to Subscriptions
          </Link>
        </div>
      </div>
    );
  }

  const paymentHistory = [
    {
      id: "p1",
      date: "2026-01-15 14:32 WAT",
      amount: 150000,
      status: "success",
      method: "Paystack - Card",
      reference: "PAY_xyz123abc"
    },
    {
      id: "p2",
      date: "2026-02-01 09:15 WAT",
      amount: 150000,
      status: "success",
      method: "Paystack - Card",
      reference: "PAY_abc456def"
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link 
            to="/admin/subscriptions"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Subscriptions
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">{founder.name}</h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-1">Subscription Management</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowExtendModal(true)}
            className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm"
          >
            Extend Subscription
          </button>
          <button
            onClick={() => setShowChangeModal(true)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm"
          >
            Change Plan
          </button>
        </div>
      </div>

      {/* Subscription Status Card */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg sm:text-xl font-bold">Current Subscription</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <InfoCard
              icon={<CreditCard className="w-5 h-5" />}
              label="Status"
              value={<SubscriptionBadge status={founder.subscriptionStatus} />}
            />
            <InfoCard
              icon={<Calendar className="w-5 h-5" />}
              label="Plan Type"
              value="Monthly Subscription"
            />
            <InfoCard
              icon={<Clock className="w-5 h-5" />}
              label="Next Billing"
              value={founder.subscriptionExpiry || "—"}
            />
            <InfoCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Total Paid"
              value={formatCurrency(300000)}
            />
          </div>
        </div>
      </div>

      {/* Founder Details */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg sm:text-xl font-bold">Founder Information</h2>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <DetailRow label="Email" value={founder.email} />
            <DetailRow label="Business Name" value={founder.businessName} />
            <DetailRow label="Current Stage" value={`Stage ${founder.stage}`} />
            <DetailRow label="Current Week" value={`Week ${founder.week} of 12`} />
            <DetailRow label="Account Status" value={founder.isLocked ? "Locked" : "Active"} />
            <DetailRow label="Joined Date" value="Jan 15, 2026" />
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg sm:text-xl font-bold">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Amount</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Method</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold">Reference</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-neutral-100">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">{payment.date}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">{payment.method}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono text-neutral-600">
                    {payment.reference}
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                    <PaymentStatusBadge status={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscription Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg sm:text-xl font-bold">Subscription Actions</h2>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          <ActionButton
            label="Grant Trial Extension"
            description="Add 7 more days to trial period"
            action="Extend Trial"
            onClick={() => setShowExtendModal(true)}
          />
          <ActionButton
            label="Manual Payment Entry"
            description="Record offline payment or bank transfer"
            action="Record Payment"
            onClick={() => {
              const amount = prompt("Enter payment amount in Naira:");
              if (amount) {
                alert(`Payment of ₦${parseInt(amount).toLocaleString()} recorded successfully! Subscription status updated.`);
                window.location.reload();
              }
            }}
          />
          <ActionButton
            label="Refund Payment"
            description="Process refund for last payment"
            action="Process Refund"
            variant="danger"
            onClick={() => {
              if (confirm(`Are you sure you want to refund ${founder.name}'s last payment? This will cancel their subscription.`)) {
                alert("Refund processed successfully! Founder will receive email confirmation.");
                window.location.reload();
              }
            }}
          />
          <ActionButton
            label="Cancel Subscription"
            description="Immediately cancel and lock founder account"
            action="Cancel Now"
            variant="danger"
            onClick={() => setShowCancelModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showChangeModal && (
        <ChangePlanModal
          founder={founder}
          onClose={() => setShowChangeModal(false)}
        />
      )}
      {showExtendModal && (
        <ExtendSubscriptionModal
          founder={founder}
          onClose={() => setShowExtendModal(false)}
        />
      )}
      {showCancelModal && (
        <CancelSubscriptionModal
          founder={founder}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-neutral-100 rounded-lg flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-xs sm:text-sm text-neutral-600 mb-1">{label}</div>
        <div className="text-sm sm:text-base font-medium">{value}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs sm:text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-sm sm:text-base font-medium">{value}</div>
    </div>
  );
}

function ActionButton({ label, description, action, variant = "default", onClick }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-neutral-200 rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm sm:text-base mb-1">{label}</div>
        <div className="text-xs sm:text-sm text-neutral-600">{description}</div>
      </div>
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
          variant === "danger"
            ? "bg-red-600 text-white hover:bg-red-700"
            : "border border-neutral-300 hover:border-neutral-900"
        }`}
      >
        {action}
      </button>
    </div>
  );
}

function SubscriptionBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    paid: { label: "Paid", className: "bg-green-100 text-green-700" },
    trial: { label: "Trial", className: "bg-amber-100 text-amber-700" },
    expired: { label: "Expired", className: "bg-red-100 text-red-700" },
    cancelled: { label: "Cancelled", className: "bg-neutral-100 text-neutral-700" }
  };

  const { label, className } = config[status] || config.expired;

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${className}`}>
      {label}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; icon: any; className: string }> = {
    success: { label: "Success", icon: <Check className="w-3 h-3" />, className: "bg-green-100 text-green-700" },
    pending: { label: "Pending", icon: <Clock className="w-3 h-3" />, className: "bg-amber-100 text-amber-700" },
    failed: { label: "Failed", icon: <X className="w-3 h-3" />, className: "bg-red-100 text-red-700" }
  };

  const { label, icon, className } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${className}`}>
      {icon}
      {label}
    </span>
  );
}

function ChangePlanModal({ founder, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Change Subscription Plan</h3>
        <p className="text-sm text-neutral-600 mb-6">
          Select a new plan for {founder.name}
        </p>
        <div className="space-y-3 mb-6">
          <PlanOption plan="trial" price={0} />
          <PlanOption plan="monthly" price={150000} selected />
          <PlanOption plan="cohort" price={750000} />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Plan changed successfully");
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ExtendSubscriptionModal({ founder, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Extend Subscription</h3>
        <p className="text-sm text-neutral-600 mb-6">
          Add additional time to {founder.name}'s subscription
        </p>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Extension Period</label>
            <select className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900">
              <option>7 days</option>
              <option>14 days</option>
              <option>30 days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <textarea
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
              rows={3}
              placeholder="Enter reason for extension..."
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              alert("Subscription extended successfully");
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Extend Now
          </button>
        </div>
      </div>
    </div>
  );
}

function CancelSubscriptionModal({ founder, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900">Cancel Subscription</h3>
            <p className="text-sm text-red-700 mt-1">This action cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-neutral-600 mb-6">
          Are you sure you want to cancel {founder.name}'s subscription? Their account will be
          immediately locked and they will lose access to the platform.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Keep Active
          </button>
          <button
            onClick={() => {
              alert("Subscription cancelled");
              onClose();
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanOption({ plan, price, selected = false }: any) {
  const planNames: Record<string, string> = {
    trial: "14-Day Trial",
    monthly: "Monthly Subscription",
    cohort: "Full Cohort Payment"
  };

  return (
    <div
      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
        selected ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{planNames[plan]}</div>
          <div className="text-sm text-neutral-600">
            {price === 0 ? "Free" : formatCurrency(price)}
          </div>
        </div>
        {selected && <Check className="w-5 h-5 text-neutral-900" />}
      </div>
    </div>
  );
}