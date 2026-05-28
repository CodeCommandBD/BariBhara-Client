import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  Eye, Search, Phone, Heart, UserPlus, TrendingUp,
  Smartphone, Monitor, Tablet, BarChart2, ChevronRight,
  ArrowUpRight, ArrowDownRight, Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const RANGE_OPTIONS = [
  { label: "৭ দিন", days: 7 },
  { label: "৩০ দিন", days: 30 },
  { label: "৯০ দিন", days: 90 },
];

const EVENT_COLORS: Record<string, string> = {
  pageView:        "#7c3aed",
  propertyView:    "#6d28d9",
  search:          "#0ea5e9",
  whatsappClick:   "#22c55e",
  callClick:       "#f59e0b",
  propertyFavorite:"#f43f5e",
  registration:    "#10b981",
  filterUsed:      "#8b5cf6",
};

const EVENT_LABELS: Record<string, string> = {
  pageView:        "পেজ ভিজিট",
  propertyView:    "প্রপার্টি ভিউ",
  search:          "সার্চ",
  whatsappClick:   "WhatsApp ক্লিক",
  callClick:       "কল ক্লিক",
  propertyFavorite:"ফেভারিট",
  registration:    "রেজিস্ট্রেশন",
  filterUsed:      "ফিল্টার ব্যবহার",
};

// Custom tooltip for line/area charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-4 text-sm">
        <p className="font-black text-slate-700 dark:text-slate-200 mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 py-0.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500 dark:text-slate-400">{entry.name}:</span>
            <span className="font-black text-slate-700 dark:text-slate-200">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AdminAnalytics = () => {
  const { token } = useAuthStore();
  const [days, setDays] = useState(30);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-analytics", days],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/analytics/dashboard?days=${days}`, {
        headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      return json.data;
    },
    retry: false,
  });

  const summary = data?.summary;
  const dailySeries = data?.dailyTimeSeries || [];
  const eventBreakdown = data?.eventBreakdown || [];
  const topLocations = data?.topSearchedLocations || [];
  const topProperties = data?.topViewedProperties || [];
  const deviceBreakdown = data?.deviceBreakdown || [];

  const statCards = [
    {
      title: "মোট ভিজিট",
      value: summary?.totalViews ?? 0,
      icon: Eye,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
      border: "border-violet-100 dark:border-violet-900/30",
      desc: "পেজ ও প্রপার্টি ভিউ",
    },
    {
      title: "মোট সার্চ",
      value: summary?.totalSearches ?? 0,
      icon: Search,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-950/30",
      border: "border-sky-100 dark:border-sky-900/30",
      desc: "হোমপেজ সার্চ ফর্ম",
    },
    {
      title: "কন্ট্যাক্ট ক্লিক",
      value: summary?.totalContactClicks ?? 0,
      icon: Phone,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      border: "border-emerald-100 dark:border-emerald-900/30",
      desc: "WhatsApp + কল",
    },
    {
      title: "ফেভারিট সেভ",
      value: summary?.totalFavorites ?? 0,
      icon: Heart,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-950/30",
      border: "border-rose-100 dark:border-rose-900/30",
      desc: "সেভড প্রপার্টি",
    },
    {
      title: "নতুন রেজিস্ট্রেশন",
      value: summary?.totalRegistrations ?? 0,
      icon: UserPlus,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-100 dark:border-amber-900/30",
      desc: "নতুন মেম্বার",
    },
    {
      title: "কনভার্সন রেট",
      value: `${summary?.conversionRate ?? 0}%`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      border: "border-indigo-100 dark:border-indigo-900/30",
      desc: "ভিজিট → কন্ট্যাক্ট",
    },
  ];

  const deviceIcons: Record<string, any> = {
    mobile: Smartphone,
    desktop: Monitor,
    tablet: Tablet,
    unknown: Monitor,
  };

  const totalDeviceCount = deviceBreakdown.reduce((a: number, d: any) => a + d.count, 0);

  const pieData = eventBreakdown.map((e: any) => ({
    name: EVENT_LABELS[e._id] || e._id,
    value: e.count,
    color: EVENT_COLORS[e._id] || "#94a3b8",
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          <p className="text-on-surface-variant font-medium animate-pulse">অ্যানালিটিক্স লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600/10 via-sky-500/5 to-transparent p-6 md:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <BarChart2 size={180} className="text-primary" />
        </div>
        <div className="relative z-10">
          <p className="text-primary font-black tracking-widest uppercase text-xs mb-2">Analytics Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-extrabold font-headline mb-2 tracking-tight">
            📊 ভিজিট, সার্চ ও কনভার্সন ট্র্যাকিং
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base max-w-2xl">
            প্ল্যাটফর্মে ভিজিটরদের আচরণ, সার্চ প্যাটার্ন এবং কনভার্সন রিয়েল-টাইমে বিশ্লেষণ করুন।
          </p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-on-surface-variant">সময়কাল:</span>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.days}
              onClick={() => setDays(opt.days)}
              className={`px-4 py-2 rounded-xl font-black text-sm transition-all ${
                days === opt.days
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-on-surface-variant hover:border-primary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`bg-white dark:bg-slate-800 rounded-2xl p-5 border ${card.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all`}>
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={card.color} />
              </div>
              <p className="text-2xl font-black font-headline text-on-surface">{typeof card.value === "number" ? card.value.toLocaleString() : card.value}</p>
              <p className="text-xs font-bold text-on-surface mt-0.5">{card.title}</p>
              <p className="text-[10px] text-on-surface-variant mt-0.5">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Daily Activity Time Series Chart */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black text-lg text-on-surface">দৈনিক অ্যাক্টিভিটি</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">গত {days} দিনের ট্রেন্ড</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailySeries} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradSearches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradContacts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700 }} tickFormatter={(d) => d.slice(5)} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span className="text-xs font-bold">{value}</span>} />
            <Area type="monotone" dataKey="pageViews" name="ভিজিট" stroke="#7c3aed" strokeWidth={2} fill="url(#gradViews)" dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="searches" name="সার্চ" stroke="#0ea5e9" strokeWidth={2} fill="url(#gradSearches)" dot={false} activeDot={{ r: 4 }} />
            <Area type="monotone" dataKey="contacts" name="কন্ট্যাক্ট" stroke="#22c55e" strokeWidth={2} fill="url(#gradContacts)" dot={false} activeDot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Event Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="font-black text-base text-on-surface mb-4">ইভেন্ট ব্রেকডাউন</h2>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: any) => [value.toLocaleString(), name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {pieData.slice(0, 5).map((entry: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                      <span className="font-bold text-on-surface-variant">{entry.name}</span>
                    </div>
                    <span className="font-black text-on-surface">{entry.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
              এখনো কোনো ইভেন্ট রেকর্ড হয়নি
            </div>
          )}
        </div>

        {/* Top Searched Locations */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <h2 className="font-black text-base text-on-surface mb-4">শীর্ষ সার্চ লোকেশন</h2>
          {topLocations.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topLocations.slice(0, 7)} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 9 }} />
                <YAxis
                  dataKey="_id"
                  type="category"
                  tick={{ fontSize: 9, fontWeight: 700 }}
                  width={90}
                  tickFormatter={(v) => v?.length > 12 ? v.slice(0, 12) + "…" : v}
                />
                <Tooltip formatter={(v: any) => [`${v} বার`, "সার্চ"]} />
                <Bar dataKey="count" name="সার্চ" radius={[0, 6, 6, 0]} fill="#0ea5e9">
                  {topLocations.slice(0, 7).map((_: any, i: number) => (
                    <Cell key={i} fill={`hsl(${200 + i * 12}, 80%, ${50 + i * 3}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400 text-sm">
              সার্চ ডেটা নেই
            </div>
          )}
        </div>

        {/* Device & Top Properties */}
        <div className="space-y-6">
          {/* Device Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="font-black text-base text-on-surface mb-4">ডিভাইস টাইপ</h2>
            <div className="space-y-3">
              {deviceBreakdown.map((d: any, i: number) => {
                const DevIcon = deviceIcons[d._id] || Monitor;
                const pct = totalDeviceCount > 0 ? Math.round((d.count / totalDeviceCount) * 100) : 0;
                const barColors = ["bg-violet-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500"];
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <DevIcon size={14} className="text-on-surface-variant" />
                        <span className="font-bold text-on-surface capitalize">{d._id}</span>
                      </div>
                      <span className="font-black text-on-surface">{d.count.toLocaleString()} <span className="text-on-surface-variant font-bold">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${barColors[i] || "bg-primary"} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              {deviceBreakdown.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">ডেটা নেই</p>
              )}
            </div>
          </div>

          {/* Top Viewed Properties */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="font-black text-base text-on-surface mb-4">সর্বাধিক দেখা প্রপার্টি</h2>
            <div className="space-y-3">
              {topProperties.map((p: any, i: number) => (
                <Link key={i} to={`/property/${p._id}`} target="_blank" className="flex items-center gap-3 group hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-xl transition-all">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {p.images?.[0] ? (
                      <img src={p.images[0].startsWith("http") ? p.images[0] : `http://localhost:4000/${p.images[0].replace(/\\/g, "/")}`} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Building2 size={14} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-on-surface truncate">{p.name || "অজানা প্রপার্টি"}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{p.location}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Eye size={11} className="text-primary" />
                    <span className="text-xs font-black text-primary">{p.views}</span>
                    <ArrowUpRight size={12} className="text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
              {topProperties.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">ডেটা নেই</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
