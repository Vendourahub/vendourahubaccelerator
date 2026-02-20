/**
 * Profile Photo Upload Service
 * Handles profile picture uploads to Supabase Storage
 */

import { supabase } from './api';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Upload profile photo to Supabase Storage
 * Returns the public URL of the uploaded image
 */
export async function uploadProfilePhoto(
  file: File,
  userId: string,
  userType: 'founder' | 'admin'
): Promise<UploadResult> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'Please select an image file (JPG, PNG, etc.)' };
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      return { success: false, error: 'Image must be under 1MB' };
    }

    // Create unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userType}/${userId}/profile.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true // Replace existing file
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: 'Failed to upload photo. Please try again.' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      return { success: false, error: 'Failed to get photo URL' };
    }

    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error('Profile photo upload error:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload photo'
    };
  }
}

/**
 * Delete profile photo from Supabase Storage
 */
export async function deleteProfilePhoto(
  userId: string,
  userType: 'founder' | 'admin'
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('profile-photos')
      .remove([`${userType}/${userId}/profile`]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Profile photo delete error:', error);
    return false;
  }
}
