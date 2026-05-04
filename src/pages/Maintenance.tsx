import { useState } from "react";
import { useExpense } from "@/Hook/useExpense";
import { useProperty } from "@/Hook/useProperty";
import {
  Wrench, Plus, Trash2, Calendar, Home, Search,
  TrendingDown, AlertCircle, X, Save
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["মেরামত", "রক্ষণাবেক্ষণ", "পরিষ্কার", "ইলেকট্রিক্যাল", "প্লাম্বিং", "অন্যান্য"];

const getCategoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    "মেরামত": "bg-red-100 text-red-600",
    "রক্ষণাবেক্ষণ": "bg-blue-100 text-blue-600",
    "পরিষ্কার": "bg-green-100 text-green-600",
    "ইলেকট্রিক্যাল": "bg-yellow-100 text-yellow-700",
    "প্লাম্বিং": "bg-cyan-100 text-cyan-600",
    "অন্যান্য": "bg-slate-100 text-slate-600",
  };
  return colors[cat] ?? "bg-slate-100 text-slate-600";
};

const Maintenance = () => {
  const [isFormOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { expenses, totalExpense, isLoading, addExpenseMutation, deleteExpenseMutation } = useExpense();
  const { properties } = useProperty();

  const [form, setForm] = useState({
    property: "", title: "", category: "অন্যান্য",
    amount: "", expenseDate: new Date().toISOString().split("T")[0], note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.property) return toast.error("প্রপার্টি সিলেক্ট করুন!");
    addExpenseMutation.mutate(form, { onSuccess: () => { setFormOpen(false); setForm({ property: "", title: "", category: "অন্যান্য", amount: "", expenseDate: new Date().toISOString().split("T")[0], note: "" }); } });
  };

  const filtered = expenses.filter((e: any) =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.property?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Wrench className="text-blue-500" size={26} /> মেইনটেন্যান্স ও খরচ ট্র্যাকার
          </h1>
          <p className="text-slate-500 text-sm mt-1">প্রপার্টির রক্ষণাবেক্ষণ খরচ ট্র্যাক করুন</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:scale-105 transition-all"
        >
          <Plus size={18} /> নতুন খরচ যোগ করুন
        </button>
      </div>

      {/* সামারি কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "মোট খরচ", value: `৳ ${totalExpense?.toLocaleString()}`, icon: <TrendingDown className="text-red-500" />, bg: "bg-red-50" },
          { label: "মোট রেকর্ড", value: `${expenses.length}টি`, icon: <Wrench className="text-blue-500" />, bg: "bg-blue-50" },
          { label: "এই মাসে", value: `৳ ${expenses.filter((e: any) => new Date(e.expenseDate).getMonth() === new Date().getMonth()).reduce((s: number, e: any) => s + e.amount, 0).toLocaleString()}`, icon: <Calendar className="text-purple-500" />, bg: "bg-purple-50" },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} p-5 rounded-[28px] flex items-center gap-4`}>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">{card.icon}</div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">{card.label}</p>
              <p className="text-xl font-black text-slate-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* সার্চ বার */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text" placeholder="খরচের নাম বা প্রপার্টি দিয়ে সার্চ..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl outline-none text-sm font-bold border border-slate-100 shadow-sm"
        />
      </div>

      {/* খরচের তালিকা */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex justify-center"><div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <AlertCircle className="mx-auto mb-3 opacity-30" size={40} />
            <p className="font-bold">কোনো খরচের রেকর্ড নেই</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-left">বিবরণ</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-left">ক্যাটাগরি</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-left">প্রপার্টি</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-left">তারিখ</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase text-right">পরিমাণ</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((exp: any) => (
                <tr key={exp._id} className="hover:bg-slate-50/50 transition-all">
                  <td className="p-5">
                    <p className="font-bold text-sm text-slate-800">{exp.title}</p>
                    {exp.note && <p className="text-xs text-slate-400 mt-0.5">{exp.note}</p>}
                  </td>
                  <td className="p-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${getCategoryColor(exp.category)}`}>
                      {exp.category}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 font-bold">
                      <Home size={13} /> {exp.property?.name}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Calendar size={13} />
                      {new Date(exp.expenseDate).toLocaleDateString("bn-BD")}
                    </div>
                  </td>
                  <td className="p-5 text-right font-black text-red-500">৳ {exp.amount?.toLocaleString()}</td>
                  <td className="p-5">
                    <button
                      onClick={() => { if (window.confirm("নিশ্চিত?")) deleteExpenseMutation.mutate(exp._id); }}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* নতুন খরচ যোগ করার মডাল */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Wrench className="text-blue-500" size={20} /> নতুন খরচ
                </h2>
              </div>
              <button onClick={() => setFormOpen(false)} className="p-2 hover:bg-white rounded-full transition-all">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">প্রপার্টি *</label>
                <select name="property" value={form.property} onChange={handleChange} required
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200">
                  <option value="">প্রপার্টি সিলেক্ট করুন</option>
                  {properties?.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">ক্যাটাগরি</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">পরিমাণ (৳) *</label>
                  <input name="amount" type="number" required value={form.amount} onChange={handleChange} placeholder="0"
                    className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">বিবরণ *</label>
                <input name="title" required value={form.title} onChange={handleChange} placeholder="যেমন: ছাদ মেরামত"
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">তারিখ</label>
                <input name="expenseDate" type="date" value={form.expenseDate} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">নোট (ঐচ্ছিক)</label>
                <textarea name="note" value={form.note} onChange={handleChange} rows={2} placeholder="অতিরিক্ত তথ্য..."
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200 resize-none" />
              </div>
              <button type="submit" disabled={addExpenseMutation.isPending}
                className="w-full py-3.5 bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {addExpenseMutation.isPending
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> সেভ হচ্ছে...</>
                  : <><Save size={17} /> সেভ করুন</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
