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
  Home,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const Sidebar = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { openAddPropertyModal } = useUIStore();
  const { logout } = useAuthStore();

  const handleAddPropertyClick = () => {
    if (user?.role === "landlord" && user?.subscriptionStatus !== "active") {
      toast.error("আপনার ড্যাশবোর্ডটি বর্তমানে লকড রয়েছে! নতুন প্রপার্টি যুক্ত করতে দয়া করে আগে সাবস্ক্রাইব করুন।");
      return;
    }
    openAddPropertyModal();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const baseNavItems = [
    { icon: LayoutDashboard, label: "ড্যাশবোর্ড", path: "/dashboard" },
    { icon: Building2, label: "প্রপার্টিসমূহ", path: "/properties" },
    { icon: Users, label: "ভাড়াটিয়া", path: "/tenants" },
    { icon: CreditCard, label: "পেমেন্ট", path: "/payments" },
    { icon: Wrench, label: "মেইনটেন্যান্স", path: "/maintenance" },
    { icon: BarChart3, label: "রিপোর্ট", path: "/reports" },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin/dashboard" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: CreditCard, label: "Subscriptions", path: "/admin/subscriptions" },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : baseNavItems;

  return (
    <>
      {/* --- Desktop & Tablet Sidebar --- */}
      <aside className="h-screen w-24 lg:w-72 fixed left-0 top-0 z-50 md:flex hidden flex-col p-4 lg:p-6 justify-between
        bg-white/80 dark:bg-slate-900/95
        border-r border-slate-100 dark:border-slate-700/60
        backdrop-blur-xl
        shadow-[40px_0_60px_-15px_rgba(0,0,0,0.05)] dark:shadow-[40px_0_60px_-15px_rgba(0,0,0,0.3)]
        transition-all duration-300">

        <div className="space-y-8">
          {/* লোগো */}
          <div className="flex items-center justify-center lg:justify-start gap-3 px-2 pt-2">
            <Building2 size={24} className="text-primary shrink-0" />
            <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden lg:inline">
              Bari Bhara
            </span>
          </div>

          {/* নেভিগেশন */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              const isLocked = item.path === "/reports" && user?.role === "landlord" && user?.subscriptionPlan === "free";

              if (isLocked) {
                return (
                  <button
                    key={item.label}
                    onClick={() => toast.error("রিপোর্ট ও এনালিটিক্স অপশনটি শুধুমাত্র প্রো প্ল্যানের জন্য প্রযোজ্য। দয়া করে প্রো প্ল্যানে আপগ্রেড করুন!")}
                    className="w-full flex items-center justify-center lg:justify-between px-3 lg:px-4 py-3 rounded-2xl transition-all hover:scale-[1.02] text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer relative"
                    title={item.label}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-slate-400 shrink-0" />
                      <span className="font-headline font-medium text-sm tracking-tight hidden lg:inline">
                        {item.label}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[10px] lg:text-xs bg-violet-500/10 text-violet-500 p-0.5 lg:p-1 rounded-md absolute -top-1 -right-1 lg:static">lock</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  title={item.label}
                  className={`flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-2xl transition-all hover:scale-[1.02] ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={20} className="shrink-0" />
                  <span className="font-headline font-medium text-sm tracking-tight hidden lg:inline">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* নতুন প্রপার্টি বাটন */}
          {user?.role !== "admin" && (
            <div className="pt-2 px-1 lg:px-2 flex justify-center">
              <button
                onClick={handleAddPropertyClick}
                className="w-12 h-12 lg:w-full lg:h-auto bg-primary/10 dark:bg-primary/20 text-primary font-bold lg:py-4 rounded-full lg:rounded-xl
                  hover:bg-primary hover:text-white dark:hover:bg-primary
                  transition-all duration-300 flex items-center justify-center gap-2 group"
                title="নতুন প্রপার্টি"
              >
                <PlusCircle size={20} className="group-hover:scale-110 transition-transform shrink-0" />
                <span className="hidden lg:inline text-sm">নতুন প্রপার্টি</span>
              </button>
            </div>
          )}
        </div>

        {/* নিচের সেটিংস ও লগআউট */}
        <div className="space-y-1 border-t border-slate-100 dark:border-slate-700 pt-5 flex flex-col items-stretch">
          <Link
            to="/"
            title="হোমপেজ"
            className="flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-2xl transition-all hover:scale-[1.02] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Home size={20} className="shrink-0" />
            <span className="font-headline font-medium text-sm tracking-tight hidden lg:inline">হোমপেজ</span>
          </Link>

          <Link
            to="/settings"
            title="সেটিংস"
            className={`flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-2xl transition-all hover:scale-[1.02] ${
              location.pathname === "/settings"
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Settings size={20} className="shrink-0" />
            <span className="font-headline font-medium text-sm tracking-tight hidden lg:inline">সেটিংস</span>
          </Link>

          <button
            onClick={handleLogout}
            title="লগআউট"
            className="w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-2xl
              text-red-500 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20
              transition-all cursor-pointer"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="font-headline font-medium text-sm tracking-tight hidden lg:inline">লগআউট</span>
          </button>
        </div>
      </aside>

      {/* --- Mobile Bottom Nav --- */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-20
        bg-white/90 dark:bg-slate-900/95
        backdrop-blur-2xl
        border border-white/20 dark:border-slate-700/60
        rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)]
        z-[100] flex items-center justify-between px-6
        transition-colors duration-300">
        {navItems.filter(item => item.path !== "/reports").map((item) => {
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
          onClick={handleAddPropertyClick}
          className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30"
        >
          <PlusCircle size={24} />
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
