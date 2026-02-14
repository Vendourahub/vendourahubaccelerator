import React, { useState } from 'react';
import { Link } from 'react-router';
import * as storage from '../lib/localStorage';
import * as auth from '../lib/auth';
import { seedDefaultData, resetToDefaultData, createSampleData } from '../lib/seedData';

export default function Debug() {
  const [output, setOutput] = useState<string>('');

  const log = (message: string) => {
    setOutput(prev => prev + message + '\n');
    console.log(message);
  };

  const testAuth = async () => {
    setOutput('');
    log('=== Testing Authentication ===\n');

    // Test 1: Sign in with default founder
    log('Test 1: Sign in as founder...');
    const founderResult = await auth.signIn('founder@example.com', 'founder123');
    if (founderResult.success) {
      log('✅ Founder sign in successful');
      const profile = await auth.getFounderProfile();
      log(`✅ Founder profile: ${JSON.stringify(profile.data, null, 2)}`);
      await auth.logout();
      log('✅ Founder logged out');
    } else {
      log(`❌ Founder sign in failed: ${founderResult.error}`);
    }

    log('\nTest 2: Sign in as admin...');
    const adminResult = await auth.signIn('admin@vendoura.com', 'admin123');
    if (adminResult.success) {
      log('✅ Admin sign in successful');
      log(`✅ Admin user: ${JSON.stringify(adminResult.user, null, 2)}`);
      await auth.logout();
      log('✅ Admin logged out');
    } else {
      log(`❌ Admin sign in failed: ${adminResult.error}`);
    }

    log('\nTest 3: Create new user...');
    const newUser = await auth.signUp(
      'test@example.com',
      'test123',
      {
        user_type: 'founder',
        name: 'Test User',
        business_name: 'Test Business',
      }
    );
    if (newUser.success) {
      log('✅ New user created successfully');
      await auth.logout();
      log('✅ Logged out');
      
      // Clean up
      const founders = storage.getAllFounders();
      const testFounder = founders.find(f => f.email === 'test@example.com');
      if (testFounder) {
        storage.deleteFounder(testFounder.id);
        log('✅ Test user cleaned up');
      }
    } else {
      log(`❌ User creation failed: ${newUser.error}`);
    }

    log('\n=== All Tests Complete ===');
  };

  const testOnboarding = async () => {
    setOutput('');
    log('=== Testing Onboarding ===\n');

    // Sign in
    const signInResult = await auth.signIn('founder@example.com', 'founder123');
    if (!signInResult.success) {
      log(`❌ Could not sign in: ${signInResult.error}`);
      return;
    }
    log('✅ Signed in as founder');

    // Check profile before
    const profileBefore = await auth.getFounderProfile();
    log(`\nProfile before onboarding:`);
    log(`  Onboarding completed: ${profileBefore.data?.onboarding_completed}`);

    // Complete onboarding
    const onboardingData = {
      business_name: 'Updated Business',
      business_model: 'b2b_saas',
      product_description: 'Test product',
      customer_count: 100,
      pricing: '10000',
      revenue_baseline_30d: 500000,
      revenue_baseline_90d: 1500000,
    };

    const result = await auth.completeOnboarding(onboardingData);
    if (result.success) {
      log('✅ Onboarding completed successfully');
    } else {
      log(`❌ Onboarding failed: ${result.error}`);
    }

    // Check profile after
    const profileAfter = await auth.getFounderProfile();
    log(`\nProfile after onboarding:`);
    log(`  Onboarding completed: ${profileAfter.data?.onboarding_completed}`);
    log(`  Business name: ${profileAfter.data?.business_name}`);
    log(`  Revenue 30d: ₦${profileAfter.data?.revenue_baseline_30d}`);

    await auth.logout();
    log('\n✅ Logged out');
  };

  const showStorageData = () => {
    setOutput('');
    log('=== LocalStorage Data ===\n');

    log('Founders:');
    const founders = storage.getAllFounders();
    founders.forEach(f => {
      log(`  - ${f.email} (${f.name}) - Onboarding: ${f.onboarding_completed ? 'Yes' : 'No'}`);
    });

    log('\nAdmins:');
    const admins = storage.getAllAdmins();
    admins.forEach(a => {
      log(`  - ${a.email} (${a.name}) - Role: ${a.admin_role}`);
    });

    log('\nCohorts:');
    const cohorts = storage.getAllCohorts();
    cohorts.forEach(c => {
      log(`  - ${c.name} (${c.status}) - ${c.current_participants}/${c.max_participants} participants`);
    });

    log('\nApplications:');
    const applications = storage.getAllApplications();
    log(`  Total: ${applications.length}`);

    log('\nWaitlist:');
    const waitlist = storage.getAllWaitlist();
    log(`  Total: ${waitlist.length}`);

    log('\nSettings:');
    const settings = storage.getSettings();
    log(`  Platform: ${settings.platform_name}`);
    log(`  Currency: ${settings.currency}`);
    log(`  Timezone: ${settings.timezone}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <h1 className="text-3xl font-bold mb-2">LocalStorage Debug Panel</h1>
          <p className="text-neutral-600 mb-8">
            Test and debug the localStorage-based authentication system
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={testAuth}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🧪 Test Authentication
            </button>

            <button
              onClick={testOnboarding}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              📝 Test Onboarding
            </button>

            <button
              onClick={showStorageData}
              className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              📊 View All Data
            </button>

            <button
              onClick={() => {
                const data = storage.exportData();
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `vendoura-backup-${Date.now()}.json`;
                a.click();
                setOutput('✅ Data exported to file');
              }}
              className="px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              💾 Export Data
            </button>

            <button
              onClick={async () => {
                setOutput('');
                log('Seeding default data...');
                await seedDefaultData();
                log('✅ Default data seeded');
              }}
              className="px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              🌱 Seed Default Data
            </button>

            <button
              onClick={() => {
                setOutput('');
                log('Creating sample data...');
                createSampleData();
                log('✅ Sample data created');
                showStorageData();
              }}
              className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              🎭 Create Sample Data
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure? This will delete ALL data and reseed defaults.')) {
                  setOutput('');
                  log('Resetting to default data...');
                  resetToDefaultData();
                  log('✅ Reset complete');
                  showStorageData();
                }
              }}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              🔄 Reset All Data
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure? This will delete ALL data permanently.')) {
                  storage.clearAllData();
                  setOutput('✅ All data cleared');
                }
              }}
              className="px-4 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-medium"
            >
              🗑️ Clear All Data
            </button>
          </div>

          {/* Output Console */}
          <div className="border border-neutral-300 rounded-lg p-4 bg-neutral-900 text-green-400 font-mono text-sm overflow-auto max-h-96">
            {output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-neutral-500">
                Click a button above to run tests...
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <h2 className="text-lg font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-center transition-colors"
              >
                Founder Login
              </Link>
              <Link
                to="/admin/login"
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-center transition-colors"
              >
                Admin Login
              </Link>
              <Link
                to="/onboarding"
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-center transition-colors"
              >
                Onboarding
              </Link>
              <Link
                to="/founder/dashboard"
                className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 text-center transition-colors"
              >
                Founder Dashboard
              </Link>
            </div>
          </div>

          {/* Default Credentials */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold mb-2">Default Credentials</h3>
            <div className="text-sm space-y-1">
              <div>
                <strong>Admin:</strong>{' '}
                <code className="bg-blue-100 px-1 rounded">admin@vendoura.com</code> /{' '}
                <code className="bg-blue-100 px-1 rounded">admin123</code>
              </div>
              <div>
                <strong>Founder:</strong>{' '}
                <code className="bg-blue-100 px-1 rounded">founder@example.com</code> /{' '}
                <code className="bg-blue-100 px-1 rounded">founder123</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
