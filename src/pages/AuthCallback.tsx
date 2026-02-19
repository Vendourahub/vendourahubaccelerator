import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { getCurrentUser } from "../lib/authManager";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Completing authentication...");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (msg: string) => {
    console.log(msg);
    setDebugInfo(prev => [...prev, msg]);
  };

  useEffect(() => {
    let mounted = true;

    const completeAuth = async () => {
      try {
        addDebug("🔄 Auth Callback - Checking authentication...");
        
        // Get current authenticated user from localStorage
        const user = await getCurrentUser();
        
        addDebug(`📍 Current URL: ${window.location.href}`);
        addDebug(`👤 Current user: ${user?.email || 'none'}`);

        if (!user) {
          addDebug("❌ No authenticated user found");
          if (mounted) {
            setStatus("error");
            setMessage("Authentication failed. Please try logging in again.");
            setTimeout(() => navigate("/login"), 2000);
          }
          return;
        }

        if (mounted) {
          addDebug(`✅ User authenticated: ${user.email}`);
          setStatus("success");
          setMessage("Authentication successful!");
        }

        // Redirect based on user type
        setTimeout(() => {
          if (mounted) {
            if (user.user_type === 'admin') {
              addDebug("🔄 Redirecting admin to dashboard...");
              navigate("/admin/superadmindashboard", { replace: true });
            } else if (user.user_type === 'founder') {
              addDebug("🔄 Redirecting founder to dashboard...");
              navigate("/founder/dashboard", { replace: true });
            } else {
              addDebug("❌ Could not determine user type");
              navigate("/login", { replace: true });
            }
          }
        }, 1500);

      } catch (error: any) {
        console.error('Auth callback error:', error);
        addDebug(`❌ Error: ${error.message || error}`);
        
        if (mounted) {
          setStatus("error");
          setMessage("An error occurred. Please try again.");
          setTimeout(() => navigate("/login"), 3000);
        }
      }
    };

    completeAuth();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
          {/* Status Icon and Message */}
          {status === "processing" && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-neutral-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                {message}
              </h1>
            </>
          )}
          
          {status === "success" && (
            <>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">
                {message}
              </h1>
            </>
          )}
          
          {status === "error" && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-red-900 mb-2">
                {message}
              </h1>
            </>
          )}

          {/* Debug Info */}
          {debugInfo.length > 0 && (
            <div className="mt-6 pt-6 border-t border-neutral-200 text-left">
              <p className="text-xs font-semibold text-neutral-600 mb-2">Debug Info:</p>
              <div className="bg-neutral-50 rounded p-3 max-h-48 overflow-y-auto">
                {debugInfo.map((info, idx) => (
                  <p key={idx} className="text-xs text-neutral-600 font-mono mb-1">
                    {info}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}