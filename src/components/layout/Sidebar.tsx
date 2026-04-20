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
  { icon: Users, label: "ভাড়াটিয়া", path: "/tenants" },
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
      {/* --- Desktop Sidebar (বড় স্ক্রিনের জন্য) --- */}
      <aside className="h-screen w-72 fixed left-0 top-0 border-r border-white/20 bg-white/70 backdrop-blur-xl shadow-[40px_0_60px_-15px_rgba(0,0,0,0.05)] z-50 lg:flex hidden flex-col p-6 justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bari Bhara
            </span>
          </div>

          <nav className="space-y-2">
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
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  <Icon size={20}></Icon>
                  <span className="font-headline font-medium text-sm tracking-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 px-2">
            <button
              onClick={openAddPropertyModal}
              className="w-full bg-surface-container-low text-primary font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <PlusCircle
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              নতুন প্রপার্টি
            </button>
          </div>

          <div className="space-y-2 border-t border-surface-container pt-6">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-on-surface-variant hover:bg-surface-container-low transition-all"
            >
              <Settings size={20} />
              <span className="font-headline font-medium text-sm tracking-tight">
                সেটিংস
              </span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-error hover:bg-error/5 transition-all"
            >
              <LogOut size={20} />
              <span className="font-headline font-medium text-sm tracking-tight">
                লগআউট
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- Mobile/Tablet Bottom Navigation (ছোট স্ক্রিনের জন্য) --- */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-white/80 backdrop-blur-2xl border border-white/20 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[100] flex items-center justify-between px-6">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-2xl transition-all ${
                isActive ? "text-primary scale-110" : "text-slate-400"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] font-bold ${isActive ? "opacity-100" : "opacity-0"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* কুইক অ্যাড বাটন মোবাইলের জন্য */}
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
