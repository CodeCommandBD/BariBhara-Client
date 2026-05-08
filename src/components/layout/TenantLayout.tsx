import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, Wrench, Menu, X, LogOut, Sun, Moon, Building2 } from "lucide-react";
import { useTenantAuthStore } from "../../store/useTenantAuthStore";
import { useThemeStore } from "../../store/useThemeStore";

const TenantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { tenant, logout } = useTenantAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

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
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
             <Building2 size={18} className="text-primary" />
           </div>
           <span className="font-black text-slate-800 dark:text-white">Bari Bhara</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
               <Building2 size={22} className="text-primary" />
             </div>
             <div>
                <h2 className="font-black text-slate-800 dark:text-white text-lg">Bari Bhara</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tenant Portal</p>
             </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Tenant Profile Mini */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-primary overflow-hidden">
              {tenant?.photo ? (
                <img src={tenant.photo} alt={tenant.name} className="w-full h-full object-cover" />
              ) : (
                tenant?.name?.charAt(0)
              )}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{tenant?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tenant?.phone}</p>
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
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer (Theme Toggle & Logout) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? "লাইট মোড" : "ডার্ক মোড"}
          </button>
          
          <button
            onClick={() => {
              logout();
              window.location.href = "/tenant/login";
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
