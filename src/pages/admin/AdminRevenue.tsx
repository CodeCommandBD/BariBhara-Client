import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  TrendingUp, Users, Home, CreditCard, DollarSign, Loader2,
  ArrowRight, ShieldAlert, Award, Calendar, RefreshCw
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
} from "recharts";
import { useAuthStore } from "../../store/useAuthStore";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin`;

const COLORS = ["#7c3aed", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];

const AdminRevenue = () => {
  const { token } = useAuthStore() as any;

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-revenue-stats"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/revenue`, { headers: authHeader });
      return res.data.revenue;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="font-bold">রেভিনিউ ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-center">
        <div className="max-w-md p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <ShieldAlert size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-black text-on-surface mb-2">ডাটা লোড করতে সমস্যা হয়েছে</h2>
          <p className="text-sm text-on-surface-variant mb-4">অনুগ্রহ করে আবার চেষ্টা করুন।</p>
          <button onClick={() => refetch()} className="px-6 py-2.5 bg-primary text-white rounded-2xl font-black text-sm">
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  const { totalRevenue, mrr, activeSubscribers, planDistribution, monthlyTrend, topLandlords, platformStats } = data;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface">রেভিনিউ ও পেমেন্ট ট্র্যাকিং</h1>
          <p className="text-sm text-on-surface-variant mt-1">প্ল্যাটফর্মের সাবস্ক্রিপশন ফি, এমআরআর এবং পেমেন্ট রিপোর্ট</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-on-surface rounded-2xl font-bold text-sm transition-all"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          রিফ্রেশ
        </button>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "মোট রেভিনিউ",
            value: `৳${totalRevenue.toLocaleString()}`,
            desc: "অনুমোদিত সাবস্ক্রিপশন ফি",
            icon: DollarSign,
            bg: "from-violet-600 to-indigo-600 text-white",
            iconBg: "bg-white/20",
          },
          {
            title: "চলতি মাসের আয় (MRR)",
            value: `৳${mrr.toLocaleString()}`,
            desc: "এই মাসের মোট পেমেন্ট",
            icon: TrendingUp,
            bg: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-on-surface",
            iconBg: "bg-primary/10 text-primary",
          },
          {
            title: "সক্রিয় সাবস্ক্রাইবার",
            value: activeSubscribers,
            desc: "প্রিমিয়াম ল্যান্ডলর্ডস",
            icon: CreditCard,
            bg: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-on-surface",
            iconBg: "bg-pink-100 dark:bg-pink-900/30 text-pink-600",
          },
          {
            title: "মোট ল্যান্ডলর্ড",
            value: platformStats.totalLandlords,
            desc: `মোট ইউজার ${platformStats.totalUsers} জন`,
            icon: Users,
            bg: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-on-surface",
            iconBg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
          },
        ].map((c, i) => (
          <div key={i} className={`p-6 rounded-3xl overflow-hidden shadow-sm flex items-center justify-between ${c.bg}`}>
            <div>
              <p className={`text-xs font-black ${c.bg.includes("text-white") ? "text-white/80" : "text-on-surface-variant"}`}>
                {c.title}
              </p>
              <h3 className="text-2xl font-black mt-1">{c.value}</h3>
              <p className={`text-[11px] mt-1 ${c.bg.includes("text-white") ? "text-white/70" : "text-on-surface-variant"}`}>
                {c.desc}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${c.iconBg}`}>
              <c.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-on-surface">আয়ের ধারাবাহিকতা (১২ মাস)</h3>
              <p className="text-xs text-on-surface-variant">মাসিক মোট সাবস্ক্রিপশন আয়ের ট্রেন্ড</p>
            </div>
            <Calendar size={18} className="text-slate-400" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 10, fontWeight: "bold" }} />
                <YAxis tickLine={false} tick={{ fontSize: 10, fontWeight: "bold" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Area type="monotone" dataKey="revenue" name="আয় (৳)" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution Pie */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-on-surface">সাবস্ক্রিপশন প্ল্যান</h3>
            <p className="text-xs text-on-surface-variant">কোন প্ল্যান কতজন ব্যবহার করছেন</p>
          </div>
          <div className="h-56 relative flex items-center justify-center my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {planDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <p className="text-2xl font-black text-on-surface">{activeSubscribers}</p>
              <p className="text-[10px] text-on-surface-variant font-bold">মোট প্রিমিয়াম</p>
            </div>
          </div>
          <div className="space-y-2">
            {planDistribution.map((entry: any, index: number) => (
              <div key={entry._id} className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-on-surface">{entry._id}</span>
                </div>
                <span className="text-on-surface-variant">
                  {entry.count} বার (৳{entry.revenue.toLocaleString()})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers and Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Landlords */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-on-surface">শীর্ষ পেমেন্টকারী ল্যান্ডলর্ড</h3>
              <p className="text-xs text-on-surface-variant font-bold">প্ল্যাটফর্মে সর্বাধিক অবদানকারী বাড়িওয়ালারা</p>
            </div>
            <Award size={18} className="text-amber-500" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-[11px] font-black text-on-surface-variant uppercase tracking-wider">
                  <th className="pb-3 font-bold">বাড়িওয়ালা</th>
                  <th className="pb-3 font-bold text-center">মোট পেমেন্ট সংখ্যা</th>
                  <th className="pb-3 font-bold text-right">পরিশোধিত টাকা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {topLandlords.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400 font-bold text-sm">
                      কোনো পেমেন্ট পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  topLandlords.map((item: any, i: number) => (
                    <tr key={i} className="text-xs font-bold text-on-surface">
                      <td className="py-3.5 flex items-center gap-3">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 w-5 h-5 flex items-center justify-center rounded-full shrink-0 font-bold">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-black">{item.user?.fullName}</p>
                          <p className="text-[10px] text-on-surface-variant">{item.user?.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 text-center">{item.count}টি প্ল্যান</td>
                      <td className="py-3.5 text-right font-black text-primary">
                        ৳{item.totalPaid.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform stats */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-on-surface">প্ল্যাটফর্ম হেলথ</h3>
            <p className="text-xs text-on-surface-variant">সিস্টেমের মোট রিয়েল-টাইম লাইভ ডাটা</p>
          </div>
          <div className="space-y-4 my-6">
            {[
              { label: "মোট বাড়ি", value: platformStats.totalProperties, color: "bg-violet-500", desc: "ল্যান্ডলর্ডদের লিস্টিং" },
              { label: "মোট ভাড়াটিয়া", value: platformStats.totalTenants, color: "bg-pink-500", desc: "সিস্টেমে রেজিস্টার্ড ভাড়াটিয়া" },
              { label: "মোট বাড়িওয়ালা", value: platformStats.totalLandlords, color: "bg-emerald-500", desc: "সিস্টেমে রেজিস্টার্ড ল্যান্ডলর্ড" },
            ].map((s, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-on-surface">{s.label}</span>
                  <span className="text-on-surface">{s.value}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${Math.min(100, (s.value / (platformStats.totalUsers || 1)) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl text-center">
            <span className="text-[11px] text-on-surface-variant font-bold block">প্ল্যাটফর্ম স্ট্যাটাস</span>
            <span className="text-xs font-black text-emerald-600 mt-0.5 inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              সিস্টেম স্বাভাবিকভাবে চলছে
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenue;
