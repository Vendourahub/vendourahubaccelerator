import React from 'react';
import { Link } from 'react-router';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 404 Card */}
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8 md:p-12">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-neutral-400" />
          </div>

          {/* 404 Message */}
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-neutral-900 mb-4">
              404
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">
              Page Not Found
            </h1>
            <p className="text-neutral-600 text-lg">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-neutral-300 rounded-lg hover:border-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>

          {/* Popular Links */}
          <div className="pt-8 border-t border-neutral-200">
            <h2 className="font-semibold text-neutral-900 mb-4 text-center">
              Popular Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/login"
                className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <div className="font-semibold text-neutral-900 mb-1">
                  Founder Login
                </div>
                <div className="text-sm text-neutral-600">
                  Sign in to your dashboard
                </div>
              </Link>
              
              <Link
                to="/apply"
                className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <div className="font-semibold text-neutral-900 mb-1">
                  Apply to Vendoura
                </div>
                <div className="text-sm text-neutral-600">
                  Join the accelerator
                </div>
              </Link>
              
              <Link
                to="/founder/dashboard"
                className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <div className="font-semibold text-neutral-900 mb-1">
                  Dashboard
                </div>
                <div className="text-sm text-neutral-600">
                  View your progress
                </div>
              </Link>
              
              <Link
                to="/admin"
                className="p-4 border border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <div className="font-semibold text-neutral-900 mb-1">
                  Admin Portal
                </div>
                <div className="text-sm text-neutral-600">
                  Administrator access
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center mt-8">
          <Link to="/" className="text-2xl font-bold text-neutral-900 hover:text-neutral-700 transition-colors">
            Vendoura
          </Link>
          <p className="text-sm text-neutral-600 mt-1">
            Revenue-focused accountability platform
          </p>
        </div>
      </div>
    </div>
  );
}