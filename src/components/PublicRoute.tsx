import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const PublicRoute = ({children}: {children: React.ReactNode}) => {
    const { isAuthenticated, user } = useAuthStore((state) => state);
    const hasHydrated = useAuthStore.persist.hasHydrated();

    // লোড হওয়ার আগে রিডাইরেক্ট বন্ধ রাখা
    if (!hasHydrated) return null;

    if (isAuthenticated) {
        // Role অনুযায়ী সঠিক ড্যাশবোর্ডে পাঠানো
        if (user?.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

export default PublicRoute;