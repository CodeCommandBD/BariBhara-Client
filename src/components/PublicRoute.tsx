import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const PublicRoute = ({children}: {children: React.ReactNode}) => {
    const isAuthenticated = useAuthStore((state)=> state.isAuthenticated)
    // if already authenticated, redirect to dashboard
    if(isAuthenticated){
        return <Navigate to="/dashboard" replace />
    }
    return children
}

export default PublicRoute