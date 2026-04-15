import { Navigate } from "react-router"
import { useAuthStore } from "@/store/useAuthStore"

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    if(!isAuthenticated){
        return <Navigate to="/login" replace />
    }
    return children
}

export default ProtectedRoute