import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, X, ExternalLink } from "lucide-react";
import { useNotificationStore, type AppNotification } from "@/store/useNotificationStore";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000/api/notifications";

// notification type → icon + color
const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  payment:     { icon: "💰", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  invoice:     { icon: "🧾", color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/30" },
  maintenance: { icon: "🛠️", color: "text-orange-600",  bg: "bg-orange-50 dark:bg-orange-900/30" },
  system:      { icon: "🔔", color: "text-slate-600",    bg: "bg-slate-100 dark:bg-slate-700/50" },
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { token } = useAuthStore() as any;
  const { notifications, unreadCount, markOneRead, markAllRead, clearAll } =
    useNotificationStore();

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  // Panel এর বাইরে ক্লিক করলে বন্ধ করা
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // একটি notification পড়া
  const handleMarkOne = async (n: AppNotification) => {
    if (n.isRead) return;
    markOneRead(n._id);
    try {
      await axios.patch(`${API_URL}/${n._id}/read`, {}, { headers: authHeader });
    } catch {}

    if (n.link) {
      navigate(n.link);
      setIsOpen(false);
    }
  };

  // সব পড়া
  const handleMarkAll = async () => {
    markAllRead();
    try {
      await axios.patch(`${API_URL}/read-all`, {}, { headers: authHeader });
      toast.success("সব নোটিফিকেশন পড়া হয়েছে।");
    } catch {
      toast.error("সমস্যা হয়েছে!");
    }
  };

  // সব মুছে ফেলা
  const handleClearAll = async () => {
    clearAll();
    try {
      await axios.delete(`${API_URL}/clear`, { headers: authHeader });
      toast.success("সব নোটিফিকেশন মুছে ফেলা হয়েছে।");
    } catch {
      toast.error("সমস্যা হয়েছে!");
    }
  };

  // Time formatting
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "এইমাত্র";
    if (mins < 60) return `${mins} মিনিট আগে`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
    return `${Math.floor(hrs / 24)} দিন আগে`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        title="নোটিফিকেশন"
      >
        <Bell size={20} className="text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 animate-bounce">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[380px] bg-white dark:bg-slate-800 rounded-[28px] shadow-2xl dark:shadow-slate-900/60 border border-slate-100 dark:border-slate-700 z-50 overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              <h3 className="font-black text-slate-800 dark:text-slate-100">নোটিফিকেশন</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-full">
                  {unreadCount} নতুন
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  title="সব পড়া হয়েছে"
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                  <CheckCheck size={16} className="text-slate-400" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  title="সব মুছুন"
                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                <X size={16} className="text-slate-400" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700/50 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell size={24} className="text-slate-300 dark:text-slate-500" />
                </div>
                <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">কোনো নোটিফিকেশন নেই</p>
              </div>
            ) : (
              notifications.map((n) => {
                const cfg = typeConfig[n.type] ?? { icon: "🔔", color: "text-slate-600", bg: "bg-slate-100" };
                return (
                  <div
                    key={n._id}
                    onClick={() => handleMarkOne(n)}
                    className={`flex gap-3 px-4 py-3.5 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/30 ${
                      !n.isRead ? "bg-primary/[0.03] dark:bg-primary/10" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 ${cfg.bg} rounded-2xl flex items-center justify-center flex-shrink-0 text-lg`}>
                      {cfg.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-black ${!n.isRead ? "text-slate-800 dark:text-slate-100" : "text-slate-600 dark:text-slate-300"}`}>
                          {n.title}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!n.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-[10px] text-slate-400 font-bold">{timeAgo(n.createdAt)}</p>
                        {n.link && (
                          <ExternalLink size={10} className="text-slate-300" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 text-center">
              <p className="text-[11px] text-slate-400 font-bold">
                সর্বশেষ {notifications.length}টি নোটিফিকেশন দেখানো হচ্ছে
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
