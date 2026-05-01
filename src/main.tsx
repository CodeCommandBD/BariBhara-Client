import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
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


const queryClient = new QueryClient();

const router = createBrowserRouter([
  // ১. পাবলিক রাউট (হোমপেজ, লগইন, রেজিস্ট্রেশন - এখানে সাইডবার থাকবে না)
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

  // ২. প্রোটেক্টেড রাউট (ড্যাশবোর্ড এবং অন্যান্য - এখানে সাইডবার + টপবার থাকবে)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard", // এটি হবে /dashboard
        element: <Dashboard />,
      },
      {
        path: "properties", // এটি হবে /properties
        element: <Properties />,
      },
      {
        path: "properties/:id", // এটি হবে /properties/:id
        element: <PropertyDetails />,
      },
      {
        path: "tenants",
        element: <Tenants />,
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
  </StrictMode>,
);
