/**
 * Seed Data for LocalStorage
 * Initialize the application with default data
 */

import * as storage from './localStorage';

export async function seedDefaultData(): Promise<void> {
  console.log('🌱 Seeding default data...');
  
  try {
    // Create default super admin if no admins exist
    const existingAdmins = storage.getAllAdmins();
    if (existingAdmins.length === 0) {
      console.log('Creating default super admin...');
      await storage.signUp('admin@vendoura.com', 'admin123', {
        user_type: 'admin',
        name: 'Super Admin',
        admin_role: 'super_admin',
      });
      console.log('✅ Default super admin created: admin@vendoura.com / admin123');
      
      // Create additional admin roles for testing
      console.log('Creating program manager...');
      await storage.signUp('manager@vendoura.com', 'manager123', {
        user_type: 'admin',
        name: 'Program Manager',
        admin_role: 'program_manager',
      });
      console.log('✅ Program manager created: manager@vendoura.com / manager123');
      
      console.log('Creating mentor...');
      await storage.signUp('mentor@vendoura.com', 'mentor123', {
        user_type: 'admin',
        name: 'Sarah Mentor',
        admin_role: 'mentor',
      });
      console.log('✅ Mentor created: mentor@vendoura.com / mentor123');
      
      console.log('Creating observer...');
      await storage.signUp('observer@vendoura.com', 'observer123', {
        user_type: 'admin',
        name: 'Observer User',
        admin_role: 'observer',
      });
      console.log('✅ Observer created: observer@vendoura.com / observer123');
    }
    
    // Create sample cohort if none exist
    const existingCohorts = storage.getAllCohorts();
    if (existingCohorts.length === 0) {
      console.log('Creating sample cohort...');
      const admins = storage.getAllAdmins();
      const adminId = admins[0]?.id || 'system';
      
      storage.createCohort({
        name: 'Cohort 1 - Q1 2026',
        start_date: '2026-01-15',
        end_date: '2026-04-15',
        status: 'active',
        max_participants: 20,
        current_participants: 0,
        created_by: adminId,
      });
      console.log('✅ Sample cohort created');
    }
    
    // Create sample founder if requested
    const existingFounders = storage.getAllFounders();
    if (existingFounders.length === 0) {
      console.log('Creating sample founder...');
      await storage.signUp('founder@example.com', 'founder123', {
        user_type: 'founder',
        name: 'John Founder',
        business_name: 'Example Startup',
        business_description: 'A revolutionary SaaS platform',
        business_stage: 'early_revenue',
        revenue: '₦500,000 - ₦1M',
        phone: '+234 123 456 7890',
        country: 'Nigeria',
      });
      
      // Complete onboarding for sample founder
      const founder = storage.getFounderByEmail('founder@example.com');
      if (founder) {
        storage.updateFounder(founder.id, {
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          current_stage: 'stage_1',
          current_week: 1,
        });
      }
      console.log('✅ Sample founder created: founder@example.com / founder123');
    }
    
    console.log('✅ Seed data complete!');
    console.log('\n📝 Default Credentials:');
    console.log('   Admin: admin@vendoura.com / admin123');
    console.log('   Founder: founder@example.com / founder123');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

export function resetToDefaultData(): void {
  console.log('🔄 Resetting to default data...');
  
  // Clear all data
  storage.clearAllData();
  
  // Reseed
  seedDefaultData();
  
  console.log('✅ Reset complete!');
}

export function createSampleData(): void {
  console.log('🎭 Creating sample data for testing...');
  
  const admins = storage.getAllAdmins();
  const adminId = admins[0]?.id || 'system';
  
  // Create additional sample founders
  const sampleFounders = [
    {
      email: 'sarah@techco.com',
      password: 'password123',
      name: 'Sarah Tech',
      business_name: 'TechCo Solutions',
      business_description: 'B2B SaaS for enterprise',
      business_stage: 'scaling',
      revenue: '₦5M - ₦10M',
      country: 'Nigeria',
    },
    {
      email: 'mike@ecom.com',
      password: 'password123',
      name: 'Mike Commerce',
      business_name: 'E-Commerce Plus',
      business_description: 'Online marketplace platform',
      business_stage: 'early_revenue',
      revenue: '₦1M - ₦5M',
      country: 'Nigeria',
    },
  ];
  
  sampleFounders.forEach(async (f) => {
    const existing = storage.getFounderByEmail(f.email);
    if (!existing) {
      await storage.signUp(f.email, f.password, {
        user_type: 'founder',
        ...f,
      });
    }
  });
  
  // Create sample applications
  const sampleApplications = [
    {
      email: 'applicant1@startup.com',
      name: 'Jane Applicant',
      business_name: 'AI Startup',
      business_description: 'AI-powered customer service',
      business_stage: 'idea',
      revenue: '₦0 - ₦500k',
      phone: '+234 111 222 3333',
      country: 'Nigeria',
      status: 'pending' as const,
    },
    {
      email: 'applicant2@biz.com',
      name: 'Bob Business',
      business_name: 'FinTech App',
      business_description: 'Mobile payments solution',
      business_stage: 'mvp',
      revenue: '₦500k - ₦1M',
      phone: '+234 444 555 6666',
      country: 'Ghana',
      status: 'pending' as const,
    },
  ];
  
  sampleApplications.forEach((app) => {
    storage.createApplication(app);
  });
  
  // Create sample waitlist entries
  const sampleWaitlist = [
    { email: 'wait1@email.com', name: 'Waitlist User 1', source: 'landing_page' },
    { email: 'wait2@email.com', name: 'Waitlist User 2', source: 'social_media' },
  ];
  
  sampleWaitlist.forEach((w) => {
    storage.addToWaitlist(w.email, w.name, w.source);
  });
  
  console.log('✅ Sample data created!');
}

// Auto-seed on first load
if (typeof window !== 'undefined') {
  const hasSeeded = localStorage.getItem('vendoura_seeded');
  if (!hasSeeded) {
    seedDefaultData().then(() => {
      localStorage.setItem('vendoura_seeded', 'true');
    });
  }
}