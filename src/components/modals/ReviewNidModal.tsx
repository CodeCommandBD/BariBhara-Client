import { useState } from "react";
import { X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
  onVerify: (id: string, status: string, reason: string) => void;
  isLoading: boolean;
}

const ReviewNidModal = ({ isOpen, onClose, tenant, onVerify, isLoading }: Props) => {
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  if (!isOpen || !tenant) return null;

  // Find the NID document
  const nidDoc = tenant.documents?.find((d: any) => d.type === "nid");

  const handleApprove = () => {
    onVerify(tenant._id, "verified", "");
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      return alert("অনুগ্রহ করে বাতিলের কারণ উল্লেখ করুন।");
    }
    onVerify(tenant._id, "rejected", rejectReason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={!isLoading ? onClose : undefined} 
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
              NID ভেরিফিকেশন: <span className="text-primary">{tenant.name}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">জাতীয় পরিচয়পত্র যাচাই করুন</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (NID Document Preview) */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center bg-slate-50/50 dark:bg-slate-900/50">
          {!nidDoc ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p className="font-bold">ভাড়াটিয়া কোনো NID আপলোড করেননি।</p>
            </div>
          ) : (
            <div className="w-full h-[50vh] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 relative flex items-center justify-center shadow-inner">
              {nidDoc.url?.endsWith(".pdf") ? (
                <iframe src={nidDoc.url} className="w-full h-full" title="NID PDF" />
              ) : (
                <img 
                  src={nidDoc.url} 
                  alt="NID Scan" 
                  className="w-full h-full object-contain" 
                />
              )}
            </div>
          )}
        </div>

        {/* Footer (Actions) */}
        {nidDoc && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            {isRejecting ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">বাতিলের কারণ (ভাড়াটিয়াকে দেখানো হবে)</label>
                  <input 
                    type="text" 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="যেমন: ছবিটি অস্পষ্ট, আবার পরিষ্কার করে আপলোড করুন।"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:border-red-400 dark:text-slate-200"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleReject}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <AlertCircle size={18} />}
                    বাতিল নিশ্চিত করুন
                  </button>
                  <button
                    onClick={() => setIsRejecting(false)}
                    disabled={isLoading}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    ফিরে যান
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleApprove}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                  অ্যাপ্রুভ (Verified) করুন
                </button>
                <button
                  onClick={() => setIsRejecting(true)}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-2xl font-black hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                >
                  <AlertCircle size={18} />
                  রিজেক্ট করুন
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewNidModal;
