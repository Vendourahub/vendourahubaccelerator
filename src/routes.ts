import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing";
import Application from "./pages/Application";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import AuthCallback from "./pages/AuthCallback";
import Debug from "./pages/Debug";
// import Waitlist from "./pages/Waitlist";
import FounderLayout from "./pages/FounderLayout";
import Dashboard from "./pages/Dashboard";
import Commit from "./pages/Commit";
import Execute from "./pages/Execute";
import Report from "./pages/Report";
import Map from "./pages/Map";
import RSD from "./pages/RSD";
import Calendar from "./pages/Calendar";
import Community from "./pages/Community";
import FounderProfile from "./pages/FounderProfile";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import MentorDashboard from "./pages/admin/MentorDashboard";
import CohortOverview from "./pages/admin/CohortOverview";
import FounderDetail from "./pages/admin/FounderDetail";
import RevenueAnalytics from "./pages/admin/RevenueAnalytics";
import InterventionPanel from "./pages/admin/InterventionPanel";
import DataTracking from "./pages/admin/DataTracking";
import AdminAccounts from "./pages/admin/AdminAccounts";
import DevVault from "./pages/admin/DevVault";
import AdminProfile from "./pages/admin/AdminProfile";
import SubscriptionManagement from "./pages/admin/SubscriptionManagement";
import FounderSubscriptionDetail from "./pages/admin/FounderSubscriptionDetail";
import NotificationSetup from "./pages/admin/NotificationSetup";
import PaystackConfig from "./pages/admin/PaystackConfig";
import FlutterwaveConfig from "./pages/admin/FlutterwaveConfig";
import ManageUsers from "./pages/admin/ManageUsers";
import SuperAdminControl from "./pages/admin/SuperAdminControl";
import SuperAdminDashboard from "./pages/admin/SuperAdminDashboard";
import ProgramManagerDashboard from "./pages/admin/ProgramManagerDashboard";
import ObserverDashboard from "./pages/admin/ObserverDashboard";
import DatabaseCheck from "./pages/admin/DatabaseCheck";
import DatabaseSetup from "./pages/admin/DatabaseSetup";
import DiagnoseProfile from "./pages/admin/DiagnoseProfile";
import AdminDetail from "./pages/admin/AdminDetail";
import CreateSuperAdmin from "./pages/CreateSuperAdmin";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <Landing />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/apply",
    element: <Application />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
    errorElement: <ErrorBoundary />,
  },
  // {
  //   path: "/waitlist",
  //   element: <Waitlist />,
  //   errorElement: <ErrorBoundary />,
  // },
  {
    path: "/debug",
    element: <Debug />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/create-super-admin",
    element: <CreateSuperAdmin />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
    errorElement: <ErrorBoundary />,
  },
  
  // Authenticated founder routes
  {
    path: "/founder",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />, // Default founder dashboard
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
  
  // Top-level founder routes (mapped to /commit, /execute, /report, /map, /rsd, /calendar, /community)
  {
    path: "/commit",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Commit />,
      },
    ],
  },
  {
    path: "/execute",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Execute />, // Placeholder - create Execute page later
      },
    ],
  },
  {
    path: "/report",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Report />, // Placeholder - create Report page later
      },
    ],
  },
  {
    path: "/map",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Map />, // Placeholder - create Map page later
      },
    ],
  },
  {
    path: "/rsd",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <RSD />, // Placeholder - create RSD page later
      },
    ],
  },
  {
    path: "/calendar",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Calendar />,
      },
    ],
  },
  {
    path: "/community",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Community />,
      },
    ],
  },
  {
    path: "/profile",
    element: <FounderLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <FounderProfile />,
      },
    ],
  },
  
  // Admin routes - /admin shows login if not authenticated, dashboard if authenticated
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <CohortOverview />, // Default admin dashboard
      },
      {
        path: "mentor",
        element: <MentorDashboard />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "cohort",
        element: <CohortOverview />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "founder/:id",
        element: <FounderDetail />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "analytics",
        element: <RevenueAnalytics />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "interventions",
        element: <InterventionPanel />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "tracking",
        element: <DataTracking />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "subscriptions",
        element: <SubscriptionManagement />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "subscription/:id",
        element: <FounderSubscriptionDetail />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "notifications",
        element: <NotificationSetup />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "accounts",
        element: <AdminAccounts />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "profile",
        element: <AdminProfile />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "vault",
        element: <DevVault />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "paystack",
        element: <PaystackConfig />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "flutterwave",
        element: <FlutterwaveConfig />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "manageusers",
        element: <ManageUsers />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "superadmin",
        element: <SuperAdminControl />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "databasecheck",
        element: <DatabaseCheck />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "databasesetup",
        element: <DatabaseSetup />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "createsuperadmin",
        element: <CreateSuperAdmin />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "diagnoseprofile",
        element: <DiagnoseProfile />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "superadmindashboard",
        element: <SuperAdminDashboard />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "programmanagerdashboard",
        element: <ProgramManagerDashboard />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "observerdashboard",
        element: <ObserverDashboard />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "admindetail/:id",
        element: <AdminDetail />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);