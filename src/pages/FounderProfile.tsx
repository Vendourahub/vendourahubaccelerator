import { useState, useEffect } from 'react';
import { getCurrentUser, getFounderProfile, updateFounderProfile } from '../lib/authManager';
import { User, Mail, Building2, Calendar, TrendingUp, Edit2, Check, X, AlertCircle } from 'lucide-react';
import React from 'react';
import { formatCurrency } from '../lib/currency';
import { formatWATDate } from '../lib/time';
import { toast } from 'sonner@2.0.3';
import { uploadProfilePhoto } from '../lib/profilePhotoService';
import { uploadProfilePhoto } from '../lib/profilePhotoService';

interface FounderData {
  id: string;
  email: string;
  name: string;
  profile_photo_url?: string;
  business_name: string;
  business_model?: string;
  industry?: string;
  phone_number?: string;
  product_description?: string;
  current_week: number;
  current_stage: number;
  revenue_baseline_30d?: number;
  is_locked: boolean;
  lock_reason?: string;
  onboarding_completed: boolean;
  created_at?: string;
}

export default function FounderProfile() {
  const [founder, setFounder] = useState<FounderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    business_name: '',
    industry: '',
    phone_number: '',
    product_description: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      
      if (!user || user.user_type !== 'founder') {
        toast.error('Please sign in to view your profile');
        return;
      }

      const profileResult = await getFounderProfile();
      
      if (!profileResult.success || !profileResult.data) {
        toast.error('Failed to load profile data');
        return;
      }

      const profile = profileResult.data;
      setFounder(profile);
      setFormData({
        name: profile.name || '',
        business_name: profile.business_name || '',
        industry: profile.industry || '',
        phone_number: profile.phone_number || '',
        product_description: profile.product_description || '',
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!founder) return;

    try {
      setSaving(true);
      
      const result = await updateFounderProfile({
        name: formData.name,
        business_name: formData.business_name,
        industry: formData.industry,
        phone_number: formData.phone_number,
        product_description: formData.product_description,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setFounder(result.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !founder) return;

    try {
      setUploadingPhoto(true);

      // Get current user for ID
      const user = await getCurrentUser();
      if (!user) {
        toast.error('Not authenticated');
        setUploadingPhoto(false);
        return;
      }

      // Upload to Supabase Storage
      const uploadResult = await uploadProfilePhoto(file, user.id, 'founder');
      
      if (!uploadResult.success || !uploadResult.url) {
        toast.error(uploadResult.error || 'Failed to upload photo');
        setUploadingPhoto(false);
        return;
      }

      // Update profile with new photo URL
      const result = await updateFounderProfile({ profile_photo_url: uploadResult.url });
      if (!result.success || !result.data) {
        toast.error(result.error || 'Failed to update profile');
      } else {
        setFounder(result.data);
        toast.success('Profile photo updated');
      }
      setUploadingPhoto(false);
    } catch (error: any) {
      setUploadingPhoto(false);
      toast.error(error.message || 'Failed to upload photo');
    }
  };

  const handleCancel = () => {
    if (founder) {
      setFormData({
        name: founder.name || '',
        business_name: founder.business_name || '',
        industry: founder.industry || '',
        phone_number: founder.phone_number || '',
        product_description: founder.product_description || '',
      });
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading profile...</div>
      </div>
    );
  }

  if (!founder) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-neutral-600">Unable to load your profile data.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const revenue30d = founder.revenue_baseline_30d || 0;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-neutral-800 to-neutral-600"></div>
        
        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Avatar - Overlapping the cover */}
          <div className="relative -mt-16 mb-4">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                {founder.profile_photo_url ? (
                  <img
                    src={founder.profile_photo_url}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(founder.name || 'F')}
                  </div>
                )}
            </div>
          </div>

          {/* Name and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                {founder.name}
              </h1>
              <p className="text-neutral-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {founder.business_name || 'Business Name Not Set'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div>
                <label className="inline-flex items-center px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg cursor-pointer text-sm font-medium transition-colors">
                  {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                </label>
                <div className="text-xs text-neutral-500 mt-2">JPG/PNG, max 1MB</div>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 self-start"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="text-sm text-neutral-600 mb-1">Current Week</div>
              <div className="text-2xl font-bold">{founder.current_week}/12</div>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="text-sm text-neutral-600 mb-1">Stage</div>
              <div className="text-2xl font-bold">{founder.current_stage}/5</div>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="text-sm text-neutral-600 mb-1">30-Day Revenue</div>
              <div className="text-2xl font-bold">{formatCurrency(revenue30d)}</div>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
              <div className="text-sm text-neutral-600 mb-1">Status</div>
              <div className={`text-sm font-bold px-2 py-1 rounded-full inline-block ${
                founder.is_locked 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {founder.is_locked ? 'Locked' : 'Active'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode Actions */}
      {editing && (
        <div className="flex items-center justify-end gap-3 bg-neutral-50 border border-neutral-300 rounded-lg px-4 py-3">
          <span className="text-sm text-neutral-700 font-medium mr-auto">Editing Profile</span>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="px-4 py-2 bg-white text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-2 text-sm border border-neutral-300 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-xl font-bold">Profile Information</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              ) : (
                <div className="text-lg font-medium flex items-center gap-2">
                  <User className="w-5 h-5 text-neutral-400" />
                  {founder.name || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="text-lg font-medium flex items-center gap-2">
                <Mail className="w-5 h-5 text-neutral-400" />
                {founder.email}
              </div>
              <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Business Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              ) : (
                <div className="text-lg font-medium flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-neutral-400" />
                  {founder.business_name || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Industry
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="e.g., SaaS, E-commerce, Fintech"
                />
              ) : (
                <div className="text-lg font-medium flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-neutral-400" />
                  {founder.industry || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  placeholder="+234 xxx xxx xxxx"
                />
              ) : (
                <div className="text-lg font-medium">
                  {founder.phone_number || 'Not set'}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Joined Date
              </label>
              <div className="text-lg font-medium flex items-center gap-2">
                <Calendar className="w-5 h-5 text-neutral-400" />
                {founder.created_at ? formatWATDate(new Date(founder.created_at)) : 'Unknown'}
              </div>
            </div>
          </div>

          {editing && (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Product Description
              </label>
              <textarea
                value={formData.product_description}
                onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="Briefly describe your product or service..."
              />
            </div>
          )}

          {!editing && founder.product_description && (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Product Description
              </label>
              <p className="text-neutral-700">{founder.product_description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Program Progress */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-xl font-bold">Program Progress</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall Completion</span>
              <span className="text-neutral-600">{founder.current_week}/12 weeks</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-3">
              <div 
                className="bg-neutral-900 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(founder.current_week / 12) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-4">
            {[1, 2, 3, 4, 5].map((stage) => (
              <div
                key={stage}
                className={`text-center p-3 rounded-lg border-2 ${
                  stage === founder.current_stage
                    ? 'border-neutral-900 bg-neutral-50'
                    : stage < founder.current_stage
                    ? 'border-green-600 bg-green-50'
                    : 'border-neutral-200 bg-neutral-50 opacity-50'
                }`}
              >
                <div className="text-2xl font-bold mb-1">
                  {stage < founder.current_stage ? '✓' : stage}
                </div>
                <div className="text-xs text-neutral-600">
                  Stage {stage}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50">
          <h2 className="text-xl font-bold">Account Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-neutral-200">
            <div>
              <div className="font-medium">Account ID</div>
              <div className="text-sm text-neutral-600 font-mono">{founder.id}</div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-neutral-200">
            <div>
              <div className="font-medium">Onboarding Status</div>
              <div className="text-sm text-neutral-600">
                {founder.onboarding_completed ? 'Completed' : 'Incomplete'}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              founder.onboarding_completed 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {founder.onboarding_completed ? 'Complete' : 'Pending'}
            </div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-medium">Account Status</div>
              <div className="text-sm text-neutral-600">
                {founder.is_locked ? founder.lock_reason || 'Account is currently locked' : 'Account is active'}
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              founder.is_locked 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {founder.is_locked ? 'Locked' : 'Active'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}