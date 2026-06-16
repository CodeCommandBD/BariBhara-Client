import { AlertTriangle, X } from "lucide-react";
import { useConfirmStore } from "@/store/useConfirmStore";

const ConfirmModal = () => {
  const { isOpen, title, message, confirmText, cancelText, onConfirm, closeConfirm } = useConfirmStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      {/* Backdrop animation handler container */}
      <div 
        className="fixed inset-0"
        onClick={closeConfirm}
      />
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
              {title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {message}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={closeConfirm}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                if (onConfirm) onConfirm();
                closeConfirm();
              }}
              className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all"
            >
              {confirmText}
            </button>
          </div>
        </div>
        
        {/* Close button on top right */}
        <button 
          onClick={closeConfirm}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
