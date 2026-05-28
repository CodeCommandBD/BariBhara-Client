import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Menu, Sun, Moon, ChevronDown, User as UserIcon, LogOut, LayoutDashboard, X } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSavedPropertiesStore } from "@/store/useSavedPropertiesStore";

const Navbar = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const { user, token, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { savedProperties } = useSavedPropertiesStore();

  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    if (location.pathname === "/") {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${targetId}`);
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  // Fetch the latest subscription request to check for rejection reasons
  const { data: latestSub } = useQuery({
    queryKey: ["my-latest-subscription", user?.id, user?.subscriptionStatus],
    queryFn: async () => {
      if (!user || user.role !== "landlord") return null;
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/subscription/my-latest`, {
        headers: { 
          Authorization: token?.startsWith("Bearer ") ? token! : `Bearer ${token}` 
        },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.subscription;
    },
    enabled: !!user && user.role === "landlord",
    retry: false,
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const closeDropdown = () => setDropdownOpen(false);
    if (dropdownOpen) {
      window.addEventListener("click", closeDropdown);
    }
    return () => window.removeEventListener("click", closeDropdown);
  }, [dropdownOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled 
        ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 py-3 shadow-sm" 
        : "bg-transparent py-5"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Building2 className="text-white" size={22} />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bari Bhara
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">হোম</Link>
          <Link to="/search" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">বাসা খুঁজুন</Link>
          <a href="#features" onClick={(e) => handleNavClick(e, "features")} className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">ফিচার</a>
          <a href="#pricing" onClick={(e) => handleNavClick(e, "pricing")} className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">প্রাইসিং</a>
          <Link to="/saved-properties" className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5 relative">
            সেভড
            <span className={`material-symbols-outlined text-[16px] ${savedProperties.length > 0 ? "text-rose-500 fill-rose-500" : "text-slate-400"}`} style={{ fontVariationSettings: savedProperties.length > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
            {savedProperties.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-sm">
                {savedProperties.length}
              </span>
            )}
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-all active:scale-90"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="relative">
              {/* Profile Avatar Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-2 p-1 bg-surface-container hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95 border border-slate-200 dark:border-slate-800"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-violet-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                  {user.fullName[0].toUpperCase()}
                </div>
                <ChevronDown size={14} className={`text-on-surface-variant transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Glassmorphic Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dropdown
                  className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 transition-all duration-300 z-[110] animate-in fade-in slide-in-from-top-2"
                >
                  {/* User info header */}
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <p className="font-black text-slate-800 dark:text-slate-100 truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-500 truncate mb-2">{user.email}</p>
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary dark:text-primary-light font-bold rounded-md text-[10px] uppercase tracking-wide">
                      {user.role === "landlord" ? "বাড়িওয়ালা / Landlord" : user.role === "admin" ? "অ্যাডমিন / Admin" : "ভাড়াটিয়া / Tenant"}
                    </span>
                  </div>

                  {/* Actions List */}
                  <div className="space-y-1">
                    <Link 
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                      <LayoutDashboard size={16} className="text-primary" />
                      ড্যাশবোর্ড (Dashboard)
                    </Link>

                    <Link 
                      to="/dashboard" // Redirect to landlord profile inside their dashboard
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                    >
                      <UserIcon size={16} className="text-primary" />
                      আমার প্রোফাইল (Profile)
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all text-left border-t border-slate-100 dark:border-slate-800/50 mt-1 pt-2"
                    >
                      <LogOut size={16} />
                      লগআউট (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-on-surface hover:text-primary transition-colors">লগইন</Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                ফ্রি শুরু করুন
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-all active:scale-90"
            title="মেনু টগল"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 z-[90]">
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors py-2.5 border-b border-slate-100 dark:border-slate-900">হোম</Link>
            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors py-2.5 border-b border-slate-100 dark:border-slate-900">বাসা খুঁজুন</Link>
            <a href="#features" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, "features"); }} className="text-base font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors py-2.5 border-b border-slate-100 dark:border-slate-900">ফিচার</a>
            <a href="#pricing" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, "pricing"); }} className="text-base font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors py-2.5 border-b border-slate-100 dark:border-slate-900">প্রাইসিং</a>
            <Link to="/saved-properties" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between text-base font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors py-2.5 border-b border-slate-100 dark:border-slate-900">
              সেভড প্রপার্টিস
              <div className="flex items-center gap-1.5">
                {savedProperties.length > 0 && <span className="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-xs px-2 py-0.5 rounded-full font-black">{savedProperties.length}</span>}
                <span className={`material-symbols-outlined text-[18px] ${savedProperties.length > 0 ? "text-rose-500 fill-rose-500" : "text-slate-400"}`} style={{ fontVariationSettings: savedProperties.length > 0 ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </div>
            </Link>
            
            {!user ? (
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all border border-slate-200 dark:border-slate-800">লগইন</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-base font-black text-white bg-primary rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">ফ্রি শুরু করুন</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center text-base font-black text-white bg-primary rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                  <LayoutDashboard size={18} /> ড্যাশবোর্ডে যান
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real-time Rejection Warning Banner */}
      {latestSub?.status === "rejected" && user?.subscriptionStatus === "none" && (
        <div className="bg-red-500 text-white text-xs md:text-sm py-2 px-6 font-bold flex items-center justify-center gap-2 shadow-inner transition-all duration-300">
          <span>🚨 আপনার পেমেন্ট ভেরিফিকেশনটি বাতিল করা হয়েছে! {latestSub.rejectionReason ? `কারণ: ${latestSub.rejectionReason}` : "দয়া করে সঠিক ট্রানজেকশন আইডি দিয়ে পুনরায় চেষ্টা করুন।"}</span>
          <Link to="/payment/basic" className="underline hover:text-slate-200 ml-2 font-black">আবার সাবস্ক্রাইব করুন</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;