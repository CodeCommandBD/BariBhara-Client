import { useState } from "react";
import { useReports } from "@/Hook/useReports";
import {
  BarChart3, Filter, Download, TrendingUp, TrendingDown,
  Wallet, AlertCircle, Calendar, Home, CheckCircle2, Clock, RefreshCw
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const Reports = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
  const todayStr = today.toISOString().split("T")[0];

  const [filters, setFilters] = useState({ startDate: firstDayOfMonth, endDate: todayStr, propertyId: "" });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const { report, isReportLoading, properties } = useReports(appliedFilters);

  const handleApply = () => setAppliedFilters({ ...filters });

  const getStatusStyle = (status: string) => {
    if (status === "Paid") return "bg-emerald-100 text-emerald-700";
    if (status === "Partial") return "bg-blue-100 text-blue-700";
    return "bg-red-100 text-red-700";
  };

  const getStatusLabel = (status: string) => {
    if (status === "Paid") return "সম্পূর্ণ";
    if (status === "Partial") return "আংশিক";
    return "বকেয়া";
  };

  // প্রপার্টি ওয়াইজ চার্ট ডাটা
  const chartData = report?.propertyRevenue?.map((p: any) => ({
    name: p.property?.name?.slice(0, 12) ?? "—",
    আয়: p.totalCollected,
    বকেয়া: p.totalDue,
  })) ?? [];

  return (
    <div className="space-y-8">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="text-primary" size={26} /> রিপোর্ট ও বিশ্লেষণ
          </h1>
          <p className="text-slate-500 text-sm mt-1">তারিখ ও প্রপার্টি অনুযায়ী আর্থিক বিবরণ দেখুন</p>
        </div>
      </div>

      {/* ফিল্টার বার */}
      <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-wrap gap-4 items-end">
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

      {isReportLoading ? (
        <div className="py-20 flex justify-center items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="font-bold text-slate-400">রিপোর্ট লোড হচ্ছে...</span>
        </div>
      ) : (
        <>
          {/* সামারি কার্ডস */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "মোট কালেকশন", value: `৳ ${(report?.totalCollection ?? 0).toLocaleString()}`, icon: <Wallet className="text-emerald-500" />, bg: "bg-emerald-50", text: "text-emerald-700" },
              { label: "মোট বকেয়া", value: `৳ ${(report?.totalDue ?? 0).toLocaleString()}`, icon: <AlertCircle className="text-orange-500" />, bg: "bg-orange-50", text: "text-orange-700" },
              { label: "মোট খরচ", value: `৳ ${(report?.totalExpense ?? 0).toLocaleString()}`, icon: <TrendingDown className="text-red-500" />, bg: "bg-red-50", text: "text-red-700" },
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

          {/* প্রপার্টিওয়াইজ বার চার্ট */}
          {chartData.length > 0 && (
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">প্রপার্টিওয়াইজ আয় বনাম বকেয়া</h3>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, undefined]}
                    />
                    <Legend />
                    <Bar dataKey="আয়" fill="#10b981" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="বকেয়া" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ট্রানজেকশন টেবিল */}
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
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">প্রপার্টি</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">তারিখ</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase">মেথড</th>
                      <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">পরিমাণ</th>
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
                            <p className="font-bold text-sm">{txn.tenant?.name}</p>
                          </div>
                        </td>
                        <td className="p-5 text-sm text-slate-600 font-bold">
                          <div className="flex items-center gap-1.5">
                            <Home size={13} className="text-slate-400" />
                            {txn.invoice?.property?.name ?? "—"} / {txn.invoice?.unit?.unitName ?? "—"}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Calendar size={13} />
                            {new Date(txn.paymentDate).toLocaleDateString("bn-BD")}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black">{txn.paymentMethod}</span>
                        </td>
                        <td className="p-5 text-right font-black text-emerald-600">
                          ৳ {txn.amount?.toLocaleString()}
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
