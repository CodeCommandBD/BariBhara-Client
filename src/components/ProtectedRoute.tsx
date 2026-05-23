import { useAuthStore } from "@/store/useAuthStore"
import { useLocation, Navigate } from "react-router-dom"

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { isAuthenticated, user, logout } = useAuthStore((state) => state)
    const location = useLocation()
    const hasHydrated = useAuthStore.persist.hasHydrated();

    // লোড হওয়ার আগে রিডাইরেক্ট বন্ধ রাখা
    if (!hasHydrated) return null;
    
    if(!isAuthenticated){
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    if(user?.role === "tenant"){
        // Prevent legacy tenant accounts from accessing landlord dashboard
        logout();
        return <Navigate to="/tenant/login" replace />
    }

    // Allow landlords with any status to access dashboard layouts so MainLayout can render the premium locked overlay

    return children
}

export default ProtectedRoute