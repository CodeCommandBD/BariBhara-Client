import { Search, Bell, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore"; // আপনার ইউজার ডাটা ব্যবহারের জন্য

const Topbar = () => {
  const { user } = useAuthStore(); // বর্তমান লগইন করা ইউজারের তথ্য
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-18rem)] h-20 z-40 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 border-b border-white/10">
      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-full px-4 py-2 w-96 shadow-sm border border-slate-100">
        <Search size={18} className="text-slate-400" />
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2"
          placeholder="বাড়ি, ভাড়াটিয়া অথবা বকেয়া খুঁজুন..."
          type="text"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer hover:bg-white/50 p-2 rounded-full transition-colors">
          <Bell size={20} className="text-on-surface-variant" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-background"></span>
        </div>
        <div className="cursor-pointer hover:bg-white/50 p-2 rounded-full transition-colors">
          <MessageSquare size={20} className="text-on-surface-variant" />
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-bold leading-none capitalize">
              {user?.fullName || "বাড়িওয়ালা"}
            </p>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full mt-1 inline-block">
              বাড়িওয়ালা
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" // রিয়েল ইমেজের অভাব থাকাতে ডাইনামিক অ্যাভাটার
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
