import { useState } from "react";
import { useRent } from "@/Hook/useRent";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";
import {
  CreditCard, Search, Filter, Calendar, Home,
  AlertCircle, Clock, Banknote, Mail, BellRing,
} from "lucide-react";
import CollectPaymentModal from "@/components/modals/CollectPaymentModal";
import { RentTableSkeleton } from "@/components/ui/SkeletonLoaders";
import Pagination from "@/components/ui/Pagination";

const BASE_URL = "http://localhost:4000/api/notification";
const ITEMS_PER_PAGE = 10;

const RentManagement = () => {
  const [page, setPage] = useState(1);
  const { pendingInvoices, total, totalPages, isPendingLoading } = useRent(page, ITEMS_PER_PAGE);
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isCollectModalOpen, setCollectModalOpen] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  // বাল্ক রিমাইন্ডার
  const handleSendReminders = async () => {
    if (!window.confirm("সব বকেয়া ভাড়াটিয়াদের ইমেইল রিমাইন্ডার পাঠাবেন?")) return;
    setSendingReminder(true);
    try {
      const res = await axios.post(`${BASE_URL}/reminder/rent`, {}, { headers: authHeader });
      toast.success(res.data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "ইমেইল পাঠাতে সমস্যা হয়েছে!");
    } finally {
      setSendingReminder(false);
    }
  };

  // client-side filter (current page only)
  const filteredInvoices = pendingInvoices.filter((inv: any) =>
    inv.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.property?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.unit?.unitName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDue = pendingInvoices.reduce((acc: number, inv: any) => acc + (inv.dueAmount ?? 0), 0);

  return (
    <div className="space-y-8 p-6">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="text-primary" size={26} /> ভাড়া ও পেমেন্ট
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">সব বকেয়া এবং পেন্ডিং বিল ম্যানেজ করুন</p>
        </div>
        <button
          onClick={handleSendReminders}
          disabled={sendingReminder}
          className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white font-bold rounded-2xl shadow-lg shadow-amber-200 dark:shadow-amber-900/30 hover:scale-105 transition-all disabled:opacity-50"
        >
          {sendingReminder
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <BellRing size={18} />}
          ইমেইল রিমাইন্ডার
        </button>
      </div>

      {/* স্ট্যাটাস কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard icon={<Banknote className="text-orange-500" />} label="মোট বকেয়া বিল" value={total} bg="bg-orange-50 dark:bg-orange-900/20" />
        <StatusCard icon={<AlertCircle className="text-red-500" />} label="সর্বমোট বকেয়া টাকা" value={`৳ ${totalDue.toLocaleString()}`} bg="bg-red-50 dark:bg-red-900/20" />
        <StatusCard icon={<Clock className="text-blue-500" />} label="চলতি মাস" value={new Date().toLocaleString("bn-BD", { month: "long", year: "numeric" })} bg="bg-blue-50 dark:bg-blue-900/20" />
      </div>

      {/* সার্চ বার */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ভাড়াটিয়া, প্রপার্টি বা ইউনিট দিয়ে সার্চ করুন..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/20 dark:text-slate-200 dark:placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">
          <Filter size={18} /> ফিল্টার
        </button>
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
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">বকেয়া (Due)</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">স্ট্যাটাস</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-slate-400 dark:text-slate-500 font-bold">
                      কোনো বকেয়া বিল পাওয়া যায়নি
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
                        <p className="text-sm font-black text-orange-600 dark:text-orange-400">৳ {inv.dueAmount?.toLocaleString()}</p>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          inv.status === "Partial"
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                            : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        }`}>
                          {inv.status === "Partial" ? "আংশিক পেইড" : "বকেয়া"}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.tenant?.email && (
                            <button
                              title="ইমেইল রিমাইন্ডার"
                              onClick={async () => {
                                try {
                                  await axios.post(`${BASE_URL}/reminder/rent`, {}, { headers: authHeader });
                                  toast.success("রিমাইন্ডার পাঠানো হয়েছে!");
                                } catch {
                                  toast.error("পাঠানো যায়নি!");
                                }
                              }}
                              className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl transition-all"
                            >
                              <Mail size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => { setSelectedInvoice(inv); setCollectModalOpen(true); }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-100 dark:shadow-emerald-900/30 hover:scale-105 active:scale-95 transition-all"
                          >
                            <Banknote size={14} /> টাকা গ্রহণ
                          </button>
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
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                total={total}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </div>
          )}
        </div>
      )}

      <CollectPaymentModal
        isOpen={isCollectModalOpen}
        onClose={() => setCollectModalOpen(false)}
        invoice={selectedInvoice}
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
