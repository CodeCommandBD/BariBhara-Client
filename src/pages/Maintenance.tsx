import { useState } from "react";
import { useMaintenance } from "@/Hook/useMaintenance";
import { useProperty } from "@/Hook/useProperty";
import {
  Wrench, Plus, Trash2, Calendar, Home, Search,
  X, Save, CheckCircle2, Clock, AlertTriangle,
  TrendingDown, ChevronDown, Filter, ArrowUpRight
} from "lucide-react";

// --- Types ---
type Priority = "Low" | "Medium" | "High";
type Status = "Pending" | "In Progress" | "Resolved";

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; dot: string }> = {
  High:   { label: "জরুরি",    color: "text-red-600",    bg: "bg-red-50 dark:bg-red-900/20",    dot: "bg-red-500" },
  Medium: { label: "মাঝারি",   color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-900/20", dot: "bg-amber-500" },
  Low:    { label: "কম",       color: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20", dot: "bg-green-500" },
};

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  "Pending":     { label: "অপেক্ষমাণ",    icon: <Clock size={14} />,         color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-900/20" },
  "In Progress": { label: "চলমান",         icon: <Wrench size={14} />,        color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-900/20" },
  "Resolved":    { label: "সম্পন্ন",       icon: <CheckCircle2 size={14} />,  color: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20" },
};

const emptyForm = {
  title: "", description: "", property: "", priority: "Medium" as Priority,
  cost: "", reportedDate: new Date().toISOString().split("T")[0],
};

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState<"requests" | "expenses">("requests");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [isFormOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { items, summary, isLoading, addMutation, updateStatusMutation, deleteMutation } = useMaintenance({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });
  const { properties } = useProperty();

  const filteredItems = items.filter((item: any) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.property?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.property) return;
    addMutation.mutate(form, {
      onSuccess: () => { setFormOpen(false); setForm(emptyForm); }
    });
  };

  const handleStatusChange = (id: string, status: Status) => {
    setUpdatingId(id);
    updateStatusMutation.mutate({ id, status }, {
      onSettled: () => setUpdatingId(null),
    });
  };

  return (
    <div className="space-y-8">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Wrench className="text-blue-500" size={26} /> মেইনটেন্যান্স ট্র্যাকার
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            প্রপার্টির রক্ষণাবেক্ষণ রিকোয়েস্ট পরিচালনা করুন
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:scale-105 transition-all"
        >
          <Plus size={18} /> নতুন রিকোয়েস্ট
        </button>
      </div>

      {/* সামারি কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "মোট", value: summary.total, icon: <Wrench size={18} />, color: "text-slate-600", bg: "bg-slate-50 dark:bg-slate-800" },
          { label: "অপেক্ষমাণ", value: summary.pending, icon: <Clock size={18} />, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
          { label: "চলমান", value: summary.inProgress, icon: <ArrowUpRight size={18} />, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "সম্পন্ন", value: summary.resolved, icon: <CheckCircle2 size={18} />, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} p-5 rounded-[24px] flex items-center gap-3 transition-colors`}>
            <div className={`w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">{card.label}</p>
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ফিল্টার বার */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="রিকোয়েস্ট বা প্রপার্টি সার্চ করুন..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 rounded-2xl outline-none text-sm font-bold border border-slate-100 dark:border-slate-700 shadow-sm dark:text-slate-200"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-sm font-bold border border-slate-100 dark:border-slate-700 outline-none dark:text-slate-200"
          >
            <option value="">সব স্ট্যাটাস</option>
            <option value="Pending">অপেক্ষমাণ</option>
            <option value="In Progress">চলমান</option>
            <option value="Resolved">সম্পন্ন</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl text-sm font-bold border border-slate-100 dark:border-slate-700 outline-none dark:text-slate-200"
          >
            <option value="">সব প্রায়রিটি</option>
            <option value="High">জরুরি</option>
            <option value="Medium">মাঝারি</option>
            <option value="Low">কম</option>
          </select>
        </div>
      </div>

      {/* রিকোয়েস্ট লিস্ট */}
      <div className="bg-white dark:bg-slate-800/60 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center">
            <Wrench className="mx-auto mb-3 text-slate-200 dark:text-slate-600" size={48} />
            <p className="font-bold text-slate-400">কোনো মেইনটেন্যান্স রিকোয়েস্ট নেই</p>
            <button onClick={() => setFormOpen(true)} className="mt-4 text-blue-500 text-sm font-bold hover:underline">
              + নতুন রিকোয়েস্ট যোগ করুন
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {filteredItems.map((item: any) => {
              const priority = PRIORITY_CONFIG[item.priority as Priority] ?? PRIORITY_CONFIG.Medium;
              const status = STATUS_CONFIG[item.status as Status] ?? STATUS_CONFIG.Pending;
              return (
                <div key={item._id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all">
                  {/* প্রায়রিটি ডট */}
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${priority.dot}`} />

                  {/* মূল তথ্য */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{item.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Home size={11} /> {item.property?.name}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={11} /> {new Date(item.reportedDate).toLocaleDateString("bn-BD")}
                      </span>
                      {item.cost > 0 && (
                        <span className="flex items-center gap-1 text-xs text-red-500 font-bold">
                          <TrendingDown size={11} /> ৳{item.cost?.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-1 truncate">{item.description}</p>
                    )}
                  </div>

                  {/* ব্যাজ ও অ্যাকশন */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black ${priority.bg} ${priority.color}`}>
                      {priority.label}
                    </span>

                    {/* স্ট্যাটাস ড্রপডাউন */}
                    <div className="relative">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value as Status)}
                        disabled={updatingId === item._id}
                        className={`pl-2 pr-6 py-1 rounded-full text-[10px] font-black outline-none cursor-pointer appearance-none ${status.bg} ${status.color} border-0`}
                      >
                        <option value="Pending">অপেক্ষমাণ</option>
                        <option value="In Progress">চলমান</option>
                        <option value="Resolved">সম্পন্ন</option>
                      </select>
                      <ChevronDown size={10} className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${status.color}`} />
                    </div>

                    <button
                      onClick={() => { if (window.confirm("নিশ্চিত ডিলিট করবেন?")) deleteMutation.mutate(item._id); }}
                      className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* নতুন রিকোয়েস্ট মডাল */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border-b border-blue-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Wrench className="text-blue-500" size={20} /> নতুন মেইনটেন্যান্স রিকোয়েস্ট
              </h2>
              <button onClick={() => setFormOpen(false)} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* প্রপার্টি */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">প্রপার্টি *</label>
                <select
                  value={form.property}
                  onChange={(e) => setForm({ ...form, property: e.target.value })}
                  required
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200 dark:text-slate-200"
                >
                  <option value="">সিলেক্ট করুন</option>
                  {properties?.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              {/* শিরোনাম */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">সমস্যার বিবরণ *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required placeholder="যেমন: ছাদ থেকে পানি পড়ছে"
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200 dark:text-slate-200"
                />
              </div>
              {/* বিস্তারিত */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">বিস্তারিত নোট</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2} placeholder="অতিরিক্ত তথ্য..."
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200 dark:text-slate-200 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* প্রায়রিটি */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">গুরুত্ব</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200 dark:text-slate-200"
                  >
                    <option value="High">জরুরি</option>
                    <option value="Medium">মাঝারি</option>
                    <option value="Low">কম</option>
                  </select>
                </div>
                {/* আনুমানিক খরচ */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">আনুমানিক খরচ (৳)</label>
                  <input
                    type="number" value={form.cost}
                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200 dark:text-slate-200"
                  />
                </div>
              </div>
              {/* তারিখ */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">রিপোর্টের তারিখ</label>
                <input
                  type="date" value={form.reportedDate}
                  onChange={(e) => setForm({ ...form, reportedDate: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-200 dark:text-slate-200"
                />
              </div>
              <button
                type="submit"
                disabled={addMutation.isPending}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addMutation.isPending
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> সেভ হচ্ছে...</>
                  : <><Save size={17} /> রিকোয়েস্ট সেভ করুন</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
