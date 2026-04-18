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

import { Link, useLocation } from "react-router-dom";

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
  return (
    <aside className="h-screen w-72 fixed left-0 top-0 border-r border-white/20 bg-white/70 backdrop-blur-xl shadow-[40px_0_60px_-15px_rgba(0,0,0,0.05)] z-50 flex flex-col p-6 justify-between">
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
          <button className="w-full bg-surface-container-low text-primary font-bold py-4 rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group">
            <PlusCircle
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            নতুন প্রপার্টি যোগ করুন
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

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-error hover:bg-error/5 transition-all">
            <LogOut size={20} />
            <span className="font-headline font-medium text-sm tracking-tight">
              লগআউট
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
