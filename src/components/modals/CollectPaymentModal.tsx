import { useState } from "react";
import { X, CheckCircle2, CreditCard, Calendar, Hash, NotebookPen, Download, Mail, FileText } from "lucide-react";
import { useRent } from "@/Hook/useRent";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";
import { toast } from "sonner";

interface CollectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

const BASE_URL = "http://localhost:4000/api/notification";

const CollectPaymentModal = ({ isOpen, onClose, invoice }: CollectPaymentModalProps) => {
  const { collectPaymentMutation } = useRent();
  const { token } = useAuthStore();
  const [successTxnId, setSuccessTxnId] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [formData, setFormData] = useState({
    amount: invoice?.dueAmount || "",
    paymentMethod: "Cash",
    transactionId: "",
    note: "",
    paymentDate: new Date().toISOString().split('T')[0],
  });

  if (!isOpen || !invoice) return null;

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    collectPaymentMutation.mutate(
      { invoiceId: invoice._id, ...formData },
      {
        onSuccess: (data: any) => {
          // পেমেন্ট সফল হলে ট্রানজেকশন আইডি সেট করা
          setSuccessTxnId(data?.transaction?._id || null);
        },
      }
    );
  };

  // PDF ডাউনলোড
  const handleDownloadPDF = () => {
    if (!successTxnId) return;
    window.open(`${BASE_URL}/receipt/pdf/${successTxnId}`, "_blank");
  };

  // Email পাঠানো
  const handleSendEmail = async () => {
    if (!successTxnId) return;
    setSendingEmail(true);
    try {
      await axios.post(`${BASE_URL}/receipt/email/${successTxnId}`, {}, { headers: authHeader });
      toast.success("রিসিট ইমেইল পাঠানো হয়েছে!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "ইমেইল পাঠানো যায়নি!");
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden">
        {/* হেডার */}
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={22} /> পেমেন্ট গ্রহণ করুন
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ভাড়াটিয়া: <span className="font-bold text-emerald-600">{invoice.tenant?.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* পেমেন্ট সফল হলে সাকসেস স্ক্রিন */}
        {successTxnId ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">পেমেন্ট সফল! ✅</h3>
              <p className="text-slate-500 text-sm mt-1">
                ৳{Number(formData.amount).toLocaleString()} গৃহীত হয়েছে
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
              >
                <Download size={17} /> PDF রিসিট
              </button>
              {invoice.tenant?.email ? (
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="flex items-center justify-center gap-2 py-3 bg-blue-500 text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  {sendingEmail ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Mail size={17} />
                  )}
                  ইমেইল করুন
                </button>
              ) : (
                <button
                  disabled
                  title="ভাড়াটিয়ার ইমেইল নেই"
                  className="flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-not-allowed"
                >
                  <Mail size={17} /> ইমেইল নেই
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* ডিউ ইনফো */}
            <div className="flex gap-2 mb-2">
              <div className="flex-1 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase">মোট বিল</p>
                <p className="text-base font-black text-slate-700">৳ {invoice.totalAmount?.toLocaleString()}</p>
              </div>
              <div className="flex-1 p-3 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                <p className="text-[10px] font-black text-orange-400 uppercase">বকেয়া (Due)</p>
                <p className="text-base font-black text-orange-600">৳ {invoice.dueAmount?.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">প্রদত্ত পরিমাণ (৳) *</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="amount" type="number" required
                  value={formData.amount} onChange={handleChange}
                  placeholder="পরিমাণ লিখুন"
                  max={invoice.dueAmount}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-emerald-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">পেমেন্ট মেথড</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod} onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-emerald-200"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Bank">Bank</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">তারিখ</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    name="paymentDate" type="date"
                    value={formData.paymentDate} onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-[12px] font-bold border border-transparent focus:border-emerald-200"
                  />
                </div>
              </div>
            </div>

            {formData.paymentMethod !== "Cash" && (
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">TrxID / Reference</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="transactionId"
                    value={formData.transactionId} onChange={handleChange}
                    placeholder="ট্রানজেকশন আইডি"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-emerald-200"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">নোট (ঐচ্ছিক)</label>
              <div className="relative">
                <NotebookPen className="absolute left-3 top-3 text-slate-400" size={16} />
                <textarea
                  name="note"
                  value={formData.note} onChange={handleChange}
                  placeholder="পেমেন্ট সম্পর্কে কোনো নোট..."
                  rows={2}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-emerald-200 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={collectPaymentMutation.isPending}
              className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {collectPaymentMutation.isPending ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> প্রসেস হচ্ছে...</>
              ) : (
                <><CheckCircle2 size={18} /> পেমেন্ট কনফার্ম করুন</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CollectPaymentModal;
