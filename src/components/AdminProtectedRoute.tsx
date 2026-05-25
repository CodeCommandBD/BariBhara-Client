import { useAuthStore } from "@/store/useAuthStore";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore((state) => state);
  const location = useLocation();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  useEffect(() => {
    if (hasHydrated && isAuthenticated && user && user.role !== "admin") {
      toast.error("আপনার এই পেজটি অ্যাক্সেস করার অনুমতি নেই! 🚫");
    }
  }, [hasHydrated, isAuthenticated, user]);

  if (!hasHydrated) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    // If landlord, redirect to landlord dashboard. If tenant, redirect to tenant dashboard
    if (user?.role === "tenant") {
      return <Navigate to="/tenant/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
