import React from 'react';
import { Link } from 'react-router';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-neutral-950"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
    >
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-16 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 left-1/4 w-[28rem] h-[28rem] bg-sky-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl w-full">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl shadow-2xl">
          <div className="grid lg:grid-cols-[1.1fr,1fr] gap-0">
            <div className="p-8 md:p-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 text-white/80 text-xs uppercase tracking-[0.2em]">
                Lost Route
              </div>
              <div className="mt-6 text-[5.5rem] leading-none font-bold text-white">
                404
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl text-white font-bold">
                This page slipped off the map.
              </h1>
              <p className="mt-3 text-white/70 text-lg">
                The link you followed doesn’t exist or has been moved. Let’s get you back to the accelerator.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.history.back()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/90 hover:border-white/40 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
                <Link
                  to="/"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 transition-colors font-semibold"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white/80 hover:border-white/40 hover:bg-white/10 transition-colors"
                >
                  <div className="text-sm font-semibold text-white">Founder Login</div>
                  <div className="text-xs text-white/60">Sign in to your dashboard</div>
                </Link>
                <Link
                  to="/apply"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white/80 hover:border-white/40 hover:bg-white/10 transition-colors"
                >
                  <div className="text-sm font-semibold text-white">Apply to Vendoura</div>
                  <div className="text-xs text-white/60">Join the accelerator</div>
                </Link>
                <Link
                  to="/founder/dashboard"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white/80 hover:border-white/40 hover:bg-white/10 transition-colors"
                >
                  <div className="text-sm font-semibold text-white">Dashboard</div>
                  <div className="text-xs text-white/60">Track your progress</div>
                </Link>
                <Link
                  to="/admin"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white/80 hover:border-white/40 hover:bg-white/10 transition-colors"
                >
                  <div className="text-sm font-semibold text-white">Admin Portal</div>
                  <div className="text-xs text-white/60">Administrator access</div>
                </Link>
              </div>
            </div>

            <div className="p-8 md:p-12 border-t border-white/10 lg:border-t-0 lg:border-l">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 md:p-8">
                <div className="flex items-center gap-3 text-white/80">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Search className="w-6 h-6 text-white/80" />
                  </div>
                  <div>
                    <div className="text-sm uppercase tracking-[0.2em]">Need help?</div>
                    <div className="text-xl font-semibold text-white">Try a quick jump</div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-white/80">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Visit the landing page</div>
                      <div className="text-xs text-white/60">Learn about Vendoura and the 12-week system.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-amber-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Open your dashboard</div>
                      <div className="text-xs text-white/60">Jump into weekly commits and execution logs.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-sky-300" />
                    <div>
                      <div className="text-sm font-semibold text-white">Contact support</div>
                      <div className="text-xs text-white/60">If you were sent here from an email, tell us.</div>
                    </div>
                  </div>
                </div>

                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm"
                >
                  <Home className="w-4 h-4" />
                  Go to main site
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-white/60 text-xs tracking-[0.2em] uppercase">
          Vendoura Accelerator
        </div>
      </div>
    </div>
  );
}