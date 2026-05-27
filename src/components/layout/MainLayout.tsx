import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AddPropertyModal from "../modals/AddPropertyModal";
import BottomNavigation from "./BottomNavigation";
import { useThemeStore } from "@/store/useThemeStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useSocket } from "@/Hook/useSocket";
import { toast } from "sonner";

const MainLayout = () => {
  const { isDark } = useThemeStore();
  const { user, token, setAuth } = useAuthStore();
  useSocket(); // 🔌 Real-time socket connection শুরু করা

  // App লোড হলে সেভ করা থিম DOM-এ প্রয়োগ করা
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Sync profile state inside the dashboard layout to ensure real-time expiration locking
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
        console.error("Failed to sync profile inside dashboard layout:", err);
      }
    };
    syncProfile();
  }, [token, setAuth]);

  const [isActivatingFree, setIsActivatingFree] = useState(false);

  const handleActivateFreePlan = async () => {
    if (!token || !user) return;
    setIsActivatingFree(true);
    try {
      const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/subscription/activate-free`, {
        method: "POST",
        headers: { Authorization: authHeader }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setAuth(data.user, token);
          toast.success("ফ্রি প্ল্যান সফলভাবে সক্রিয় হয়েছে! 🎉");
        } else {
          toast.error("ফ্রি প্ল্যান সক্রিয় করতে সমস্যা হয়েছে।");
        }
      } else {
        toast.error("সার্ভার রেসপন্স করতে পারেনি।");
      }
    } catch (err) {
      console.error("Error activating free plan:", err);
      toast.error("নেটওয়ার্ক ত্রুটির কারণে ফ্রি প্ল্যান সক্রিয় করা যায়নি।");
    } finally {
      setIsActivatingFree(false);
    }
  };

  // Calculate days left for the subscription warning alert
  const expiresAt = user?.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : null;
  const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
  const isExpiringSoon = user?.subscriptionStatus === "active" && daysLeft !== null && daysLeft <= 5 && daysLeft >= 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* বাম পাশের সাইডবার */}
      <Sidebar />

      {/* ডান পাশের মূল অংশ */}
      <div className="md:ml-24 lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
        {/* উপরের টপবার */}
        <Topbar />

        {/* মেইন কন্টেন্ট এরিয়া বা লকড স্ক্রিন */}
        <main className="flex-1 lg:pt-24 pt-20 lg:px-10 px-4 pb-32 lg:pb-12 dark:bg-slate-950 transition-colors duration-300">
          {user?.role === "landlord" && user.subscriptionStatus !== "active" ? (
            <div className={`mx-auto mt-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden transition-all duration-500 ${user.subscriptionStatus === "pending" ? "max-w-xl" : "max-w-4xl"}`}>
              {/* Decorative gradient blur background */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>

              {user.subscriptionStatus === "pending" ? (
                <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/10">
                  <span className="material-symbols-outlined text-4xl animate-spin">hourglass_empty</span>
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/10">
                  <span className="material-symbols-outlined text-4xl">lock</span>
                </div>
              )}

              <h2 className="text-2xl font-black mb-3">
                {user.subscriptionStatus === "pending" ? "ভেরিফিকেশন পেন্ডিং রয়েছে! ⏳" : "ড্যাশবোর্ড লকড রয়েছে! 🔒"}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
                {user.subscriptionStatus === "expired" 
                  ? "আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়ে গিয়েছে! ড্যাশবোর্ডের সব ফিচার আনলক করতে নিচের যেকোনো একটি আকর্ষণীয় প্ল্যান রিনিউ করুন।"
                  : user.subscriptionStatus === "pending"
                  ? "আপনার পেমেন্ট ভেরিফিকেশন রিকোয়েস্টটি পেন্ডিং রয়েছে। অ্যাডমিন অ্যাপ্রুভ করার সাথে সাথে সম্পূর্ণ ড্যাশবোর্ড স্বয়ংক্রিয়ভাবে আনলক হয়ে যাবে।"
                  : "আপনার কোনো সক্রিয় সাবস্ক্রিপশন নেই! ড্যাশবোর্ডের ফিচারগুলো ব্যবহার করতে নিচের যেকোনো একটি প্ল্যান নিয়ে সাবস্ক্রাইব করুন।"}
              </p>

              {user.subscriptionStatus !== "pending" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-6">
                  {/* Free Plan Card */}
                  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl text-left relative overflow-hidden flex flex-col justify-between shadow-lg hover:border-primary/30 transition-all duration-300">
                    <div>
                      <span className="px-3 py-1 bg-primary/10 text-primary dark:text-primary font-extrabold rounded-full text-[10px] uppercase tracking-wider">
                        বেসিক ট্রায়াল / Free
                      </span>
                      <h3 className="text-lg font-black mt-3 text-slate-800 dark:text-slate-100">ফ্রি প্ল্যান</h3>
                      <div className="flex items-baseline gap-1 mt-2 mb-6">
                        <span className="text-3xl font-black text-slate-800 dark:text-slate-100">৳০</span>
                        <span className="text-slate-500 text-xs">/চিরকাল</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 mb-8">
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 font-bold text-sm">✓</span> ১টি বিল্ডিং পর্যন্ত যোগ করুন
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 font-bold text-sm">✓</span> ২ জন ভাড়াটিয়া ম্যানেজমেন্ট
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500 font-bold text-sm">✓</span> ব্যাসিক ড্যাশবোর্ড সুবিধা
                        </li>
                        <li className="flex items-center gap-2 text-slate-400 dark:text-slate-600 line-through">
                          <span className="font-bold text-sm">✗</span> এসএমএস ও ইমেইল নোটিফিকেশন
                        </li>
                        <li className="flex items-center gap-2 text-slate-400 dark:text-slate-600 line-through">
                          <span className="font-bold text-sm">✗</span> কাস্টম রিলিজ ডিল মেকার
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={handleActivateFreePlan}
                      disabled={isActivatingFree}
                      className="block w-full py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all text-sm text-center"
                    >
                      {isActivatingFree ? "সক্রিয় করা হচ্ছে..." : "ফ্রি প্ল্যান চালু করুন ⚡"}
                    </button>
                  </div>

                  {/* Pro Plan Card */}
                  <div className="bg-gradient-to-b from-slate-900 to-indigo-950 dark:from-slate-950 dark:to-slate-900 border-2 border-violet-500 p-6 rounded-3xl text-left relative overflow-hidden flex flex-col justify-between shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl"></div>
                    <div>
                      <span className="px-3 py-1 bg-violet-500 text-white font-extrabold rounded-full text-[10px] uppercase tracking-wider shadow-md">
                        সেরা অফার / Best Value
                      </span>
                      <h3 className="text-lg font-black mt-3 text-white">প্রো প্ল্যান</h3>
                      <div className="flex items-baseline gap-1 mt-2 mb-6">
                        <span className="text-3xl font-black text-white">৳৯৯৯</span>
                        <span className="text-violet-300 text-xs">/মাস</span>
                      </div>
                      <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                        <li className="flex items-center gap-2">
                          <span className="text-violet-400 font-bold text-sm">✓</span> আনলিমিটেড বিল্ডিং যোগ করুন
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-violet-400 font-bold text-sm">✓</span> আনলিমিটেড ভাড়াটিয়া ম্যানেজমেন্ট
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-violet-400 font-bold text-sm">✓</span> রিয়েল-টাইম সকেট চ্যাট সাপোর্ট
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-violet-400 font-bold text-sm">✓</span> সব ধরণের প্রিমিয়াম ফিচার
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-violet-400 font-bold text-sm">✓</span> কাস্টম রিলিজ ডিল মেকার 💎
                        </li>
                      </ul>
                    </div>
                    <Link
                      to="/payment/pro"
                      className="block w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:scale-105 active:scale-95 transition-all text-sm text-center"
                    >
                      প্রো প্ল্যান রিনিউ করুন 🔥
                    </Link>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary font-bold text-sm transition-all"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  হোমপেজে ফিরে যান (Back to Home)
                </Link>
              </div>
            </div>
          ) : (
            <>
              {isExpiringSoon && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 px-6 rounded-2xl mb-8 shadow-lg shadow-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h4 className="font-bold text-sm md:text-base">সাবস্ক্রিপশন মেয়াদ শেষ হচ্ছে!</h4>
                      <p className="text-xs text-white/90">আপনার সাবস্ক্রিপশনটির মেয়াদ আর মাত্র {daysLeft} দিন আছে। নির্বিঘ্নে সেবা পেতে এখনই রিনিউ করুন!</p>
                    </div>
                  </div>
                  <Link 
                    to="/payment/basic" 
                    className="bg-white text-orange-600 hover:bg-slate-50 transition-all font-black text-xs md:text-sm px-6 py-2.5 rounded-xl shadow-md active:scale-95 shrink-0"
                  >
                    রিনিউ করুন 🔄
                  </Link>
                </div>
              )}
              <Outlet />
            </>
          )}
        </main>
      </div>
      <AddPropertyModal />
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;
