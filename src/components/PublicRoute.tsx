import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const PublicRoute = ({children}: {children: React.ReactNode}) => {
    const isAuthenticated = useAuthStore((state)=> state.isAuthenticated)
    const hasHydrated = useAuthStore.persist.hasHydrated();

    // লোড হওয়ার আগে রিডাইরেক্ট বন্ধ রাখা
    if (!hasHydrated) return null;

    if(isAuthenticated){
        return <Navigate to="/dashboard" replace />
    }
    return children
}

export default PublicRoute