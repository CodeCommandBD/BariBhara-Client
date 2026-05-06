import { useState, useRef, useEffect } from "react";
import { Search, Bell, Sun, Moon, Settings, LogOut, User, ChevronRight, Building2, Users, CreditCard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useDashboard } from "@/Hook/useDashboard";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Topbar = () => {
  const { user, logout, token } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { leaseAlerts } = useDashboard();
  const navigate = useNavigate();

  // প্রোফাইল ছবি লোড করা (Settings এ আপলোড করলে এখানেও auto update হবে)
  const { data: profileData } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/api/profile/me", {
        headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` },
      });
      return res.data.user;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // ৫ মিনিট cache
  });

  const profilePhoto = profileData?.photo || null;

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const alertCount = leaseAlerts?.length ?? 0;

  // --- Global Search ---
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: searchResults } = useQuery({
    queryKey: ["global-search", searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 2) return null;
      const res = await axios.get(`http://localhost:4000/api/search?q=${searchQuery}`, {
        headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` },
      });
      return res.data.results;
    },
    enabled: searchQuery.length >= 2,
  });

  // সার্চ বারের বাইরে ক্লিক করলে বন্ধ
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="fixed top-0 right-0 lg:w-[calc(100%-18rem)] w-full h-20 z-40 bg-background/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between lg:px-8 px-4 border-b border-white/10 dark:border-slate-700/50">
      {/* সার্চ বার */}
      {/* \u0997\u09cd\u09b2\u09cb\u09ac\u09be\u09b2 \u09b8\u09be\u09b0\u09cd\u099a \u09ac\u09be\u09b0 */}
      <div ref={searchRef} className="relative lg:w-96 w-40 md:w-64">
        <div className="flex items-center bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-sm border border-slate-100 dark:border-slate-700 transition-all">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2 dark:text-slate-200 outline-none"
            placeholder="টেনেন্ট, প্রপার্টি খুঁজুন..."
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
          />
        </div>

        {/* \u09b8\u09be\u09b0\u09cd\u099a \u09b0\u09bf\u099c\u09be\u09b2\u09cd\u099f \u09a1\u09cd\u09b0\u09aa\u09a1\u09be\u0989\u09a8 */}
        {searchOpen && searchQuery.length >= 2 && searchResults && (
          <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
            {/* \u099f\u09c7\u09a8\u09c7\u09a8\u09cd\u099f */}
            {searchResults.tenants?.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                  <Users size={10} /> ভাড়াটিয়া
                </p>
                {searchResults.tenants.map((t: any) => (
                  <Link key={t._id} to="/tenants" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-xs">
                      {t.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.phone}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {/* \u09aa\u09cd\u09b0\u09aa\u09be\u09b0\u09cd\u099f\u09bf */}
            {searchResults.properties?.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-[10px] font-black text-slate-400 uppercase flex items-center gap-1">
                  <Building2 size={10} /> প্রপার্টি
                </p>
                {searchResults.properties.map((p: any) => (
                  <Link key={p._id} to="/properties" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                    <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Building2 size={13} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.address}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {/* কোনো ফলাফল না থাকলে */}
            {searchResults.tenants?.length === 0 && searchResults.properties?.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-sm font-bold text-slate-400">কোনো ফলাফল পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Right Side Actions */}
      <div className="flex items-center gap-2 lg:gap-4">

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="relative w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 shadow-inner"
          style={{ background: isDark ? "#702ae1" : "#e2e8f0" }}
          title={isDark ? "লাইট মোড" : "ডার্ক মোড"}
        >
          <span
            className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300"
            style={{ transform: isDark ? "translateX(28px)" : "translateX(0)" }}
          >
            {isDark
              ? <Moon size={11} className="text-primary" />
              : <Sun size={11} className="text-amber-500" />
            }
          </span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Bell size={20} className="text-slate-600 dark:text-slate-300" />
            {alertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {alertCount > 9 ? "9+" : alertCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-14 w-80 bg-white dark:bg-slate-800 rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">নোটিফিকেশন</h3>
                {alertCount > 0 && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">{alertCount}টি নতুন</span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {alertCount === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="mx-auto mb-2 opacity-30" size={32} />
                    <p className="text-sm font-bold">কোনো নোটিফিকেশন নেই</p>
                  </div>
                ) : (
                  leaseAlerts?.map((tenant: any) => {
                    const daysLeft = Math.ceil(
                      (new Date(tenant.leaseEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div key={tenant._id} className="p-4 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                            <Bell size={14} className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{tenant.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              চুক্তির মেয়াদ {daysLeft <= 0 ? "শেষ হয়ে গেছে!" : `${daysLeft} দিনের মধ্যে শেষ হবে`}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{tenant.property?.name} • {tenant.unit?.unitName}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <Link
                to="/dashboard"
                onClick={() => setNotifOpen(false)}
                className="flex items-center justify-center gap-1 p-3 text-primary text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                সব দেখুন <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-3 pl-3 lg:pl-4 lg:border-l border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl pr-2 py-1.5 transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none capitalize dark:text-slate-200">
                {user?.fullName || "বাড়িওয়ালা"}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{user?.role || "landlord"}</p>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-primary/20 shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
              {profilePhoto ? (
                <img src={profilePhoto} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "B"}
                </span>
              )}
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 w-52 bg-white dark:bg-slate-800 rounded-[20px] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm capitalize">{user?.fullName}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <div className="p-2 space-y-1">
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm font-bold"
                >
                  <Settings size={16} /> প্রোফাইল সেটিংস
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-bold"
                >
                  <LogOut size={16} /> লগআউট
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
