import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, Wrench, Menu, X, LogOut, Sun, Moon, Building2, PenTool } from "lucide-react";
import { useTenantAuthStore } from "../../store/useTenantAuthStore";
import { useThemeStore } from "../../store/useThemeStore";
import { useSocket } from "../../Hook/useSocket";
import NotificationBell from "../ui/NotificationBell";

const TenantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { tenant, logout } = useTenantAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  useSocket(); // 🔌 Tenant-এর জন্য সকেট কানেকশন শুরু

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    setSidebarOpen(false); // Close sidebar on route change (mobile)
  }, [location.pathname]);

  const navItems = [
    { name: "ড্যাশবোর্ড", path: "/tenant/dashboard", icon: LayoutDashboard },
    { name: "আমার বিল", path: "/tenant/invoices", icon: Receipt },
    { name: "মেইনটেন্যান্স", path: "/tenant/maintenance", icon: Wrench },
    { name: "ভাড়া চুক্তিপত্র", path: "/tenant/agreement", icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface-container-lowest border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
             <Building2 size={18} className="text-primary" />
           </div>
           <span className="font-black text-on-surface">Bari Bhara</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-on-surface-variant">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-surface-container-lowest border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
               <Building2 size={22} className="text-primary" />
             </div>
             <div>
                <h2 className="font-black text-on-surface text-lg">Bari Bhara</h2>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tenant Portal</p>
             </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-on-surface-variant hover:text-on-surface">
            <X size={20} />
          </button>
        </div>

        {/* Tenant Profile Mini */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-xl font-bold text-primary overflow-hidden">
              {tenant?.photo ? (
                <img src={tenant.photo} alt={tenant.name} className="w-full h-full object-cover" />
              ) : (
                tenant?.name?.charAt(0)
              )}
            </div>
            <div>
              <p className="font-bold text-on-surface">{tenant?.name}</p>
              <p className="text-xs text-on-surface-variant">{tenant?.phone}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer (Theme Toggle & Logout) */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-on-surface-variant hover:bg-surface-container transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? "লাইট মোড" : "ডার্ক মোড"}
          </button>
          
          <button
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut size={20} />
            লগআউট
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <main className="p-4 lg:p-8 max-w-6xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TenantLayout;
