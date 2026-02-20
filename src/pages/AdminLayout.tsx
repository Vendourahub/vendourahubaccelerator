import { useNavigate, useLocation, Outlet } from "react-router";
import { Link } from "react-router";
import { isAdminAuthenticated, getAdminRole, signOut, getCurrentAdmin } from "../lib/authManager";
import { Shield, Users, BarChart3, AlertTriangle, Database, UserCog, Lock, LogOut, Clock, CreditCard, Bell, User, Menu, X, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";
import { formatWATDateTime } from "../lib/time";
import AdminLogin from "./AdminLogin";
import logoImage from '../assets/ffa6cb3f0d02afe82155542d62a0d3bbbbcaa910.png';
import ScrollToTop from "../components/ScrollToTop";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isChecking, setIsChecking] = useState(true);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  // Check admin session on mount only (not on route changes)
  useEffect(() => {
    const checkSession = async () => {
      console.log('🔍 AdminLayout: Checking admin session on mount');
      const currentAdmin = await getCurrentAdmin();
      
      if (!currentAdmin) {
        console.log('⚠️ AdminLayout: No admin session found');
        setAdmin(null);
      } else {
        console.log('✅ AdminLayout: Admin session found:', currentAdmin.email);
        setAdmin(currentAdmin);
      }
      setIsChecking(false);
    };

    checkSession();
  }, []); // Empty dependency array - only run on mount

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Redirect to role-specific dashboard when landing on /admin
  useEffect(() => {
    if (admin && location.pathname === '/admin') {
      let redirectPath = '/admin/cohort'; // default
      
      switch (admin.admin_role) {
        case 'super_admin':
          redirectPath = '/admin/superadmindashboard';
          break;
        case 'program_manager':
          redirectPath = '/admin/programmanagerdashboard';
          break;
        case 'mentor':
          redirectPath = '/admin/mentor';
          break;
        case 'observer':
          redirectPath = '/admin/observerdashboard';
          break;
      }
      
      navigate(redirectPath, { replace: true });
    }
  }, [admin, location.pathname, navigate]);

  // If not authenticated, show login page
  if (isChecking) {
    // Show nothing or a loading spinner while checking
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-neutral-600">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (!admin) {
    console.log('⚠️ AdminLayout: No admin session, showing login page');
    return <AdminLogin />;
  }

  // Define permissions based on admin role
  const permissions = {
    viewFounders: true, // All admins can view founders
    exportData: admin.admin_role === 'super_admin' || admin.admin_role === 'program_manager',
    overrideLocks: admin.admin_role === 'super_admin' || admin.admin_role === 'program_manager',
    manageData: admin.admin_role === 'super_admin',
    manageAdmins: admin.admin_role === 'super_admin',
    manageSubscriptions: admin.admin_role === 'super_admin' || admin.admin_role === 'program_manager',
    manageNotifications: admin.admin_role === 'super_admin' || admin.admin_role === 'program_manager',
  };

  const handleLogout = async () => {
    console.log('🚪 Logging out admin...');
    await signOut();
    setAdmin(null); // Clear state immediately
    // Navigate to admin login
    navigate("/admin", { replace: true });
  };

  const navItems = [
    // Super Admin gets their own dashboard
    {
      path: "/admin/superadmindashboard",
      icon: <Shield className="w-5 h-5" />,
      label: "Super Admin Dashboard",
      permission: "manageAdmins",
      requireRole: "super_admin"
    },
    // Program Manager gets their own dashboard
    {
      path: "/admin/programmanagerdashboard",
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Program Manager Dashboard",
      permission: "exportData",
      requireRole: "program_manager"
    },
    // Mentor gets their mentor dashboard
    {
      path: "/admin/mentor",
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Mentor Dashboard",
      permission: "viewFounders",
      requireRole: "mentor"
    },
    // Observer gets their own dashboard
    {
      path: "/admin/observerdashboard",
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Observer Dashboard",
      permission: "viewFounders",
      requireRole: "observer"
    },
    {
      path: "/admin/cohort",
      icon: <Users className="w-5 h-5" />,
      label: "Cohort Overview",
      permission: "viewFounders"
    },
    {
      path: "/admin/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Revenue Analytics",
      permission: "exportData"
    },
    {
      path: "/admin/interventions",
      icon: <AlertTriangle className="w-5 h-5" />,
      label: "Interventions",
      permission: "overrideLocks"
    },
    {
      path: "/admin/tracking",
      icon: <Database className="w-5 h-5" />,
      label: "Data Tracking",
      permission: "exportData"
    },
    {
      path: "/admin/subscriptions",
      icon: <CreditCard className="w-5 h-5" />,
      label: "Subscriptions",
      permission: "manageSubscriptions",
      divider: true
    },
    {
      path: "/admin/notifications",
      icon: <Bell className="w-5 h-5" />,
      label: "Notifications",
      permission: "manageNotifications",
      requireRole: "super_admin"
    },
    {
      path: "/admin/manageusers",
      icon: <Users className="w-5 h-5" />,
      label: "Manage Users",
      permission: "manageAdmins",
      requireRole: "super_admin"
    },
    {
      path: "/admin/superadmin",
      icon: <UserCog className="w-5 h-5" />,
      label: "Super Admin Control",
      permission: "manageAdmins",
      requireRole: "super_admin"
    },
    {
      path: "/admin/accounts",
      icon: <Shield className="w-5 h-5" />,
      label: "Admin Accounts",
      permission: "manageAdmins",
      requireRole: "super_admin"
    },
    {
      path: "/admin/profile",
      icon: <User className="w-5 h-5" />,
      label: "My Profile",
      permission: "viewFounders"
    },
    {
      path: "/admin/vault",
      icon: <Lock className="w-5 h-5" />,
      label: "Dev Vault",
      permission: "manageAdmins",
      requireRole: "super_admin",
    },
  ];

  const canAccessNav = (item: typeof navItems[0]) => {
    if (item.requireRole && admin.admin_role !== item.requireRole) {
      return false;
    }
    // Cast permission to correct type
    return permissions[item.permission as keyof typeof permissions];
  };

  const adminInitials = (admin.name || 'A')
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="h-screen flex flex-col bg-neutral-50 overflow-hidden">
      {/* Admin Header - Fixed */}
      <header className="bg-neutral-900 text-white border-b border-neutral-800 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-bold">Vendoura Admin</div>
                <div className="text-xs sm:text-sm text-neutral-400 truncate">
                  {admin.name} • {admin.admin_role.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-6">
              <div className="hidden md:flex items-center gap-2 text-xs sm:text-sm text-neutral-400">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{formatWATDateTime(currentTime)}</span>
              </div>
              {admin.profile_photo_url ? (
                <img
                  src={admin.profile_photo_url}
                  alt="Admin profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-neutral-700"
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-700 text-white flex items-center justify-center text-xs sm:text-sm font-bold border border-neutral-600">
                  {adminInitials}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation - Desktop */}
        <aside className="hidden lg:block w-64 bg-white border-r border-neutral-200 flex-shrink-0 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              if (!canAccessNav(item)) return null;
              
              const isActive = location.pathname === item.path;
              
              return (
                <div key={item.path}>
                  {item.divider && <div className="my-4 border-t border-neutral-200" />}
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </div>
              );
            })}
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
            <aside className="lg:hidden fixed left-0 top-[60px] sm:top-[68px] bottom-0 w-64 bg-white border-r border-neutral-200 z-50 overflow-y-auto">
              <nav className="p-4 space-y-1">
                {navItems.map((item) => {
                  if (!canAccessNav(item)) return null;
                  
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <div key={item.path}>
                      {item.divider && <div className="my-4 border-t border-neutral-200" />}
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-neutral-900 text-white"
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </div>
                  );
                })}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <ScrollToTop />
          <Outlet />
        </main>
      </div>
    </div>
  );
}