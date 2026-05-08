import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router-dom";
import Home from "./components/Home.tsx";
import { Toaster } from "sonner";
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


// Tenant Portal Components
import TenantProtectedRoute from "./components/TenantProtectedRoute";
import TenantLogin from "./pages/tenant/TenantLogin";
import TenantLayout from "./components/layout/TenantLayout";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantInvoices from "./pages/tenant/TenantInvoices";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";

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
        path: "maintenance",
        element: <Maintenance />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },

  // ৩. টেনেন্ট পোর্টাল রাউট
  {
    path: "/tenant/login",
    element: <TenantLogin />,
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
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
