import { Search, Bell } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore"; // আপনার ইউজার ডাটা ব্যবহারের জন্য

const Topbar = () => {
  const { user } = useAuthStore(); // বর্তমান লগইন করা ইউজারের তথ্য
  return (
    <header className="fixed top-0 right-0 lg:w-[calc(100%-18rem)] w-full h-20 z-40 bg-background/80 backdrop-blur-md flex items-center justify-between lg:px-8 px-4 border-b border-white/10">
      {/* Search Bar - মোবাইলে ছোট হয়ে যাবে */}
      <div className="flex items-center bg-white rounded-full px-4 py-2 lg:w-96 w-40 md:w-64 shadow-sm border border-slate-100 transition-all">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 ml-2"
          placeholder="খুঁজুন..."
          type="text"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 lg:gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <div className="relative cursor-pointer hover:bg-white/50 p-2 rounded-full transition-colors">
            <Bell size={20} className="text-on-surface-variant" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full border-2 border-background"></span>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 lg:pl-4 lg:border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold leading-none capitalize">
              {user?.fullName || "বাড়িওয়ালা"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 shrink-0">
            <img
              alt="Profile"
              className="w-full h-full object-cover"
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
