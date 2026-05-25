import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { 
  Users, 
  Building2, 
  CreditCard, 
  Clock, 
  Activity, 
  Wrench, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX
} from "lucide-react";
import { Link } from "react-router-dom";

interface UserItem {
  _id: string;
  fullName: string;
  email: string;
  role: "landlord" | "tenant";
  accountStatus: "active" | "blocked";
  createdAt: string;
}

interface SubscriptionItem {
  _id: string;
  userId?: {
    fullName: string;
    email: string;
  };
  plan: "basic" | "pro";
  amount: number;
  paymentMethod: string;
  trxId: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
}

interface StatsData {
  stats: {
    totalLandlords: number;
    totalTenants: number;
    totalProperties: number;
    pendingSubscriptions: number;
    totalRevenue: number;
    totalMaintenanceRequests: number;
    totalInvoices: number;
  };
  recentUsers: UserItem[];
  recentSubscriptions: SubscriptionItem[];
}

const AdminDashboard = () => {
  const { token } = useAuthStore();
  const [payNumbers, setPayNumbers] = useState({ bkashNumber: "", nagadNumber: "", rocketNumber: "" });
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public/system-settings`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setPayNumbers({
            bkashNumber: data.settings.bkashNumber,
            nagadNumber: data.settings.nagadNumber,
            rocketNumber: data.settings.rocketNumber || ""
          });
        }
      })
      .catch(err => console.error("Error fetching system settings:", err));
  }, []);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/system-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`
        },
        body: JSON.stringify(payNumbers)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "পেমেন্ট নম্বরসমূহ সফলভাবে আপডেট হয়েছে!");
        setIsEditingSettings(false);
      } else {
        toast.error(data.message || "আপডেট ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      toast.error("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    }
  };

  const { data, isLoading } = useQuery<StatsData>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/stats`, {
        headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json() as Promise<StatsData>;
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-on-surface-variant font-medium animate-pulse">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const recentUsers = data?.recentUsers || [];
  const recentSubscriptions = data?.recentSubscriptions || [];

  const cards = [
    { title: "মোট বাড়িওয়ালা", value: stats?.totalLandlords || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "hover:border-blue-500/30" },
    { title: "মোট ভাড়াটিয়া", value: stats?.totalTenants || 0, icon: Users, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "hover:border-emerald-500/30" },
    { title: "মোট প্রপার্টি", value: stats?.totalProperties || 0, icon: Building2, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", border: "hover:border-purple-500/30" },
    { title: "মোট ইনভয়েস", value: stats?.totalInvoices || 0, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", border: "hover:border-indigo-500/30" },
    { title: "মেনটেইনেন্স রিকোয়েস্ট", value: stats?.totalMaintenanceRequests || 0, icon: Wrench, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", border: "hover:border-orange-500/30" },
    { title: "পেন্ডিং পেমেন্ট", value: stats?.pendingSubscriptions || 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", border: "hover:border-amber-500/30" },
    { title: "মোট আয়", value: `৳ ${stats?.totalRevenue || 0}`, icon: CreditCard, color: "text-green-500", bg: "bg-green-50 dark:bg-green-500/10", border: "hover:border-green-500/30" },
  ];

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header section with styling */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-purple-500/5 to-transparent p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Activity size={180} className="text-primary" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline mb-2 flex items-center gap-3 tracking-tight">
            <Activity className="text-primary animate-pulse" /> Super Admin Overview
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl">
            প্ল্যাটফর্মের সার্বিক পারফরম্যান্স, মেম্বার অ্যাক্টিভিটি ও পেমেন্ট ভেরিফিকেশন রিয়েল-টাইমে মনিটর করুন।
          </p>
        </div>
      </div>

      {/* 💳 পেমেন্ট অ্যাকাউন্ট সেটিংস (Payment Account Settings) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-150 dark:border-slate-700/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <CreditCard size={24} />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-850 dark:text-slate-100 font-headline">💳 পেমেন্ট অ্যাকাউন্ট সেটিংস</h2>
              <p className="text-xs text-slate-400 font-bold mt-0.5">বাড়িওয়ালারা সাবস্ক্রিপশন ফি জমা দেওয়ার সময় এই নম্বরগুলো দেখতে পাবেন</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditingSettings(!isEditingSettings)}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-black rounded-xl text-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            {isEditingSettings ? "বাতিল করুন ✕" : "নম্বর পরিবর্তন করুন ⚙️"}
          </button>
        </div>

        {isEditingSettings ? (
          <form onSubmit={handleUpdateSettings} className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">বিকাশ (bKash) নম্বর</label>
                <input
                  type="text"
                  required
                  value={payNumbers.bkashNumber}
                  onChange={(e) => setPayNumbers({ ...payNumbers, bkashNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">নগদ (Nagad) নম্বর</label>
                <input
                  type="text"
                  required
                  value={payNumbers.nagadNumber}
                  onChange={(e) => setPayNumbers({ ...payNumbers, nagadNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">রকেট (Rocket) নম্বর (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={payNumbers.rocketNumber}
                  placeholder="না থাকলে ফাঁকা রাখুন"
                  onChange={(e) => setPayNumbers({ ...payNumbers, rocketNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm shadow-md shadow-primary/20 transition-all cursor-pointer"
              >
                সেভ করুন ✓
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <img src="https://download.logo.wine/logo/BKash/BKash-Icon-Logo.wine.png" alt="bKash" className="w-10 h-8 object-contain shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">বিকাশ পার্সোনাল</p>
                <p className="font-extrabold text-sm dark:text-slate-200 mt-0.5">{payNumbers.bkashNumber || "সেট করা নেই"}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad" className="w-10 h-8 object-contain shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">নগদ পার্সোনাল</p>
                <p className="font-extrabold text-sm dark:text-slate-200 mt-0.5">{payNumbers.nagadNumber || "সেট করা নেই"}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-10 h-8 bg-purple-100 dark:bg-purple-950/30 rounded-lg flex items-center justify-center shrink-0">
                <span className="font-black text-[9px] text-purple-700 dark:text-purple-400 uppercase tracking-widest">Rocket</span>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">রকেট পার্সোনাল</p>
                <p className="font-extrabold text-sm dark:text-slate-200 mt-0.5">{payNumbers.rocketNumber || "সেট করা নেই"}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={index} 
              className={`bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800/80 transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${card.border} flex items-center gap-4`}
            >
              <div className={`p-4 rounded-xl ${card.bg} ${card.color} shrink-0`}>
                <Icon size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm font-semibold text-on-surface-variant truncate">{card.title}</p>
                <p className="text-2xl font-black font-headline mt-1 truncate">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Registrations */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
            <div>
              <h2 className="font-bold text-lg font-headline flex items-center gap-2">
                <Users size={20} className="text-primary" /> সাম্প্রতিক ইউজার জয়েনিং
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">নতুন বাড়িওয়ালা ও ভাড়াটিয়া মেম্বার</p>
            </div>
            <Link 
              to="/admin/users" 
              className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1 transition-colors group"
            >
              সব দেখুন <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="p-6 flex-1">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50 space-y-4">
              {recentUsers.map((user, idx) => (
                <div key={user._id} className={`flex items-center justify-between pt-4 ${idx === 0 ? 'pt-0' : ''}`}>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">{user.fullName}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full capitalize ${
                      user.role === 'landlord' 
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                    }`}>
                      {user.role === 'landlord' ? 'বাড়িওয়ালা' : 'ভাড়াটিয়া'}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {user.accountStatus === "active" ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        <UserCheck size={12} /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        <UserX size={12} /> Blocked
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <div className="py-8 text-center text-on-surface-variant text-sm">
                  কোনো ইউজার পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Subscription & TrxID Verification */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/10">
            <div>
              <h2 className="font-bold text-lg font-headline flex items-center gap-2">
                <CreditCard size={20} className="text-primary" /> পেমেন্ট ও সিকিউরিটি ভেরিফিকেশন
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">অটো-ডিটেক্টেড ফেক ট্রানজেকশন ট্র্যাকার</p>
            </div>
            <Link 
              to="/admin/subscriptions" 
              className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1 transition-colors group"
            >
              সব দেখুন <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="p-6 flex-1">
            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800/50">
              {recentSubscriptions.map((sub, idx) => {
                const isAutoRejected = sub.rejectionReason?.includes("System Auto-Rejected");
                return (
                  <div key={sub._id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''} space-y-2`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-sm">{sub.userId?.fullName || "অজানা মেম্বার"}</p>
                        <p className="text-xs text-on-surface-variant capitalize">{sub.plan} প্ল্যান • ৳{sub.amount}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-on-surface-variant">
                            {sub.paymentMethod.toUpperCase()}: {sub.trxId}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {sub.status === "approved" && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <ShieldCheck size={12} /> Approved
                          </span>
                        )}
                        {sub.status === "rejected" && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            <ShieldAlert size={12} /> Rejected
                          </span>
                        )}
                        {sub.status === "pending" && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 animate-pulse">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                        {isAutoRejected && (
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded mt-0.5 animate-pulse">
                            🚨 Auto Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Auto-Rejection Reason display */}
                    {sub.rejectionReason && (
                      <div className="text-[11px] bg-red-50/70 dark:bg-red-950/15 border border-red-100/50 dark:border-red-900/25 p-2 rounded-lg text-red-600 dark:text-red-400 flex items-start gap-1.5 font-medium leading-relaxed">
                        <ShieldAlert size={14} className="shrink-0 mt-0.5" />
                        <span>{sub.rejectionReason}</span>
                      </div>
                    )}
                  </div>
                );
              })}
              {recentSubscriptions.length === 0 && (
                <div className="py-8 text-center text-on-surface-variant text-sm">
                  কোনো পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
