import { useState, useRef, useEffect } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { useTenantNotificationStore, type TenantNotification } from "@/store/useTenantNotificationStore";
import { useTenantAuthStore } from "@/store/useTenantAuthStore";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/tenant-portal`;

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  payment:     { icon: "💰", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
  invoice:     { icon: "🧾", color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/30" },
  maintenance: { icon: "🛠️", color: "text-orange-600",  bg: "bg-orange-50 dark:bg-orange-900/30" },
  reminder:    { icon: "⏰", color: "text-yellow-600",  bg: "bg-yellow-50 dark:bg-yellow-900/30" },
  system:      { icon: "🔔", color: "text-slate-600",    bg: "bg-slate-100 dark:bg-slate-700/50" },
};

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return `${Math.floor(hrs / 24)} দিন আগে`;
};

const TenantNotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { token } = useTenantAuthStore() as any;
  const { notifications, unreadCount, markOneRead, markAllRead } = useTenantNotificationStore();

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  // বাইরে ক্লিক হলে বন্ধ করা
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkOne = async (n: TenantNotification) => {
    if (!n.isRead) {
      markOneRead(n._id);
      try {
        await axios.patch(`${API_URL}/notifications/${n._id}/read`, {}, { headers: authHeader });
      } catch {}
    }
    if (n.link) {
      navigate(n.link);
      setIsOpen(false);
    }
  };

  const handleMarkAll = async () => {
    markAllRead();
    try {
      await axios.patch(`${API_URL}/notifications/read-all`, {}, { headers: authHeader });
      toast.success("সব নোটিফিকেশন পড়া হয়েছে।");
    } catch {
      toast.error("সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        id="tenant-notification-bell"
        onClick={() => setIsOpen((p) => !p)}
        className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        title="নোটিফিকেশন"
      >
        <Bell size={20} className="text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 animate-bounce">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 z-[200] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              <h3 className="font-black text-on-surface text-sm">নোটিফিকেশন</h3>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                  {unreadCount} নতুন
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-[11px] text-primary hover:underline font-bold flex items-center gap-1"
                  title="সব পড়া হয়েছে"
                >
                  <CheckCheck size={14} />
                  সব পড়া
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <Bell size={36} className="mb-3 opacity-30" />
                <p className="text-sm font-bold">কোনো নোটিফিকেশন নেই</p>
              </div>
            ) : (
              notifications.map((n) => {
                const config = typeConfig[n.type] ?? typeConfig.system;
                return (
                  <div
                    key={n._id}
                    onClick={() => handleMarkOne(n)}
                    className={`flex gap-3 p-4 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-700/40 ${
                      !n.isRead ? "bg-primary/5 dark:bg-primary/10" : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 ${config.bg}`}
                    >
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-black text-xs truncate ${config.color}`}>{n.title}</p>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-bold">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 text-center">
              <span className="text-[11px] text-slate-400 font-bold">
                মোট {notifications.length}টি নোটিফিকেশন
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantNotificationBell;
