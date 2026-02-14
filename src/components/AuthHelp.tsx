import { AlertCircle, HelpCircle, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function AuthHelp() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowHelp(!showHelp)}
        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
        <span>Having trouble logging in?</span>
      </button>

      {showHelp && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-2">
              <p className="font-semibold text-blue-900">Common Issues:</p>
              
              <div className="space-y-2 text-blue-800">
                <div>
                  <p className="font-medium">❌ "Invalid login credentials"</p>
                  <p className="text-xs mt-1">
                    <strong>Solution:</strong> No test users exist yet. Create them using one of these methods:
                  </p>
                  <ul className="text-xs mt-1 ml-4 list-disc space-y-1">
                    <li>
                      <strong>Quick Fix:</strong> Run <code className="bg-blue-100 px-1 rounded">/CREATE_TEST_USERS.sql</code> in{" "}
                      <a 
                        href="https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/sql/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline inline-flex items-center gap-1"
                      >
                        Supabase SQL Editor
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      <strong>For Founders:</strong> Go to <a href="/apply" className="underline">/apply</a> and create an account
                    </li>
                    <li>
                      <strong>Manual:</strong> Create users in{" "}
                      <a 
                        href="https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/users"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline inline-flex items-center gap-1"
                      >
                        Supabase Auth
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium">📧 "Email not confirmed"</p>
                  <p className="text-xs mt-1">
                    <strong>Solution:</strong> Disable email confirmation in{" "}
                    <a 
                      href="https://supabase.com/dashboard/project/knqbtdugvessaehgwwcg/auth/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline inline-flex items-center gap-1"
                    >
                      Supabase Auth Settings
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {" "}(uncheck "Confirm email" under Email Auth)
                  </p>
                </div>

                <div>
                  <p className="font-medium">🔒 "Access denied" (Admin login)</p>
                  <p className="text-xs mt-1">
                    <strong>Solution:</strong> Account exists but isn't in the admin_users table. Run the SQL script above.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="font-semibold text-blue-900">Test Credentials (after running SQL):</p>
                <div className="mt-2 space-y-1 text-xs font-mono bg-blue-100 p-2 rounded">
                  <p><strong>Admin:</strong> admin@vendoura.com / VendouraAdmin2026!</p>
                  <p><strong>Founder:</strong> founder@test.com / Test1234!</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs">
                  📖 See <code className="bg-blue-100 px-1 rounded">/AUTH_FIX_GUIDE.md</code> for detailed instructions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
