import { useNavigate, useLocation, Outlet } from "react-router";
import { getCurrentUser, getCurrentFounder, signOut, AuthUser } from "../lib/authManager";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import React from "react";
import { Lock, LogOut, LayoutDashboard, Target, FileText, Map, BookOpen, Calendar, MessageSquare, AlertCircle, Menu, X, User as UserIcon } from "lucide-react";
import logoImage from '../assets/ffa6cb3f0d02afe82155542d62a0d3bbbbcaa910.png';
import ScrollToTop from "../components/ScrollToTop";

export default function FounderLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [founderData, setFounderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      
      if (!currentUser) {
        navigate("/login");
        return;
      }
      
      setUser(currentUser);
      
      // If user is admin, redirect to admin panel
      if (currentUser.user_type === 'admin') {
        navigate("/admin/cohort");
        return;
      }
      
      // Load full founder data
      const founder = await getCurrentFounder();
      if (founder) {
        setFounderData(founder);
        
        // Check if onboarding is complete
        if (!founder.onboarding_completed) {
          navigate("/onboarding");
          return;
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  // Show loading state while checking auth
  if (loading || !user || !founderData) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }
  
  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      {/* Top Header - Fixed */}
      <header className="bg-white border-b border-neutral-200 flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-8 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-neutral-600" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-600" />
              )}
            </button>

            <Link to="/founder/dashboard" className="flex items-center gap-2">
              <img src={logoImage} alt="Vendoura Hub" className="h-6 sm:h-7" />
            </Link>
            <div className="hidden sm:block text-xs sm:text-sm text-neutral-600 truncate">
              Week {founderData.current_week || 1} of 12 · {founderData.current_stage || 'Stage 1'}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6">
            {founderData.is_locked && (
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-50 border border-red-200 rounded-lg text-xs sm:text-sm text-red-700">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium hidden md:inline">Locked</span>
              </div>
            )}
            
            <Link to="/profile" className="hidden md:flex items-center gap-3 hover:bg-neutral-100 rounded-lg py-1.5 px-3 transition-colors">
              <div className="text-sm text-right">
                <div className="font-medium">{founderData.name}</div>
                <div className="text-neutral-600 text-xs">{founderData.business_name}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {founderData.name ? founderData.name.charAt(0).toUpperCase() : 'F'}
              </div>
            </Link>
            
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Mobile Week Info */}
        <div className="sm:hidden px-4 pb-3 text-xs text-neutral-600 border-t border-neutral-100 pt-2">
          Week {founderData.current_week || 1} of 12 · {founderData.current_stage || 'Stage 1'}
          {founderData.is_locked && (
            <span className="ml-3 text-red-600 font-medium">
              <Lock className="w-3 h-3 inline mr-1" />
              Account Locked
            </span>
          )}
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 flex gap-4 lg:gap-8">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl border border-neutral-200 p-4 sticky top-8">
              <div className="space-y-1">
                <NavItem 
                  to="/founder/dashboard"
                  icon={<LayoutDashboard className="w-5 h-5" />}
                  label="Dashboard"
                  active={isActive("/founder/dashboard")}
                />
                
                <NavItem 
                  to="/commit"
                  icon={<Target className="w-5 h-5" />}
                  label="Weekly Commit"
                  active={isActive("/commit")}
                  badge={(founderData.current_week || 1) === 1 ? "Start Here" : undefined}
                />
                
                <NavItem 
                  to="/execute"
                  icon={<FileText className="w-5 h-5" />}
                  label="Execution Log"
                  active={isActive("/execute")}
                />
                
                <NavItem 
                  to="/report"
                  icon={<FileText className="w-5 h-5" />}
                  label="Revenue Report"
                  active={isActive("/report")}
                />
                
                <div className="h-px bg-neutral-200 my-4" />
                
                <NavItem 
                  to="/map"
                  icon={<Map className="w-5 h-5" />}
                  label="Revenue Map"
                  active={isActive("/map")}
                />
                
                <NavItem 
                  to="/rsd"
                  icon={<BookOpen className="w-5 h-5" />}
                  label="System Document"
                  active={isActive("/rsd")}
                  locked={parseInt(founderData.current_stage?.replace('stage_', '') || '1') < 4}
                />
                
                <NavItem 
                  to="/calendar"
                  icon={<Calendar className="w-5 h-5" />}
                  label="Calendar"
                  active={isActive("/calendar")}
                />
                
                <NavItem 
                  to="/community"
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="Community"
                  active={isActive("/community")}
                />

                <div className="h-px bg-neutral-200 my-4" />

                <NavItem 
                  to="/profile"
                  icon={<UserIcon className="w-5 h-5" />}
                  label="My Profile"
                  active={isActive("/profile")}
                />
              </div>
            </nav>
          </aside>

          {/* Mobile Sidebar - Overlay */}
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              {/* Sidebar */}
              <aside className="lg:hidden fixed left-0 top-[69px] sm:top-[73px] bottom-0 w-64 bg-white border-r border-neutral-200 z-50 overflow-y-auto">
                <nav className="p-4">
                  <div className="space-y-1">
                    <NavItem 
                      to="/founder/dashboard"
                      icon={<LayoutDashboard className="w-5 h-5" />}
                      label="Dashboard"
                      active={isActive("/founder/dashboard")}
                    />
                    
                    <NavItem 
                      to="/commit"
                      icon={<Target className="w-5 h-5" />}
                      label="Weekly Commit"
                      active={isActive("/commit")}
                      badge={(founderData.current_week || 1) === 1 ? "Start Here" : undefined}
                    />
                    
                    <NavItem 
                      to="/execute"
                      icon={<FileText className="w-5 h-5" />}
                      label="Execution Log"
                      active={isActive("/execute")}
                    />
                    
                    <NavItem 
                      to="/report"
                      icon={<FileText className="w-5 h-5" />}
                      label="Revenue Report"
                      active={isActive("/report")}
                    />
                    
                    <div className="h-px bg-neutral-200 my-4" />
                    
                    <NavItem 
                      to="/map"
                      icon={<Map className="w-5 h-5" />}
                      label="Revenue Map"
                      active={isActive("/map")}
                    />
                    
                    <NavItem 
                      to="/rsd"
                      icon={<BookOpen className="w-5 h-5" />}
                      label="System Document"
                      active={isActive("/rsd")}
                      locked={parseInt(founderData.current_stage?.replace('stage_', '') || '1') < 4}
                    />
                    
                    <NavItem 
                      to="/calendar"
                      icon={<Calendar className="w-5 h-5" />}
                      label="Calendar"
                      active={isActive("/calendar")}
                    />
                    
                    <NavItem 
                      to="/community"
                      icon={<MessageSquare className="w-5 h-5" />}
                      label="Community"
                      active={isActive("/community")}
                    />

                    <div className="h-px bg-neutral-200 my-4" />

                    <NavItem 
                      to="/profile"
                      icon={<UserIcon className="w-5 h-5" />}
                      label="My Profile"
                      active={isActive("/profile")}
                    />

                    {/* Mobile User Info */}
                    <div className="md:hidden pt-4 mt-4 border-t border-neutral-200">
                      <div className="px-4 py-2 text-sm">
                        <div className="font-medium text-neutral-900">{founderData.name}</div>
                        <div className="text-neutral-600 text-xs">{founderData.business_name}</div>
                      </div>
                    </div>
                  </div>
                </nav>
              </aside>
            </>
          )}
          
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <ScrollToTop />
            {founderData.is_locked && (
              <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-red-900 mb-1 text-sm sm:text-base">Account Locked</div>
                    <div className="text-xs sm:text-sm text-red-700">{founderData.lockReason || "You missed a required deadline."}</div>
                    <Link to="/founder/dashboard" className="text-xs sm:text-sm text-red-900 underline mt-2 inline-block">
                      View unlock instructions
                    </Link>
                  </div>
                </div>
              </div>
            )}
            
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavItem({ 
  to, 
  icon, 
  label, 
  active, 
  badge,
  locked = false 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  active: boolean;
  badge?: string;
  locked?: boolean;
}) {
  if (locked) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-400 cursor-not-allowed">
        {icon}
        <span className="flex-1">{label}</span>
        <Lock className="w-4 h-4" />
      </div>
    );
  }
  
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
        active 
          ? 'bg-neutral-900 text-white' 
          : 'text-neutral-700 hover:bg-neutral-100'
      }`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
          {badge}
        </span>
      )}
    </Link>
  );
}