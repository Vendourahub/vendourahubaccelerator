import React from 'react';
import { useRouteError, Link, isRouteErrorResponse } from 'react-router';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();
  
  // Handle different error types
  let errorMessage = 'An unexpected error occurred';
  let errorStatus = 500;
  let errorDetails = '';

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText;
    if (error.status === 404) {
      errorMessage = 'Page Not Found';
      errorDetails = "The page you're looking for doesn't exist.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || '';
  }

  console.error('Route Error:', error);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 p-8 md:p-12">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          {/* Status */}
          <div className="text-center mb-4">
            <div className="text-6xl font-bold text-neutral-900 mb-2">
              {errorStatus}
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              {errorMessage}
            </h1>
            {errorDetails && (
              <p className="text-neutral-600">
                {errorDetails}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
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

          {/* Common Links */}
          <div className="mt-8 pt-8 border-t border-neutral-200">
            <p className="text-sm text-neutral-600 text-center mb-4">
              Looking for something else?
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link
                to="/login"
                className="text-center px-4 py-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Founder Login
              </Link>
              <Link
                to="/apply"
                className="text-center px-4 py-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Apply Now
              </Link>
              <Link
                to="/admin"
                className="text-center px-4 py-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Admin Login
              </Link>
              <Link
                to="/founder/dashboard"
                className="text-center px-4 py-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Dev Info */}
          {process.env.NODE_ENV === 'development' && errorDetails && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <details className="text-xs">
                <summary className="cursor-pointer text-neutral-600 hover:text-neutral-900 font-medium mb-2">
                  🔧 Developer Info
                </summary>
                <pre className="bg-neutral-900 text-green-400 p-4 rounded-lg overflow-auto max-h-64 text-[10px] leading-relaxed">
                  {errorDetails}
                </pre>
              </details>
            </div>
          )}
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