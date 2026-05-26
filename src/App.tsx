import { Outlet, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import PublicFooter from "./components/layout/PublicFooter"
import { useSocket } from "./Hook/useSocket"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"

const App = () => {
  const { user, token, setAuth } = useAuthStore();
  const location = useLocation();
  
  useSocket(); // 🔌 public pages এবং Home-এ সকেট কানেকশন সচল রাখা

  // Sync user profile state from server on app load to prevent stale LocalStorage states
  useEffect(() => {
    const syncProfile = async () => {
      if (!token || !user) return;
      try {
        const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/profile/me`, {
          headers: { Authorization: authHeader }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setAuth(data.user, token);
          }
        }
      } catch (err) {
        console.error("Failed to sync profile on app load:", err);
      }
    };
    syncProfile();
  }, [token, setAuth]);

  const hideNavbar = location.pathname.startsWith("/property/");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export default App