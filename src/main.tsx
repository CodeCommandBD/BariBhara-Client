import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "./components/Home.tsx";
import { Toaster } from "sonner";
import ConfirmModal from "./components/modals/ConfirmModal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import PublicRoute from "./components/PublicRoute.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails.tsx";
import Tenants from "./pages/Tenants.tsx";
import RentManagement from "./pages/RentManagement";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Reviews from "./pages/Reviews.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import PaymentPage from "./pages/PaymentPage.tsx";
import AdminSubscriptions from "./pages/AdminSubscriptions.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.tsx";
import SearchResults from "./pages/SearchResults";
import PublicPropertyDetail from "./pages/PublicPropertyDetail";
import AdminRevenue from "./pages/admin/AdminRevenue.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import AdminPlans from "./pages/admin/AdminPlans.tsx";
import TermsPrivacy from "./pages/TermsPrivacy";
import SavedProperties from "./pages/SavedProperties";
// Tenant Portal Components
import TenantProtectedRoute from "./components/TenantProtectedRoute";
import TenantLogin from "./pages/tenant/TenantLogin";
import TenantLayout from "./components/layout/TenantLayout";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantInvoices from "./pages/tenant/TenantInvoices";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";
import TenantAgreement from "./pages/tenant/TenantAgreement";
import TenantProfile from "./pages/tenant/TenantProfile";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // ১. পাবলিক রাউট (হোমপেজ, লগইন, রেজিস্ট্রেশন)
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "search",
        element: <SearchResults />,
      },
      {
        path: "property/:id",
        element: <PublicPropertyDetail />,
      },
      {
        path: "saved-properties",
        element: <SavedProperties />,
      },
      {
        path: "terms-privacy",
        element: <TermsPrivacy />,
      },
    ],
  },
  {
    path: "/register",
    element: <PublicRoute><Register /></PublicRoute>,
  },
  {
    path: "/login",
    element: <PublicRoute><Login /></PublicRoute>,
  },
  {
    path: "/forgot-password",
    element: <PublicRoute><ForgotPassword /></PublicRoute>,
  },
  {
    path: "/reset-password",
    element: <PublicRoute><ResetPassword /></PublicRoute>,
  },

  // ২. ল্যান্ডলর্ড প্রোটেক্টেড রাউট
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "properties",
        element: <Properties />,
      },
      {
        path: "properties/:id",
        element: <PropertyDetails />,
      },
      {
        path: "tenants",
        element: <Tenants />,
      },
      {
        path: "payments",
        element: <RentManagement />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "maintenance",
        element: <Maintenance />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
    ],
  },
  {
    path: "/payment/:plan",
    element: (
      <ProtectedRoute>
        <PaymentPage />
      </ProtectedRoute>
    ),
  },

  // ৩. অ্যাডমিন রাউট — শুধুমাত্র role=admin হলে অ্যাক্সেস পাবে
  {
    path: "/admin",
    element: (
      <AdminProtectedRoute>
        <MainLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "subscriptions",
        element: <AdminSubscriptions />,
      },
      {
        path: "revenue",
        element: <AdminRevenue />,
      },
      {
        path: "analytics",
        element: <AdminAnalytics />,
      },
      {
        path: "plans",
        element: <AdminPlans />,
      },
    ],
  },

  {
    path: "/tenant",
    element: (
      <TenantProtectedRoute>
        <TenantLayout />
      </TenantProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <TenantDashboard />,
      },
      {
        path: "invoices",
        element: <TenantInvoices />,
      },
      {
        path: "maintenance",
        element: <TenantMaintenance />,
      },
      {
        path: "agreement",
        element: <TenantAgreement />,
      },
      {
        path: "profile",
        element: <TenantProfile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-right" richColors />
        <ConfirmModal />
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
