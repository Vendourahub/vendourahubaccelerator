import React, { useState } from "react";
import { AdminModal } from "./AdminModal";
import { Shield } from "lucide-react";
import type { AdminUser } from "../lib/adminAuth";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (admin: Omit<AdminUser, "id">) => void;
  onAddAdmin?: (admin: Omit<AdminUser, "id">) => void;
}

export function AddAdminModal({ isOpen, onClose, onAdd, onAddAdmin }: AddAdminModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "observer" as "super_admin" | "mentor" | "observer",
    password: "",
    cohortAccess: [] as string[]
  });

  const [selectedCohort, setSelectedCohort] = useState("all");

  const handleSubmit = () => {
    const cohortAccess = selectedCohort === "all" ? ["all"] : [selectedCohort];
    
    const permissions = {
      viewFounders: true,
      editFounders: formData.role !== "observer",
      sendNotifications: formData.role !== "observer",
      overrideLocks: formData.role !== "observer",
      removeFounders: formData.role !== "observer",
      exportData: true,
      manageAdmins: formData.role === "super_admin"
    };

    const callback = onAdd || onAddAdmin;
    if (callback) {
      callback({
        ...formData,
        cohortAccess,
        permissions
      });
    }

    // Reset form
    setFormData({
      email: "",
      name: "",
      role: "observer",
      password: "",
      cohortAccess: []
    });
    setSelectedCohort("all");
    onClose();
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Add New Admin User">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@vendoura.com"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Temporary Password</label>
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Must change on first login"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <p className="text-xs text-neutral-600 mt-1">User will be required to change password on first login</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Role & Permissions</label>
          <div className="space-y-2">
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="role" 
                value="super_admin"
                checked={formData.role === "super_admin"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-bold">Super Admin</span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">Full system access. Can manage admins, override all locks, remove founders.</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="role" 
                value="mentor"
                checked={formData.role === "mentor"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">Mentor</span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">Can view/edit founders, send notifications, override locks, remove founders.</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="role" 
                value="observer"
                checked={formData.role === "observer"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">Observer</span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">Read-only access. Can view data and export reports but cannot make changes.</div>
              </div>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cohort Access</label>
          <select 
            value={selectedCohort}
            onChange={(e) => setSelectedCohort(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="all">All Cohorts (Recommended for Super Admin)</option>
            <option value="cohort3">Cohort 3 - Feb 2026</option>
            <option value="cohort2">Cohort 2 - Jan 2026</option>
            <option value="cohort1">Cohort 1 - Dec 2025</option>
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Security Note</p>
              <p>The user will receive an email with login instructions and will be required to change their password on first login. All admin actions are logged for security audit.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            disabled={!formData.email || !formData.name || !formData.password}
          >
            Add Admin User
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

interface EditAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: AdminUser | null;
  onUpdate?: (updates: Partial<AdminUser>) => void;
  onUpdateAdmin?: (updates: Partial<AdminUser>) => void;
}

export function EditAdminModal({ isOpen, onClose, admin, onUpdate, onUpdateAdmin }: EditAdminModalProps) {
  if (!admin) return null;
  
  const [formData, setFormData] = useState({
    name: admin.name,
    role: admin.role,
    cohortAccess: admin.cohortAccess
  });

  const handleUpdate = () => {
    const permissions = {
      viewFounders: true,
      editFounders: formData.role !== "observer",
      sendNotifications: formData.role !== "observer",
      overrideLocks: formData.role !== "observer",
      removeFounders: formData.role !== "observer",
      exportData: true,
      manageAdmins: formData.role === "super_admin"
    };

    const callback = onUpdate || onUpdateAdmin;
    if (callback) {
      callback({
        ...formData,
        permissions
      });
    }
    onClose();
  };

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={`Edit Admin: ${admin.email}`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input 
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-3">Role & Permissions</label>
          <div className="space-y-2">
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="role" 
                value="super_admin"
                checked={formData.role === "super_admin"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium">
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-bold">Super Admin</span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">Full system access</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="role" 
                value="mentor"
                checked={formData.role === "mentor"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">Mentor</span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">Can manage founders</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="role" 
                value="observer"
                checked={formData.role === "observer"}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-bold">Observer</span>
                </div>
                <div className="text-sm text-neutral-600 mt-1">Read-only access</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdate}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Update Admin
          </button>
        </div>
      </div>
    </AdminModal>
  );
}

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnable: (method: "app" | "sms") => void;
}

export function TwoFactorModal({ isOpen, onClose, onEnable }: TwoFactorModalProps) {
  const [method, setMethod] = useState<"app" | "sms">("app");

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Configure Two-Factor Authentication">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-3">Authentication Method</label>
          <div className="space-y-2">
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="method" 
                value="app"
                checked={method === "app"}
                onChange={(e) => setMethod(e.target.value as "app")}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium">Authenticator App (Recommended)</div>
                <div className="text-sm text-neutral-600 mt-1">Use Google Authenticator, Authy, or similar apps</div>
              </div>
            </label>
            <label className="flex items-start gap-3 p-4 border-2 border-neutral-300 rounded-lg cursor-pointer hover:border-neutral-900 transition-colors">
              <input 
                type="radio" 
                name="method" 
                value="sms"
                checked={method === "sms"}
                onChange={(e) => setMethod(e.target.value as "sms")}
                className="mt-1 w-4 h-4"
              />
              <div>
                <div className="font-medium">SMS Text Message</div>
                <div className="text-sm text-neutral-600 mt-1">Receive codes via SMS (less secure)</div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-900">
            ⚠️ Once enabled, all admin users will be required to set up 2FA on their next login. This significantly increases account security.
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onEnable(method);
              onClose();
            }}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Enable 2FA
          </button>
        </div>
      </div>
    </AdminModal>
  );
}