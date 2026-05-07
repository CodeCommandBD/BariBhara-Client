import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AddPropertyModal from "../modals/AddPropertyModal";
import { useThemeStore } from "@/store/useThemeStore";
import { useSocket } from "@/Hook/useSocket";

const MainLayout = () => {
  const { isDark } = useThemeStore();
  useSocket(); // 🔌 Real-time socket connection শুরু করা

  // App লোড হলে সেভ করা থিম DOM-এ প্রয়োগ করা
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* বাম পাশের সাইডবার */}
      <Sidebar />

      {/* ডান পাশের মূল অংশ */}
      <div className="lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
        {/* উপরের টপবার */}
        <Topbar />

        {/* মেইন কন্টেন্ট এরিয়া */}
        <main className="flex-1 lg:pt-24 pt-20 lg:px-10 px-4 pb-32 lg:pb-12 dark:bg-slate-950 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
      <AddPropertyModal />
    </div>
  );
};

export default MainLayout;
