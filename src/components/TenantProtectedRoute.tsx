import { Navigate, Outlet } from "react-router-dom";
import { useTenantAuthStore } from "../store/useTenantAuthStore";

const TenantProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useTenantAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/tenant/login" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default TenantProtectedRoute;
