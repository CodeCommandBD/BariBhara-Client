import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: {
    created: number;
    skipped: number;
    errors?: string[];
  } | null;
}

const BulkResultModal = ({ isOpen, onClose, result }: Props) => {
  if (!isOpen || !result) return null;

  const hasDuplicates = result.skipped > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 pb-0 flex justify-end">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="px-8 pb-8 text-center space-y-6">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto ${hasDuplicates ? "bg-amber-100 dark:bg-amber-900/30 text-amber-500" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500"}`}>
            {hasDuplicates ? <AlertTriangle size={32} /> : <CheckCircle size={32} />}
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
              {hasDuplicates ? "কিছু বিল ডুপ্লিকেট ছিল!" : "সফলভাবে তৈরি হয়েছে!"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              আপনার বাল্ক বিল জেনারেশনের ফলাফল নিচে দেওয়া হলো:
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 space-y-3 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-600">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">নতুন তৈরি হয়েছে:</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{result.created} টি</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300">ইতিমধ্যেই ছিল (স্কিপ করা হয়েছে):</span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400">{result.skipped} টি</span>
            </div>
          </div>

          {hasDuplicates && (
            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">
              * সিস্টেম স্বয়ংক্রিয়ভাবে ডুপ্লিকেট বিল তৈরি করা থেকে বিরত থেকেছে যাতে একই মাসে দুবার বিল না হয়।
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-800 dark:bg-slate-700 text-white font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            ঠিক আছে, বুঝতে পেরেছি
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkResultModal;
