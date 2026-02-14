// Protected Route Wrapper
// Verifies user access based on localStorage roles

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser, isFounderAuthenticated, isAdminAuthenticated } from '../lib/authManager';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireFounder?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin, 
  requireFounder, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, [requireAdmin, requireFounder]);

  function checkAccess() {
    try {
      const user = getCurrentUser();
      
      if (!user) {
        navigate(redirectTo);
        return;
      }

      // Admin check
      if (requireAdmin) {
        if (!isAdminAuthenticated()) {
          navigate(redirectTo + '?error=unauthorized');
          return;
        }
        setIsAuthorized(true);
      } 
      // Founder check
      else if (requireFounder) {
        if (!isFounderAuthenticated()) {
          navigate(redirectTo + '?error=unauthorized');
          return;
        }
        setIsAuthorized(true);
      } else {
        // Just check if user is authenticated
        setIsAuthorized(true);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error checking access:', error);
      navigate(redirectTo);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}