import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, FileSpreadsheet, CheckSquare, Square, Loader2 } from "lucide-react";
import BulkResultModal from "./BulkResultModal";

interface Props {
  onClose: () => void;
  properties: { _id: string; name: string }[];
}

const MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

const BASE_URL = "http://localhost:4000/api";

const BulkInvoiceModal = ({ onClose, properties }: Props) => {
  const { token } = useAuthStore();
  const authHeader = { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` };
  const queryClient = useQueryClient();

  const now = new Date();
  const [propertyId, setPropertyId] = useState("");
  const [month, setMonth] = useState(MONTHS[now.getMonth()]);
  const [year, setYear] = useState(now.getFullYear());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [extras, setExtras] = useState<any>({ waterBill: "", gasBill: "", electricityBill: "", serviceCharge: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkResult, setBulkResult] = useState<any>(null);

  // Active tenant list
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ["bulk-tenants", propertyId],
    queryFn: async () => {
      const params = propertyId ? `?propertyId=${propertyId}` : "";
      const res = await axios.get(`${BASE_URL}/bulk/tenants${params}`, { headers: authHeader });
      return res.data.tenants ?? [];
    },
  });

  // Reset selection when property changes
  useEffect(() => { setSelectedIds([]); }, [propertyId]);

  const toggleAll = () => {
    if (selectedIds.length === tenants.length) setSelectedIds([]);
    else setSelectedIds(tenants.map((t: any) => t._id));
  };

  const toggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) return toast.error("কমপক্ষে একজন ভাড়াটিয়া সিলেক্ট করুন");
    setIsSubmitting(true);
    try {
      const sanitizedExtras = {
        waterBill: Number(extras.waterBill) || 0,
        gasBill: Number(extras.gasBill) || 0,
        electricityBill: Number(extras.electricityBill) || 0,
        serviceCharge: Number(extras.serviceCharge) || 0,
      };
      const res = await axios.post(`${BASE_URL}/bulk/generate-invoices`, {
        tenantIds: selectedIds, month, year, ...sanitizedExtras,
      }, { headers: authHeader });
      
      toast.success(res.data.message);
      
      // ✅ Real-time update (Invalidate cache)
      queryClient.invalidateQueries({ queryKey: ["pending-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      
      // Show result modal instead of closing immediately
      setBulkResult(res.data.results);
      
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalEstimate = selectedIds.reduce((sum, id) => {
    const t = tenants.find((x: any) => x._id === id);
    if (!t) return sum;
    const extraTotal = (Number(extras.waterBill) || 0) +
                       (Number(extras.gasBill) || 0) +
                       (Number(extras.electricityBill) || 0) +
                       (Number(extras.serviceCharge) || 0);
    return sum + t.rentAmount + extraTotal;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center">
              <FileSpreadsheet size={20} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">বাল্ক বিল জেনারেট</h2>
              <p className="text-xs text-slate-400">একসাথে সবার জন্য বিল তৈরি করুন</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase">প্রপার্টি</label>
              <select value={propertyId} onChange={e => setPropertyId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/20">
                <option value="">সব প্রপার্টি</option>
                {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase">মাস</label>
              <select value={month} onChange={e => setMonth(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/20">
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase">বছর</label>
              <input type="number" value={year} onChange={e => setYear(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/20" />
            </div>
          </div>

          {/* Extra charges */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-3">অতিরিক্ত চার্জ (সবার জন্য একই)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "waterBill", label: "পানি বিল" },
                { key: "gasBill", label: "গ্যাস বিল" },
                { key: "electricityBill", label: "বিদ্যুৎ" },
                { key: "serviceCharge", label: "সার্ভিস চার্জ" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400">{label}</label>
                  <input type="number" min={0} value={(extras as any)[key]}
                    onChange={e => setExtras(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/20" />
                </div>
              ))}
            </div>
          </div>

          {/* Tenant List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-slate-400 uppercase">ভাড়াটিয়া সিলেক্ট করুন ({selectedIds.length}/{tenants.length})</p>
              <button onClick={toggleAll}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                {selectedIds.length === tenants.length && tenants.length > 0 ? (
                  <><CheckSquare size={14} /> সব বাদ</>
                ) : (
                  <><Square size={14} /> সব সিলেক্ট</>
                )}
              </button>
            </div>

            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            ) : tenants.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm font-bold">কোনো সক্রিয় ভাড়াটিয়া পাওয়া যায়নি</div>
            ) : (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {tenants.map((t: any) => {
                  const isSelected = selectedIds.includes(t._id);
                  const extraTotal = (Number(extras.waterBill) || 0) +
                                     (Number(extras.gasBill) || 0) +
                                     (Number(extras.electricityBill) || 0) +
                                     (Number(extras.serviceCharge) || 0);
                  const total = t.rentAmount + extraTotal;
                  return (
                    <button key={t._id} onClick={() => toggle(t._id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-left ${isSelected ? "border-violet-300 bg-violet-50" : "border-slate-100 hover:border-slate-200 bg-white"}`}>
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? "border-violet-500 bg-violet-500" : "border-slate-300"}`}>
                        {isSelected && <span className="text-white text-xs font-black">✓</span>}
                      </div>
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0">
                        {t.name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-800 truncate">{t.name}</p>
                        <p className="text-xs text-slate-400">{t.unit?.unitName} — {t.property?.name}</p>
                      </div>
                      <p className="text-sm font-black text-violet-600 flex-shrink-0">৳{total.toLocaleString()}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between sticky bottom-0 bg-white rounded-b-3xl">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">মোট আনুমানিক বিল</p>
            <p className="text-xl font-black text-violet-600">৳{totalEstimate.toLocaleString()}</p>
            <p className="text-[10px] text-slate-400">{selectedIds.length}জনের জন্য</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
              বাতিল
            </button>
            <button onClick={handleSubmit} disabled={isSubmitting || selectedIds.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all disabled:opacity-50 shadow-lg shadow-violet-200">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
              বিল তৈরি করুন
            </button>
          </div>
        </div>
      </div>

      {/* Result Modal Overlay */}
      <BulkResultModal
        isOpen={!!bulkResult}
        onClose={() => {
          setBulkResult(null);
          onClose(); // Close the main modal after reading the result
        }}
        result={bulkResult}
      />
    </div>
  );
};

export default BulkInvoiceModal;
