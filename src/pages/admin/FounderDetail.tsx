import { Link, useParams } from "react-router";
import { TrendingUp, AlertTriangle, CheckCircle, XCircle, MessageSquare, Unlock, Clock, ArrowLeft, Edit, Lock, Eye, EyeOff, Key, Save, User, Mail, Phone, Building } from "lucide-react";
import { formatCurrency } from "../../lib/currency";
import { formatWATDate } from "../../lib/time";
import { founderService } from "../../lib/adminService";
import { MessageModal, ScheduleCallModal, RemovalReviewModal } from "../../components/AdminModal";
import { getCurrentAdmin } from "../../lib/adminAuth";
import { useState, useEffect } from "react";
import React from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import * as storage from "../../lib/localStorage";
import { toast } from "sonner@2.0.3";

export default function FounderDetail() {
  const { id } = useParams();
  const admin = getCurrentAdmin();
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [removalModalOpen, setRemovalModalOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [founder, setFounder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Account management state
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business_name: ''
  });
  
  // Password reset state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Load founder data
  useEffect(() => {
    const loadFounder = async () => {
      try {
        setLoading(true);
        const data = await founderService.getFounderById(id || "");
        setFounder(data);
      } catch (error) {
        console.error('Error loading founder:', error);
        setFounder(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadFounder();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neutral-600">Loading founder details...</div>
        </div>
      </div>
    );
  }

  if (!founder) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Founder Not Found</h2>
          <p className="text-neutral-600 mb-6">
            The founder you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/admin/cohort"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cohort Overview
          </Link>
        </div>
      </div>
    );
  }
  
  const mentorNotes = founderService.getMentorNotes(founder.id);
  
  // Mock weekly history since it's not in the founder data yet
  const weeklyHistory: any[] = [
    {
      week: 4,
      commitText: "Reach out to 20 former trial users with personalized demo videos + 20% discount offer",
      commitTarget: 400000,
      commitDate: "2026-02-10 08:45:00",
      commitStatus: "pending",
      reportRevenue: 0,
      reportEvidence: null,
      reportDate: null,
      reportStatus: "pending",
      adjustNotes: null,
      adjustDollarPerHour: null,
      adjustStatus: "pending"
    },
    {
      week: 3,
      commitText: "Launch referral program via email to 50 active customers - ₦5,000 credit per referral",
      commitTarget: 300000,
      commitDate: "2026-02-03 08:30:00",
      commitStatus: "complete",
      reportRevenue: 275000,
      reportEvidence: "invoice-screenshots-week3.pdf",
      reportDate: "2026-02-07 17:45:00",
      reportStatus: "complete",
      adjustNotes: "Referral program worked better than expected. 3 new customers signed up. Need to automate follow-up emails.",
      adjustDollarPerHour: 18333,
      adjustStatus: "complete"
    }
  ];

  // Calculate revenue chart data using actual founder data
  const baseRevenue = founder.baseline_revenue_30d || 0;
  const revenueData = [
    { 
      week: 'Baseline', 
      weekNum: 0,
      revenue: baseRevenue,
      target: baseRevenue,
      displayRevenue: formatCurrency(baseRevenue, false)
    },
    { 
      week: 'Week 1', 
      weekNum: 1,
      revenue: baseRevenue + 50000,
      target: baseRevenue + 100000,
      displayRevenue: formatCurrency(baseRevenue + 50000, false)
    },
    { 
      week: 'Week 2', 
      weekNum: 2,
      revenue: baseRevenue + 180000,
      target: baseRevenue + 200000,
      displayRevenue: formatCurrency(baseRevenue + 180000, false)
    },
    { 
      week: 'Week 3', 
      weekNum: 3,
      revenue: baseRevenue + 455000,
      target: baseRevenue + 300000,
      displayRevenue: formatCurrency(baseRevenue + 455000, false)
    },
    { 
      week: 'Week 4', 
      weekNum: 4,
      revenue: baseRevenue + 500000,
      target: baseRevenue + 400000,
      displayRevenue: formatCurrency(baseRevenue + 500000, false)
    }
  ];

  const handleSaveNote = () => {
    if (!admin || !newNote) return;
    founderService.addMentorNote({
      founderId: founder.id,
      date: new Date().toISOString().split('T')[0],
      note: newNote,
      author: admin.name,
      authorId: admin.id
    });
    setNewNote("");
  };

  const handleSendMessage = (message: { subject: string; body: string; channel: string }) => {
    alert(`Message sent via ${message.channel} to ${founder.name}!`);
  };

  const handleScheduleCall = (details: { date: string; time: string; duration: string; notes: string }) => {
    alert(`Call scheduled with ${founder.name} on ${details.date} at ${details.time} WAT!`);
  };

  const handleRemovalDecision = (decision: "remove" | "continue" | "extend", notes: string) => {
    alert(`Decision recorded: ${decision} for ${founder.name}. Notes: ${notes}`);
  };

  const handleOverrideLock = () => {
    if (confirm(`Are you sure you want to override the lock for ${founder.name}?`)) {
      founderService.overrideLock(founder.id);
      alert(`Lock overridden for ${founder.name}!`);
      window.location.reload();
    }
  };
  
  const handleEditProfile = () => {
    setEditFormData({
      name: founder.name || '',
      email: founder.email || '',
      phone: founder.phone || '',
      business_name: founder.business_name || ''
    });
    setIsEditing(true);
  };
  
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      
      const founders = storage.getFounders();
      const updated = founders.map(f =>
        f.id === founder.id
          ? {
              ...f,
              name: editFormData.name,
              email: editFormData.email,
              phone: editFormData.phone,
              business_name: editFormData.business_name
            }
          : f
      );
      storage.setFounders(updated);
      
      toast.success('✅ Profile updated successfully');
      setIsEditing(false);
      
      // Reload founder data
      const data = await founderService.getFounderById(id || "");
      setFounder(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setResettingPassword(true);

      const success = storage.resetUserPassword(founder.id, 'founder', newPassword);
      
      if (success) {
        toast.success(`✅ Password for ${founder.name} has been reset successfully`);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to reset password - user not found');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };
  
  const handleToggleLock = async () => {
    try {
      const founders = storage.getFounders();
      const updated = founders.map(f =>
        f.id === founder.id ? { ...f, is_locked: !f.is_locked } : f
      );
      storage.setFounders(updated);
      
      toast.success(`${founder.name} ${founder.is_locked ? 'unlocked' : 'locked'} successfully`);
      
      // Reload founder data
      const data = await founderService.getFounderById(id || "");
      setFounder(data);
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast.error('Failed to update lock status');
    }
  };
  
  return (
    <div className="p-8 space-y-8">
      <Link to="/admin/cohort" className="text-sm text-neutral-600 hover:text-neutral-900 mb-4 inline-block">
        ← Back to Cohort Overview
      </Link>
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{founder.name}</h1>
          <p className="text-neutral-600 mt-1">{founder.business_name} • {founder.business_stage}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm flex items-center gap-2" onClick={() => setMessageModalOpen(true)}>
            <MessageSquare className="w-4 h-4" />
            Send Message
          </button>
          <button className="px-4 py-2 border border-amber-300 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition-colors text-sm flex items-center gap-2" onClick={() => setRemovalModalOpen(true)}>
            <AlertTriangle className="w-4 h-4" />
            Flag for Review
          </button>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <QuickStat 
          label="Current Revenue" 
          value={formatCurrency(founder.baseline_revenue_30d || 0)}
          change={founder.baseline_revenue_30d > 0 ? '+12%' : ''}
          positive={true}
        />
        <QuickStat 
          label="Stage / Week" 
          value={`Stage ${founder.current_stage || 1} / Week ${founder.current_week || 1}`}
        />
        <QuickStat 
          label="Missed Weeks" 
          value={(founder.consecutive_misses || 0).toString()}
          warning={(founder.consecutive_misses || 0) > 0}
        />
        <QuickStat 
          label="Lock Status" 
          value={founder.is_locked ? "LOCKED" : "Active"}
          warning={founder.is_locked}
        />
      </div>
      
      {/* Business Context */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <h2 className="text-xl font-bold mb-6">Business Context</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-neutral-600 mb-1">Business Name</div>
            <div className="font-medium">{founder.business_name || 'N/A'}</div>
          </div>
          <div>
            <div className="text-neutral-600 mb-1">Industry</div>
            <div className="font-medium">{founder.business_stage || 'N/A'}</div>
          </div>
          <div>
            <div className="text-neutral-600 mb-1">Description</div>
            <div className="font-medium">{founder.business_description || 'N/A'}</div>
          </div>
          <div>
            <div className="text-neutral-600 mb-1">Contact</div>
            <div className="font-medium">{founder.email}</div>
          </div>
          <div>
            <div className="text-neutral-600 mb-1">Phone</div>
            <div className="font-medium">{founder.phone || 'N/A'}</div>
          </div>
          <div>
            <div className="text-neutral-600 mb-1">Country</div>
            <div className="font-medium">{founder.country || 'N/A'}</div>
          </div>
          <div>
            <div className="text-neutral-600 mb-1">30-Day Revenue</div>
            <div className="font-medium">{formatCurrency(founder.baseline_revenue_30d || 0)}</div>
          </div>
          <div>
            <div className="text-neutral-600 mb-1">90-Day Revenue</div>
            <div className="font-medium">{formatCurrency(founder.baseline_revenue_90d || 0)}</div>
          </div>
        </div>
      </div>
      
      {/* Revenue Chart */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Revenue Progression</h2>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-neutral-600">Actual Revenue</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-neutral-600">Target Revenue</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={revenueData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis 
              dataKey="week" 
              stroke="#737373"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#737373"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ stroke: '#d4d4d4', strokeWidth: 1 }}
            />
            <Area 
              type="monotone" 
              dataKey="target" 
              stroke="#60a5fa" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTarget)"
              name="Target"
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#16a34a" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)"
              name="Actual Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Weekly History */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <h2 className="text-xl font-bold mb-6">Weekly History</h2>
        <div className="space-y-6">
          {weeklyHistory.map((week) => (
            <WeekCard key={week.week} week={week} />
          ))}
        </div>
      </div>
      
      {/* Account Management */}
      {admin?.role === 'Super Admin' && (
        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Account Management</h2>
            {!isEditing && (
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.business_name}
                      onChange={(e) => setEditFormData({ ...editFormData, business_name: e.target.value })}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-400"
                  >
                    <Save className="w-4 h-4" />
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="text-neutral-600 mb-1">Full Name</div>
                  <div className="font-medium">{founder.name}</div>
                </div>
                <div>
                  <div className="text-neutral-600 mb-1">Email Address</div>
                  <div className="font-medium">{founder.email}</div>
                </div>
                <div>
                  <div className="text-neutral-600 mb-1">Phone Number</div>
                  <div className="font-medium">{founder.phone || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-neutral-600 mb-1">Business Name</div>
                  <div className="font-medium">{founder.business_name || 'Not provided'}</div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 my-8"></div>

          {/* Password Reset Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Key className="w-5 h-5" />
              Reset Password
            </h3>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={resettingPassword || !newPassword || !confirmPassword}
                className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {resettingPassword ? 'Resetting Password...' : 'Reset Password'}
              </button>
              
              <p className="text-sm text-neutral-500">
                Password must be at least 6 characters long. This will immediately update the user's password.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 my-8"></div>

          {/* Account Status Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Account Status
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div>
                <div className="font-medium">Account Lock Status</div>
                <div className="text-sm text-neutral-600 mt-1">
                  {founder.is_locked 
                    ? 'This account is currently locked and the user cannot access their account' 
                    : 'This account is active and the user has full access'}
                </div>
              </div>
              <button
                onClick={handleToggleLock}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  founder.is_locked
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {founder.is_locked ? (
                  <>
                    <Unlock className="w-4 h-4" />
                    Unlock Account
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Lock Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mentor Notes */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <h2 className="text-xl font-bold mb-6">Mentor Notes (Private)</h2>
        <div className="space-y-4 mb-6">
          {mentorNotes.map((note, i) => (
            <div key={i} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">{note.author}</div>
                <div className="text-sm text-neutral-600">{note.date}</div>
              </div>
              <div className="text-sm text-neutral-700">{note.note}</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <textarea 
            placeholder="Add a private mentor note..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 min-h-24"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors font-medium" onClick={handleSaveNote}>
            Save Note
          </button>
        </div>
      </div>
      
      {/* Admin Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-8">
        <h2 className="text-xl font-bold mb-6">Admin Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="px-6 py-4 border-2 border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors text-center font-medium" onClick={() => setCallModalOpen(true)}>
            Schedule 1-on-1 Call
          </button>
          <button className="px-6 py-4 border-2 border-amber-300 bg-amber-50 text-amber-900 rounded-lg hover:bg-amber-100 transition-colors text-center font-medium" onClick={() => setRemovalModalOpen(true)}>
            Flag for Intervention
          </button>
          <button className="px-6 py-4 border-2 border-blue-300 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium flex items-center justify-center gap-2" onClick={handleOverrideLock}>
            <Unlock className="w-5 h-5" />
            Override Lock
          </button>
        </div>
      </div>
      
      {/* Modals */}
      <MessageModal 
        isOpen={messageModalOpen} 
        onClose={() => setMessageModalOpen(false)}
        founder={founder}
        onSendMessage={handleSendMessage}
      />
      <ScheduleCallModal 
        isOpen={callModalOpen} 
        onClose={() => setCallModalOpen(false)}
        founder={founder}
        onScheduleCall={handleScheduleCall}
      />
      <RemovalReviewModal 
        isOpen={removalModalOpen} 
        onClose={() => setRemovalModalOpen(false)}
        founder={founder}
        onRemovalDecision={handleRemovalDecision}
      />
    </div>
  );
}

function QuickStat({ label, value, change, positive, warning }: any) {
  return (
    <div className={`border rounded-xl p-6 ${
      warning ? 'bg-red-50 border-red-200' : 'bg-white border-neutral-200'
    }`}>
      <div className="text-sm text-neutral-600 mb-2">{label}</div>
      <div className={`text-2xl font-bold ${warning ? 'text-red-900' : ''}`}>{value}</div>
      {change && (
        <div className={`text-sm font-medium mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      )}
    </div>
  );
}

function WeekCard({ week }: any) {
  return (
    <div className="p-6 border border-neutral-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold">Week {week.week}</div>
        <div className="flex gap-2">
          <StatusBadge status={week.commitStatus} label="Commit" />
          <StatusBadge status={week.reportStatus} label="Report" />
          <StatusBadge status={week.adjustStatus} label="Adjust" />
        </div>
      </div>
      
      <div className="space-y-4 text-sm">
        {/* Commit */}
        <div>
          <div className="font-medium mb-1">Commit:</div>
          <div className="text-neutral-700">{week.commitText}</div>
          <div className="text-neutral-600 mt-1">
            Target: {formatCurrency(week.commitTarget)} • Submitted: {week.commitDate}
          </div>
        </div>
        
        {/* Report */}
        {week.reportStatus === "complete" && (
          <div>
            <div className="font-medium mb-1">Report:</div>
            <div className="text-neutral-700">
              Actual Revenue: <span className="font-bold">{formatCurrency(week.reportRevenue)}</span>
            </div>
            <div className="text-neutral-600">
              Evidence: {week.reportEvidence} • Submitted: {week.reportDate}
            </div>
          </div>
        )}
        
        {/* Adjust */}
        {week.adjustStatus === "complete" && (
          <div>
            <div className="font-medium mb-1">Diagnosis & Adjust:</div>
            <div className="text-neutral-700">{week.adjustNotes}</div>
            <div className="text-neutral-600 mt-1">
              $ per hour: ₦{week.adjustDollarPerHour?.toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, label }: any) {
  const config: Record<string, any> = {
    complete: { bg: "bg-green-100", text: "text-green-700", icon: <CheckCircle className="w-4 h-4" /> },
    pending: { bg: "bg-blue-100", text: "text-blue-700", icon: <Clock className="w-4 h-4" /> },
    missed: { bg: "bg-red-100", text: "text-red-700", icon: <XCircle className="w-4 h-4" /> }
  };
  
  const { bg, text, icon } = config[status] || config.pending;
  
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {icon}
      {label}
    </span>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const revenueData = payload.find((p: any) => p.dataKey === 'revenue');
    const targetData = payload.find((p: any) => p.dataKey === 'target');
    
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-md">
        <div className="text-sm font-medium mb-2">{label}</div>
        {revenueData && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-neutral-600">Actual: {formatCurrency(revenueData.value)}</span>
          </div>
        )}
        {targetData && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-neutral-600">Target: {formatCurrency(targetData.value)}</span>
          </div>
        )}
      </div>
    );
  }
  
  return null;
}