import { useState } from "react";
import { useRent } from "@/Hook/useRent";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  CreditCard, Search, Calendar, Home,
  AlertCircle, Clock, Banknote, Mail, BellRing, FileSpreadsheet,
  Edit, Trash2, CheckCircle, Download, History,
} from "lucide-react";
import CollectPaymentModal from "@/components/modals/CollectPaymentModal";
import BulkInvoiceModal from "@/components/modals/BulkInvoiceModal";
import ConfirmReminderModal from "@/components/modals/ConfirmReminderModal";
import EditInvoiceModal from "@/components/modals/EditInvoiceModal";
import DeleteConfirmModal from "@/components/modals/DeleteConfirmModal";
import { RentTableSkeleton } from "@/components/ui/SkeletonLoaders";
import Pagination from "@/components/ui/Pagination";
import { getInvoicePdfUrl } from "@/api/rent.api";

const NOTIF_URL = "http://localhost:4000/api/notification";
const ITEMS_PER_PAGE = 10;

const MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

const TABS = [
  { key: "all",     label: "সব",          color: "bg-slate-600 text-white",  inactive: "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300" },
  { key: "Unpaid",  label: "বকেয়া",        color: "bg-red-500 text-white",    inactive: "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" },
  { key: "Partial", label: "আংশিক পেইড",  color: "bg-blue-500 text-white",   inactive: "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500" },
  { key: "Paid",    label: "পেইড",         color: "bg-emerald-500 text-white", inactive: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600" },
];

const RentManagement = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { token } = useAuthStore();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isCollectModalOpen, setCollectModalOpen] = useState(false);
  const [isBulkModalOpen, setBulkModalOpen] = useState(false);
  const [isReminderModalOpen, setReminderModalOpen] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editInvoiceTarget, setEditInvoiceTarget] = useState<any>(null);
  const [deleteInvoiceTarget, setDeleteInvoiceTarget] = useState<any>(null);

  const {
    pendingInvoices, total, totalPages, isPendingLoading,
    invoiceStats, editInvoiceMutation, deleteInvoiceMutation,
  } = useRent(page, ITEMS_PER_PAGE, activeTab, filterMonth, filterYear);

  const { data: properties = [] } = useQuery({
    queryKey: ["properties-for-bulk"],
    queryFn: async () => {
      const authHeader = { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` };
      const res = await axios.get("http://localhost:4000/api/reports/properties", { headers: authHeader });
      return res.data.properties ?? [];
    },
  });

  const authHeader = { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
    setSearchTerm("");
  };

  const handleSendReminders = async () => {
    setSendingReminder(true);
    try {
      const res = await axios.post(`${NOTIF_URL}/reminder/rent`, {}, { headers: authHeader });
      toast.success(res.data.message);
      setReminderModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "ইমেইল পাঠাতে সমস্যা হয়েছে!");
    } finally {
      setSendingReminder(false);
    }
  };

  const filteredInvoices = pendingInvoices.filter((inv: any) =>
    inv.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.property?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.unit?.unitName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPdf = (invoiceId: string) => {
    const url = getInvoicePdfUrl(invoiceId);
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.click();
  };

  return (
    <div className="space-y-8 p-6">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="text-primary" size={26} /> ভাড়া ও পেমেন্ট
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">সব ইনভয়েস ম্যানেজ করুন — বকেয়া, আংশিক ও পেইড</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setBulkModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-200 hover:scale-105 transition-all">
            <FileSpreadsheet size={18} /> বাল্ক বিল
          </button>
          <button onClick={() => setReminderModalOpen(true)} disabled={sendingReminder}
            className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 dark:shadow-amber-900/30 hover:scale-105 transition-all disabled:opacity-50">
            {sendingReminder ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <BellRing size={18} />}
            ইমেইল রিমাইন্ডার
          </button>
        </div>
      </div>

      {/* স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-[28px] border border-white/50 dark:border-white/5 shadow-sm">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-wider">বকেয়া বিল</p>
          <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{invoiceStats.Unpaid.count}</p>
          <p className="text-xs font-bold text-red-400 mt-0.5">৳ {invoiceStats.Unpaid.totalDue.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-[28px] border border-white/50 dark:border-white/5 shadow-sm">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">আংশিক পেইড</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{invoiceStats.Partial.count}</p>
          <p className="text-xs font-bold text-blue-400 mt-0.5">৳ {invoiceStats.Partial.totalDue.toLocaleString()} বাকি</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-[28px] border border-white/50 dark:border-white/5 shadow-sm">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">পেইড</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{invoiceStats.Paid.count}</p>
          <p className="text-xs font-bold text-emerald-500 mt-0.5">সম্পূর্ণ পরিশোধিত</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 p-5 rounded-[28px] border border-white/50 dark:border-white/5 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">চলতি মাস</p>
          <p className="text-lg font-black text-slate-700 dark:text-slate-200 mt-1">
            {new Date().toLocaleString("bn-BD", { month: "long" })}
          </p>
          <p className="text-xs font-bold text-slate-400 mt-0.5">{new Date().getFullYear()}</p>
        </div>
      </div>

      {/* ট্যাব + ফিল্টার বার */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const count = tab.key === "all"
              ? invoiceStats.Unpaid.count + invoiceStats.Partial.count + invoiceStats.Paid.count
              : invoiceStats[tab.key]?.count ?? 0;
            const isActive = activeTab === tab.key;
            return (
              <button key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${isActive ? tab.color : `bg-slate-50 dark:bg-slate-700/50 ${tab.inactive}`}`}>
                {tab.label}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isActive ? "bg-white/25" : "bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + Month/Year Filter */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="ভাড়াটিয়া, প্রপার্টি বা ইউনিট দিয়ে খুঁজুন..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/20 dark:text-slate-200 dark:placeholder:text-slate-500"
              value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} />
          </div>
          <select value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none text-sm font-bold dark:text-slate-200 border border-transparent focus:border-primary/20">
            <option value="">সব মাস</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterYear} onChange={(e) => { setFilterYear(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none text-sm font-bold dark:text-slate-200 border border-transparent focus:border-primary/20">
            <option value="">সব বছর</option>
            {[2023, 2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {(filterMonth || filterYear) && (
            <button onClick={() => { setFilterMonth(""); setFilterYear(""); setPage(1); }}
              className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl text-sm font-bold hover:bg-red-100 transition-all">
              ক্লিয়ার
            </button>
          )}
        </div>
      </div>

      {/* বিল টেবিল */}
      {isPendingLoading ? (
        <RentTableSkeleton />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-700/50">
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">ভাড়াটিয়া ও ইউনিট</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">মাস / বছর</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">মোট বিল</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">পেইড / বাকি</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">স্ট্যাটাস</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-slate-400 dark:text-slate-500 font-bold">
                      {activeTab === "Paid" ? "কোনো পেইড বিল পাওয়া যায়নি" : "কোনো বিল পাওয়া যায়নি"}
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((inv: any) => (
                    <tr key={inv._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
                            {inv.tenant?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 dark:text-slate-100">{inv.tenant?.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                              <Home size={10} /> {inv.property?.name} • {inv.unit?.unitName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold text-sm">
                          <Calendar size={14} className="text-slate-400" />
                          {inv.month}, {inv.year}
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200">৳ {inv.totalAmount?.toLocaleString()}</p>
                      </td>
                      <td className="p-5">
                        {inv.status === "Paid" ? (
                          <div>
                            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">৳ {inv.paidAmount?.toLocaleString()}</p>
                            <p className="text-[10px] text-emerald-500 font-bold">সম্পূর্ণ পরিশোধিত</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-black text-orange-600 dark:text-orange-400">৳ {inv.dueAmount?.toLocaleString()} বাকি</p>
                            {inv.paidAmount > 0 && (
                              <p className="text-[10px] text-slate-400 font-bold">৳ {inv.paidAmount?.toLocaleString()} পেইড</p>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          inv.status === "Paid"
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                            : inv.status === "Partial"
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        }`}>
                          {inv.status === "Paid" ? "✓ পেইড" : inv.status === "Partial" ? "আংশিক" : "বকেয়া"}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {/* PDF ডাউনলোড — সব স্ট্যাটাসে */}
                          <button onClick={() => handleDownloadPdf(inv._id)}
                            className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl transition-all"
                            title="PDF ডাউনলোড">
                            <Download size={15} />
                          </button>

                          {/* ইমেইল রিমাইন্ডার — Unpaid / Partial */}
                          {inv.tenant?.email && inv.status !== "Paid" && (
                            <button title="ইমেইল রিমাইন্ডার"
                              onClick={async () => {
                                try {
                                  await axios.post(`${NOTIF_URL}/reminder/rent`, {}, { headers: authHeader });
                                  toast.success("রিমাইন্ডার পাঠানো হয়েছে!");
                                } catch { toast.error("পাঠানো যায়নি!"); }
                              }}
                              className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl transition-all">
                              <Mail size={15} />
                            </button>
                          )}

                          {/* টাকা গ্রহণ — Unpaid / Partial */}
                          {inv.status !== "Paid" && (
                            <button onClick={() => { setSelectedInvoice(inv); setCollectModalOpen(true); }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all">
                              <Banknote size={14} /> টাকা গ্রহণ
                            </button>
                          )}

                          {/* পেইড ব্যাজ */}
                          {inv.status === "Paid" && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl text-xs font-black">
                              <CheckCircle size={14} /> পরিশোধিত
                            </span>
                          )}

                          {/* এডিট + ডিলিট — শুধু Unpaid */}
                          {inv.status === "Unpaid" && (
                            <>
                              <button onClick={() => { setEditInvoiceTarget(inv); setEditModalOpen(true); }}
                                className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all"
                                title="এডিট করুন">
                                <Edit size={15} />
                              </button>
                              <button onClick={() => { setDeleteInvoiceTarget(inv); setDeleteConfirmOpen(true); }}
                                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-all"
                                title="ডিলিট করুন">
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-50 dark:border-slate-700">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} total={total} itemsPerPage={ITEMS_PER_PAGE} />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CollectPaymentModal
        key={selectedInvoice?._id ?? "no-invoice"}
        isOpen={isCollectModalOpen}
        onClose={() => setCollectModalOpen(false)}
        invoice={selectedInvoice}
      />

      {isBulkModalOpen && (
        <BulkInvoiceModal onClose={() => setBulkModalOpen(false)} properties={properties} />
      )}

      <ConfirmReminderModal isOpen={isReminderModalOpen} onClose={() => setReminderModalOpen(false)} onConfirm={handleSendReminders} isLoading={sendingReminder} />

      <EditInvoiceModal
        isOpen={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditInvoiceTarget(null); }}
        invoice={editInvoiceTarget}
        isSubmitting={editInvoiceMutation.isPending}
        onSave={(data) => {
          editInvoiceMutation.mutate(
            { invoiceId: editInvoiceTarget?._id, data },
            { onSuccess: () => { setEditModalOpen(false); setEditInvoiceTarget(null); } }
          );
        }}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => { setDeleteConfirmOpen(false); setDeleteInvoiceTarget(null); }}
        isLoading={deleteInvoiceMutation.isPending}
        onConfirm={() => {
          if (deleteInvoiceTarget) {
            deleteInvoiceMutation.mutate(deleteInvoiceTarget._id, {
              onSuccess: () => { setDeleteConfirmOpen(false); setDeleteInvoiceTarget(null); }
            });
          }
        }}
      />
    </div>
  );
};

// স্ট্যাটাস কার্ড — Dark Mode সহ
const StatusCard = ({ icon, label, value, bg }: any) => (
  <div className={`${bg} p-6 rounded-[32px] flex items-center gap-5 border border-white/50 dark:border-white/5 shadow-sm`}>
    <div className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-black text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);

export default RentManagement;
