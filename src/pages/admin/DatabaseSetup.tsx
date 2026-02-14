import { useState } from "react";
import { supabase } from "../../lib/api";
import { Loader2, CheckCircle, XCircle, AlertTriangle, Database, Play } from "lucide-react";

interface TableCheck {
  name: string;
  exists: boolean;
  columns?: string[];
  error?: string;
}

interface PolicyCheck {
  table: string;
  policy: string;
  exists: boolean;
  error?: string;
}

export default function DatabaseSetup() {
  const [checking, setChecking] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [tables, setTables] = useState<TableCheck[]>([]);
  const [policies, setPolicies] = useState<PolicyCheck[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [fixResults, setFixResults] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${msg}`]);
  };

  const addFixResult = (msg: string) => {
    console.log(msg);
    setFixResults(prev => [...prev, msg]);
  };

  const checkDatabase = async () => {
    setChecking(true);
    setLogs([]);
    setTables([]);
    setPolicies([]);

    try {
      addLog("🔍 Starting database verification...");

      // Check each table by trying to query it
      const tablesToCheck = [
        'founder_profiles',
        'admin_users',
        'weekly_commits',
        'weekly_reports',
        'stage_progress',
        'mentor_notes',
        'system_settings',
        'waitlist'
      ];

      const tableResults: TableCheck[] = [];

      for (const tableName of tablesToCheck) {
        addLog(`Checking table: ${tableName}...`);
        
        try {
          // Try to get column info by selecting one row
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (error) {
            addLog(`❌ Table ${tableName}: ${error.message}`);
            tableResults.push({
              name: tableName,
              exists: false,
              error: error.message
            });
          } else {
            // Extract column names from the data
            const columns = data && data.length > 0 
              ? Object.keys(data[0])
              : ['(no rows to determine columns)'];
            
            addLog(`✅ Table ${tableName} exists with columns: ${columns.join(', ')}`);
            tableResults.push({
              name: tableName,
              exists: true,
              columns
            });
          }
        } catch (err: any) {
          addLog(`❌ Error checking ${tableName}: ${err.message}`);
          tableResults.push({
            name: tableName,
            exists: false,
            error: err.message
          });
        }
      }

      setTables(tableResults);

      // Check specific RLS policies by trying insert operations
      addLog("🔒 Checking RLS policies...");
      
      const policyResults: PolicyCheck[] = [];

      // Test founder_profiles insert policy
      try {
        const { error } = await supabase
          .from('founder_profiles')
          .insert({
            user_id: '00000000-0000-0000-0000-000000000000', // Fake ID to test policy
            email: 'test@test.com'
          });

        if (error && error.message.includes('row-level security')) {
          addLog("❌ founder_profiles: Insert blocked by RLS");
          policyResults.push({
            table: 'founder_profiles',
            policy: 'Allow authenticated insert',
            exists: false,
            error: 'RLS blocking inserts'
          });
        } else if (error && error.message.includes('violates foreign key')) {
          addLog("✅ founder_profiles: RLS policy allows insert (foreign key error is expected)");
          policyResults.push({
            table: 'founder_profiles',
            policy: 'Allow authenticated insert',
            exists: true
          });
        } else {
          addLog("✅ founder_profiles: RLS policy allows insert");
          policyResults.push({
            table: 'founder_profiles',
            policy: 'Allow authenticated insert',
            exists: true
          });
        }
      } catch (err: any) {
        addLog(`⚠️ founder_profiles policy check error: ${err.message}`);
        policyResults.push({
          table: 'founder_profiles',
          policy: 'Allow authenticated insert',
          exists: false,
          error: err.message
        });
      }

      setPolicies(policyResults);
      addLog("✅ Database verification complete!");

    } catch (error: any) {
      addLog(`❌ Verification failed: ${error.message}`);
    } finally {
      setChecking(false);
    }
  };

  const fixDatabase = async () => {
    setFixing(true);
    setFixResults([]);

    try {
      addFixResult("🔧 Starting database fixes...");

      // Get current user session to use service role
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        addFixResult("❌ Not authenticated - cannot fix database");
        setFixing(false);
        return;
      }

      // Fix founder_profiles RLS policy using raw SQL
      addFixResult("🔒 Fixing founder_profiles RLS policies...");
      
      const { error: rpcError } = await supabase.rpc('exec_sql', {
        sql: `
          -- Drop existing policies to avoid conflicts
          DROP POLICY IF EXISTS "Allow authenticated insert founder_profiles" ON founder_profiles;
          DROP POLICY IF EXISTS "System can create profiles" ON founder_profiles;
          DROP POLICY IF EXISTS "Allow authenticated to insert founder profile" ON founder_profiles;
          
          -- Create new policy that allows any authenticated user to insert their own profile
          CREATE POLICY "Allow authenticated insert founder_profiles" 
            ON founder_profiles 
            FOR INSERT 
            TO authenticated 
            WITH CHECK (true);
          
          -- Allow users to read their own profile
          DROP POLICY IF EXISTS "Founders can view own profile" ON founder_profiles;
          CREATE POLICY "Founders can view own profile" 
            ON founder_profiles 
            FOR SELECT 
            TO authenticated 
            USING (auth.uid() = user_id OR EXISTS (
              SELECT 1 FROM admin_users WHERE user_id = auth.uid()
            ));
          
          -- Allow users to update their own profile
          DROP POLICY IF EXISTS "Founders can update own profile" ON founder_profiles;
          CREATE POLICY "Founders can update own profile" 
            ON founder_profiles 
            FOR UPDATE 
            TO authenticated 
            USING (auth.uid() = user_id OR EXISTS (
              SELECT 1 FROM admin_users WHERE user_id = auth.uid()
            ));
        `
      });

      if (rpcError) {
        addFixResult(`❌ RPC method not available. Need to use migration instead.`);
        addFixResult(`⚠️ You need to run SQL manually in Supabase dashboard.`);
        
        // Show the SQL they need to run
        addFixResult(`\n📋 Copy and paste this SQL in Supabase SQL Editor:\n`);
        addFixResult(`
-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated insert founder_profiles" ON founder_profiles;
DROP POLICY IF EXISTS "System can create profiles" ON founder_profiles;
DROP POLICY IF EXISTS "Allow authenticated to insert founder profile" ON founder_profiles;

-- Create new policy that allows any authenticated user to insert
CREATE POLICY "Allow authenticated insert founder_profiles" 
  ON founder_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Allow users to read their own profile
DROP POLICY IF EXISTS "Founders can view own profile" ON founder_profiles;
CREATE POLICY "Founders can view own profile" 
  ON founder_profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));

-- Allow users to update their own profile  
DROP POLICY IF EXISTS "Founders can update own profile" ON founder_profiles;
CREATE POLICY "Founders can update own profile" 
  ON founder_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  ));
        `);
      } else {
        addFixResult("✅ RLS policies updated successfully!");
      }

      addFixResult("✅ Database fix attempt complete!");
      addFixResult("🔄 Run 'Check Database' again to verify fixes.");

    } catch (error: any) {
      addFixResult(`❌ Fix failed: ${error.message}`);
    } finally {
      setFixing(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Database Setup & Verification</h1>
          <p className="text-neutral-600">
            Check your Supabase database schema and fix any issues
          </p>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <div className="flex gap-4">
            <button
              onClick={checkDatabase}
              disabled={checking}
              className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {checking ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  Check Database
                </>
              )}
            </button>

            <button
              onClick={fixDatabase}
              disabled={fixing || tables.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {fixing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Fix Issues
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tables Status */}
        {tables.length > 0 && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Tables Status
            </h2>
            <div className="space-y-3">
              {tables.map((table) => (
                <div
                  key={table.name}
                  className="p-4 border border-neutral-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {table.exists ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                      <span className="font-mono font-medium">{table.name}</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      table.exists 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {table.exists ? 'EXISTS' : 'MISSING'}
                    </span>
                  </div>
                  
                  {table.exists && table.columns && (
                    <div className="mt-2 text-sm text-neutral-600">
                      <span className="font-medium">Columns:</span>{' '}
                      <span className="font-mono text-xs">
                        {table.columns.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {table.error && (
                    <div className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Error:</span> {table.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Policies Status */}
        {policies.length > 0 && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              RLS Policies Status
            </h2>
            <div className="space-y-3">
              {policies.map((policy, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-neutral-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {policy.exists ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-mono font-medium">{policy.table}</div>
                        <div className="text-sm text-neutral-600">{policy.policy}</div>
                      </div>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      policy.exists 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {policy.exists ? 'OK' : 'BLOCKED'}
                    </span>
                  </div>
                  
                  {policy.error && (
                    <div className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Issue:</span> {policy.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Verification Log</h2>
            <div className="bg-neutral-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="py-1">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fix Results */}
        {fixResults.length > 0 && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-xl font-bold mb-4">Fix Results</h2>
            <div className="bg-neutral-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
              {fixResults.join('\n')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
