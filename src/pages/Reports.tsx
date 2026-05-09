import { useState } from "react";
import { useReports } from "@/Hook/useReports";
import { useAuthStore } from "@/store/useAuthStore";
import {
  BarChart3, Filter, Download, TrendingUp, TrendingDown,
  Wallet, AlertCircle, Calendar, Home, RefreshCw,
  Users, Building2, FileSpreadsheet, Clock
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";
import * as XLSX from "xlsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://localhost:4000/api/reports";

const PIE_COLORS = ["#7c3aed", "#2563eb", "#059669", "#d97706", "#dc2626", "#0891b2"];

// ——— Quick filter presets ———
const getPreset = (preset: string) => {
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  switch (preset) {
    case "thisMonth": return { startDate: fmt(new Date(now.getFullYear(), now.getMonth(), 1)), endDate: fmt(now) };
    case "lastMonth": return { startDate: fmt(new Date(now.getFullYear(), now.getMonth() - 1, 1)), endDate: fmt(new Date(now.getFullYear(), now.getMonth(), 0)) };
    case "last3": return { startDate: fmt(new Date(now.getFullYear(), now.getMonth() - 2, 1)), endDate: fmt(now) };
    case "thisYear": return { startDate: fmt(new Date(now.getFullYear(), 0, 1)), endDate: fmt(now) };
    default: return null;
  }
};

const Reports = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  const [filters, setFilters] = useState({ startDate: firstDay, endDate: todayStr, propertyId: "" });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [activePreset, setActivePreset] = useState("thisMonth");

  const { report, isReportLoading, properties } = useReports(appliedFilters);
  const { token } = useAuthStore();

  const authHeader = { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` };

  // Monthly Trend Query
  const { data: trendData } = useQuery({
    queryKey: ["monthly-trend"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/monthly-trend`, { headers: authHeader });
      return res.data.trend ?? [];
    },
  });

  // Occupancy Query
  const { data: occupancy } = useQuery({
    queryKey: ["occupancy"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/occupancy`, { headers: authHeader });
      return res.data;
    },
  });

  const handleApply = () => { setAppliedFilters({ ...filters }); setActivePreset(""); };

  const applyPreset = (preset: string) => {
    const p = getPreset(preset);
    if (p) { setFilters(f => ({ ...f, ...p })); setAppliedFilters(f => ({ ...f, ...p })); }
    setActivePreset(preset);
  };

  // CSV Download
  const downloadCSV = (type: "transactions" | "expenses") => {
    const params = new URLSearchParams({ startDate: appliedFilters.startDate, endDate: appliedFilters.endDate });
    fetch(`${BASE_URL}/export/${type}?${params}`, { headers: authHeader })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${type}-${appliedFilters.startDate}.csv`; a.click();
        URL.revokeObjectURL(url);
      });
  };

  // Excel Download
  const downloadExcel = async () => {
    const params = new URLSearchParams({ startDate: appliedFilters.startDate, endDate: appliedFilters.endDate });
    const res = await axios.get(`${BASE_URL}/export/excel?${params}`, { headers: authHeader });
    const { transactions, expenses } = res.data;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(transactions), "লেনদেন");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expenses), "খরচ");
    XLSX.writeFile(wb, `BariBhara-Report-${appliedFilters.startDate}.xlsx`);
  };

  // Pie chart data
  const pieData = report?.propertyRevenue?.map((p: any) => ({
    name: p.property?.name?.slice(0, 14) ?? "—",
    value: p.totalCollected,
  })) ?? [];

  const barData = report?.propertyRevenue?.map((p: any) => ({
    name: p.property?.name?.slice(0, 12) ?? "—",
    আয়: p.totalCollected,
    বকেয়া: p.totalDue,
  })) ?? [];

  const presets = [
    { id: "thisMonth", label: "এই মাস" },
    { id: "lastMonth", label: "গত মাস" },
    { id: "last3", label: "শেষ ৩ মাস" },
    { id: "thisYear", label: "এই বছর" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="text-primary" size={26} /> রিপোর্ট ও বিশ্লেষণ
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">তারিখ ও প্রপার্টি অনুযায়ী গভীর আর্থিক বিশ্লেষণ</p>
        </div>
        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => downloadCSV("transactions")}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-emerald-200 text-sm">
            <Download size={14} /> লেনদেন CSV
          </button>
          <button onClick={() => downloadCSV("expenses")}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-200 text-sm">
            <Download size={14} /> খরচ CSV
          </button>
          <button onClick={downloadExcel}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-violet-200 text-sm">
            <FileSpreadsheet size={14} /> Excel ডাউনলোড
          </button>
        </div>
      </div>

      {/* Occupancy + Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-violet-50 p-5 rounded-[24px] flex items-center gap-4 col-span-2 md:col-span-1">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
            <Building2 className="text-violet-500" size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">অকুপেন্সি রেট</p>
            <p className="text-2xl font-black text-violet-700">{occupancy?.rate ?? 0}%</p>
            <p className="text-[10px] text-slate-400">{occupancy?.occupiedUnits ?? 0}/{occupancy?.totalUnits ?? 0} ইউনিট</p>
          </div>
        </div>

        {[
          { label: "মোট কালেকশন", value: `৳ ${(report?.totalCollection ?? 0).toLocaleString()}`, icon: <Wallet className="text-emerald-500" />, bg: "bg-emerald-50", text: "text-emerald-700" },
          { label: "মোট বকেয়া", value: `৳ ${(report?.totalDue ?? 0).toLocaleString()}`, icon: <AlertCircle className="text-orange-500" />, bg: "bg-orange-50", text: "text-orange-700" },
          { label: "নেট প্রফিট", value: `৳ ${(report?.netProfit ?? 0).toLocaleString()}`, icon: <TrendingUp className={report?.netProfit >= 0 ? "text-emerald-500" : "text-red-500"} />, bg: report?.netProfit >= 0 ? "bg-emerald-50" : "bg-red-50", text: report?.netProfit >= 0 ? "text-emerald-700" : "text-red-700" },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} p-5 rounded-[24px] flex items-center gap-4`}>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">{card.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">{card.label}</p>
              <p className={`text-lg font-black ${card.text}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-4">
        {/* Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          {presets.map(p => (
            <button key={p.id} onClick={() => applyPreset(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activePreset === p.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
              {p.label}
            </button>
          ))}
        </div>
        {/* Date + Property Filter */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">শুরুর তারিখ</label>
            <input type="date" value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">শেষ তারিখ</label>
            <input type="date" value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/20" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">প্রপার্টি</label>
            <select value={filters.propertyId} onChange={(e) => setFilters({ ...filters, propertyId: e.target.value })}
              className="px-4 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/20 min-w-[160px]">
              <option value="">সব প্রপার্টি</option>
              {properties?.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <button onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20">
            <Filter size={16} /> ফিল্টার করুন
          </button>
        </div>
      </div>

      {isReportLoading ? (
        <div className="py-20 flex justify-center items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="font-bold text-slate-400">রিপোর্ট লোড হচ্ছে...</span>
        </div>
      ) : (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Area Chart — Monthly Trend */}
            <div className="lg:col-span-2 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-1">মাসিক আয় ট্রেন্ড (গত ১২ মাস)</h3>
              <p className="text-xs text-slate-400 mb-5">আয় বনাম খরচের তুলনামূলক বিশ্লেষণ</p>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData ?? []}>
                    <defs>
                      <linearGradient id="colorAy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorKhoroch" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, undefined]} />
                    <Legend />
                    <Area type="monotone" dataKey="আয়" stroke="#7c3aed" strokeWidth={2.5} fill="url(#colorAy)" dot={false} />
                    <Area type="monotone" dataKey="খরচ" stroke="#ef4444" strokeWidth={2.5} fill="url(#colorKhoroch)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart — Property Revenue Share */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-1">প্রপার্টিওয়াইজ আয়</h3>
              <p className="text-xs text-slate-400 mb-5">সংগৃহীত ভাড়ার অনুপাত</p>
              {pieData.length > 0 ? (
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                        {pieData.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, undefined]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-60 flex items-center justify-center text-slate-400">
                  <p className="text-sm font-bold">কোনো ডেটা নেই</p>
                </div>
              )}
            </div>
          </div>

          {/* Bar Chart — Property Comparison */}
          {barData.length > 0 && (
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">প্রপার্টিওয়াইজ আয় বনাম বকেয়া</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      formatter={(v: any) => [`৳${Number(v).toLocaleString()}`, undefined]} />
                    <Legend />
                    <Bar dataKey="আয়" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="বকেয়া" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Transactions Table */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">ট্রানজেকশন বিবরণ</h3>
              <span className="text-sm font-bold text-slate-400">মোট: {report?.transactions?.length ?? 0}টি</span>
            </div>
            {!report?.transactions?.length ? (
              <div className="p-16 text-center text-slate-400">
                <RefreshCw className="mx-auto mb-3 opacity-30" size={40} />
                <p className="font-bold">এই সময়ের মধ্যে কোনো ট্রানজেকশন নেই</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">ভাড়াটিয়া</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">প্রপার্টি / ইউনিট</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">বিলের মাস</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">পেমেন্ট তারিখ</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">মেথড / TxID</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">পরিমাণ</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">বকেয়া</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {report.transactions.map((txn: any) => (
                      <tr key={txn._id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-black">
                              {txn.tenant?.name?.charAt(0) ?? "?"}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800">{txn.tenant?.name}</p>
                              {txn.tenant?.phone && (
                                <p className="text-[10px] text-slate-400">{txn.tenant?.phone}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-slate-600 font-bold">
                          <div className="flex items-center gap-1.5">
                            <Home size={13} className="text-slate-400" />
                            {txn.invoice?.property?.name ?? "—"} / {txn.invoice?.unit?.unitName ?? "—"}
                          </div>
                        </td>
                        <td className="p-5">
                          {txn.invoice ? (
                            <span className="px-2.5 py-1 bg-violet-50 text-violet-600 rounded-full text-[11px] font-black">
                              {txn.invoice?.month} {txn.invoice?.year}
                            </span>
                          ) : <span className="text-slate-400">—</span>}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Calendar size={13} />
                            {new Date(txn.paymentDate).toLocaleDateString("en-GB")}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="space-y-1">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black">
                              {txn.paymentMethod}
                            </span>
                            {txn.transactionId && (
                              <p className="text-[10px] text-slate-400 font-bold">TxID: {txn.transactionId}</p>
                            )}
                            {txn.note && (
                              <p className="text-[10px] text-slate-400 italic">{txn.note}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <p className="font-black text-emerald-600">৳ {txn.amount?.toLocaleString()}</p>
                        </td>
                        <td className="p-5 text-right">
                          {txn.invoice?.dueAmount > 0 ? (
                            <p className="font-bold text-orange-500 text-sm">৳ {txn.invoice?.dueAmount?.toLocaleString()}</p>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black">পরিশোধিত</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
