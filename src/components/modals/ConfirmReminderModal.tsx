import { Mail, AlertCircle, X, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmReminderModal = ({ isOpen, onClose, onConfirm, isLoading }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 pb-0 flex justify-end">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center space-y-6">
          <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-3xl flex items-center justify-center mx-auto">
            <Mail size={32} className="text-amber-500" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">ইমেইল রিমাইন্ডার</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              আপনি কি নিশ্চিত যে সব বকেয়া ভাড়াটিয়াদের ইমেইল রিমাইন্ডার পাঠাতে চান?
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl text-left">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              সতর্কতা: এটি সবার কাছে নোটিফিকেশন পাঠাবে যাদের বিল বকেয়া আছে। এটি কয়েক সেকেন্ড সময় নিতে পারে।
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            >
              বাতিল
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 text-white font-black rounded-2xl shadow-lg shadow-amber-200 dark:shadow-amber-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Mail size={18} />
                  পাঠান
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmReminderModal;
