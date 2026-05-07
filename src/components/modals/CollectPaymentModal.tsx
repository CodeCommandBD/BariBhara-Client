import { useState } from "react";
import {
  X, CheckCircle2, CreditCard, Calendar, Hash,
  NotebookPen, Download, Mail, FileText, Sparkles
} from "lucide-react";
import { useRent } from "@/Hook/useRent";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface CollectPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
}

const RENT_API = "http://localhost:4000/api/rent";

const CollectPaymentModal = ({ isOpen, onClose, invoice }: CollectPaymentModalProps) => {
  const { collectPaymentMutation } = useRent();
  const { token } = useAuthStore();

  const [successData, setSuccessData] = useState<{
    invoiceId: string;
    invoiceNumber: string;
    amount: number;
    emailSent: boolean;
  } | null>(null);

  const [formData, setFormData] = useState({
    amount: invoice?.dueAmount || "",
    paymentMethod: "Cash",
    transactionId: "",
    note: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  if (!isOpen || !invoice) return null;

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    collectPaymentMutation.mutate(
      { invoiceId: invoice._id, ...formData },
      {
        onSuccess: (data: any) => {
          setSuccessData({
            invoiceId: invoice._id,
            invoiceNumber: data?.invoiceNumber ?? "N/A",
            amount: Number(formData.amount),
            emailSent: !!invoice.tenant?.email,
          });
        },
      }
    );
  };

  // ✅ PDF Download — সরাসরি backend থেকে
  const handleDownloadPDF = async () => {
    if (!successData) return;
    try {
      const res = await fetch(
        `${RENT_API}/invoice/${successData.invoiceId}/pdf`,
        { headers: authHeader }
      );
      if (!res.ok) throw new Error("PDF তৈরি করতে সমস্যা হয়েছে!");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${successData.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF ডাউনলোড শুরু হয়েছে!");
    } catch (err: any) {
      toast.error(err.message || "PDF ডাউনলোড করা যায়নি!");
    }
  };

  // Success স্ক্রিন
  if (successData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-8 text-center relative">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-white" size={42} />
            </div>
            <h3 className="text-2xl font-black text-white">পেমেন্ট সফল!</h3>
            <p className="text-white/80 text-sm mt-1">৳{successData.amount.toLocaleString()} গৃহীত হয়েছে</p>
            {/* Invoice Number Badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <FileText size={12} />
              {successData.invoiceNumber}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Email notification */}
            {successData.emailSent && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-blue-700 dark:text-blue-300">ইমেইল পাঠানো হচ্ছে</p>
                  <p className="text-[11px] text-blue-500 dark:text-blue-400">PDF রিসিট সহ ভাড়াটিয়ার ইমেইলে পাঠানো হচ্ছে।</p>
                </div>
              </div>
            )}

            {/* PDF Download button */}
            <button
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/25"
            >
              <Download size={18} />
              PDF রিসিট ডাউনলোড করুন
            </button>

            {/* Invoice details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-bold">ভাড়াটিয়া</span>
                <span className="font-black text-slate-700 dark:text-slate-200">{invoice.tenant?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-bold">মাস</span>
                <span className="font-black text-slate-700 dark:text-slate-200">{invoice.month} {invoice.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400 font-bold">পেমেন্ট মেথড</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{formData.paymentMethod}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // মূল পেমেন্ট ফর্ম
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden">
        {/* হেডার */}
        <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-emerald-100 dark:border-emerald-800/30 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={22} /> পেমেন্ট গ্রহণ করুন
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ভাড়াটিয়া: <span className="font-bold text-emerald-600 dark:text-emerald-400">{invoice.tenant?.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/70 dark:hover:bg-slate-700 rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ডিউ ইনফো */}
          <div className="flex gap-2 mb-2">
            <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase">মোট বিল</p>
              <p className="text-base font-black text-slate-700 dark:text-slate-200">৳ {invoice.totalAmount?.toLocaleString()}</p>
            </div>
            <div className="flex-1 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800/30 text-center">
              <p className="text-[10px] font-black text-orange-400 uppercase">বকেয়া (Due)</p>
              <p className="text-base font-black text-orange-600 dark:text-orange-400">৳ {invoice.dueAmount?.toLocaleString()}</p>
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
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-emerald-200 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">পেমেন্ট মেথড</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-emerald-200 dark:text-slate-200"
              >
                <option value="Cash">Cash</option>
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">তারিখ</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  name="paymentDate" type="date"
                  value={formData.paymentDate} onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-[12px] font-bold border border-transparent focus:border-emerald-200 dark:text-slate-200"
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
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-emerald-200 dark:text-slate-200"
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
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-700 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-emerald-200 resize-none dark:text-slate-200"
              />
            </div>
          </div>

          {/* PDF notice */}
          <div className="flex items-center gap-2 p-2.5 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10">
            <Sparkles size={13} className="text-primary flex-shrink-0" />
            <p className="text-[11px] text-primary font-bold">
              পেমেন্ট সফল হলে স্বয়ংক্রিয়ভাবে PDF রিসিট তৈরি হবে এবং ভাড়াটিয়াকে ইমেইল করা হবে।
            </p>
          </div>

          <button
            type="submit"
            disabled={collectPaymentMutation.isPending}
            className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {collectPaymentMutation.isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> প্রসেস হচ্ছে...</>
            ) : (
              <><CheckCircle2 size={18} /> পেমেন্ট কনফার্ম করুন</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollectPaymentModal;
