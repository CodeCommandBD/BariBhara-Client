import { Navigate } from "react-router"
import { useAuthStore } from "@/store/useAuthStore"

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { isAuthenticated, user, logout } = useAuthStore((state) => state)
    const hasHydrated = useAuthStore.persist.hasHydrated();

    // লোড হওয়ার আগে রিডাইরেক্ট বন্ধ রাখা
    if (!hasHydrated) return null;
    
    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }

    if(user?.role === "tenant"){
        // Prevent legacy tenant accounts from accessing landlord dashboard
        logout();
        return <Navigate to="/tenant/login" replace />
    }

    return children
}

export default ProtectedRoute