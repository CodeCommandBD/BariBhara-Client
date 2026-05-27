import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useTenantAuthStore } from "@/store/useTenantAuthStore";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  Settings,
  Receipt,
  Wrench,
  FileText,
  User,
  PenTool
} from "lucide-react";

const BottomNavigation = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const { tenant } = useTenantAuthStore();

  const isTenantRoute = location.pathname.startsWith("/tenant");

  // Define Landlord links
  const landlordItems = [
    { name: "হোম", path: "/dashboard", icon: LayoutDashboard },
    { name: "প্রপার্টি", path: "/properties", icon: Building2 },
    { name: "ভাড়াটিয়া", path: "/tenants", icon: Users },
    { name: "পেমেন্ট", path: "/rent", icon: CreditCard },
    { name: "সেটিংস", path: "/settings", icon: Settings },
  ];

  // Define Tenant links
  const tenantItems = [
    { name: "হোম", path: "/tenant/dashboard", icon: LayoutDashboard },
    { name: "বিল", path: "/tenant/invoices", icon: Receipt },
    { name: "অভিযোগ", path: "/tenant/maintenance", icon: Wrench },
    { name: "চুক্তি", path: "/tenant/agreement", icon: PenTool },
    { name: "প্রোফাইল", path: "/tenant/profile", icon: User },
  ];

  const items = isTenantRoute ? tenantItems : landlordItems;
  const hasAccess = isTenantRoute ? !!tenant : !!user;

  if (!hasAccess) return null;

  return (
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-40">
      <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-full px-4 py-3 shadow-2xl flex items-center justify-between gap-1 max-w-lg mx-auto transition-all duration-300">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex-1 flex flex-col items-center justify-center relative py-1 transition-all duration-300 group"
            >
              {/* Highlight pill behind the active item */}
              {isActive && (
                <div className="absolute inset-0 -my-1 mx-2 bg-gradient-to-r from-violet-600/30 to-primary/30 dark:from-violet-500/20 dark:to-primary/20 rounded-2xl blur-sm scale-110 animate-pulse-slow" />
              )}
              
              <div 
                className={`transition-all duration-300 ${
                  isActive 
                    ? "text-violet-400 scale-110 -translate-y-1 drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" 
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                <Icon size={20} className="stroke-[2]" />
              </div>

              <span 
                className={`text-[9px] mt-1 font-black transition-all duration-300 tracking-tighter ${
                  isActive 
                    ? "text-white opacity-100 font-extrabold" 
                    : "text-slate-500 opacity-80"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
