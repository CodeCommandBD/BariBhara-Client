import { useUIStore } from "@/store/useUIStore";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Wrench,
  BarChart3,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const navItems = [
  { icon: LayoutDashboard, label: "ড্যাশবোর্ড", path: "/dashboard" },
  { icon: Building2, label: "প্রপার্টিসমূহ", path: "/properties" },
  { icon: Users, label: "ভাড়াটিয়া", path: "/tenants" },
  { icon: CreditCard, label: "পেমেন্ট", path: "/payments" },
  { icon: Wrench, label: "মেইনটেন্যান্স", path: "/maintenance" },
  { icon: BarChart3, label: "রিপোর্ট", path: "/reports" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAddPropertyModal } = useUIStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* --- Desktop Sidebar --- */}
      <aside className="h-screen w-72 fixed left-0 top-0 z-50 lg:flex hidden flex-col p-6 justify-between
        bg-white/80 dark:bg-slate-900/95
        border-r border-slate-100 dark:border-slate-700/60
        backdrop-blur-xl
        shadow-[40px_0_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[40px_0_60px_-15px_rgba(0,0,0,0.3)]
        transition-colors duration-300">

        <div className="space-y-8">
          {/* লোগো */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bari Bhara
            </span>
          </div>

          {/* নেভিগেশন */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all hover:scale-[1.02] ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-headline font-medium text-sm tracking-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* নতুন প্রপার্টি বাটন */}
          <div className="pt-2 px-2">
            <button
              onClick={openAddPropertyModal}
              className="w-full bg-primary/10 dark:bg-primary/20 text-primary font-bold py-4 rounded-xl
                hover:bg-primary hover:text-white dark:hover:bg-primary
                transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <PlusCircle size={20} className="group-hover:scale-110 transition-transform" />
              নতুন প্রপার্টি
            </button>
          </div>
        </div>

        {/* নিচের সেটিংস ও লগআউট */}
        <div className="space-y-1 border-t border-slate-100 dark:border-slate-700 pt-5">
          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all hover:scale-[1.02] ${
              location.pathname === "/settings"
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Settings size={20} />
            <span className="font-headline font-medium text-sm tracking-tight">সেটিংস</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl
              text-red-500 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20
              transition-all"
          >
            <LogOut size={20} />
            <span className="font-headline font-medium text-sm tracking-tight">লগআউট</span>
          </button>
        </div>
      </aside>

      {/* --- Mobile Bottom Nav --- */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-20
        bg-white/90 dark:bg-slate-900/95
        backdrop-blur-2xl
        border border-white/20 dark:border-slate-700/60
        rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)]
        z-[100] flex items-center justify-between px-6
        transition-colors duration-300">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all ${
                isActive
                  ? "text-primary scale-110"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${isActive ? "opacity-100" : "opacity-0"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={openAddPropertyModal}
          className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30"
        >
          <PlusCircle size={24} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
