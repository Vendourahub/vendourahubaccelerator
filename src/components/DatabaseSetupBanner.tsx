import { AlertTriangle, ExternalLink } from 'lucide-react';

export function DatabaseSetupBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl border-b-4 border-red-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 flex-shrink-0 animate-pulse" />
            <div>
              <div className="font-bold text-lg">⚠️ Database Setup Required</div>
              <div className="text-red-100 text-sm">Your database tables are missing. The app will not work.</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto">
            <a
              href="https://supabase.com/dashboard/project/idhyjerrdrcaitfmbtjd/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors font-bold whitespace-nowrap shadow-lg"
            >
              <ExternalLink className="w-4 h-4" />
              Open SQL Editor
            </a>
            <a
              href="/admin/profile"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-bold whitespace-nowrap"
            >
              View Instructions
            </a>
          </div>
        </div>
        <div className="mt-3 text-sm text-red-100">
          <strong>Quick Fix:</strong> Copy <code className="bg-red-800 px-2 py-0.5 rounded">/QUICK_FIX.sql</code> → Paste in SQL Editor → Click RUN → Refresh page
        </div>
      </div>
    </div>
  );
}
