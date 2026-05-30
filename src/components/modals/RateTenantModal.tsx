import React, { useState, useEffect } from "react";
import { Star, X, UserCheck, ShieldCheck, ThumbsUp, Sparkles } from "lucide-react";

interface RateTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
  onSave: (id: string, ratingData: any) => void;
  isLoading: boolean;
}

const RateTenantModal = ({ isOpen, onClose, tenant, onSave, isLoading }: RateTenantModalProps) => {
  const [behavior, setBehavior] = useState(0);
  const [payment, setPayment] = useState(0);
  const [cleanliness, setCleanliness] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (tenant?.rating) {
      setBehavior(tenant.rating.behavior || 0);
      setPayment(tenant.rating.payment || 0);
      setCleanliness(tenant.rating.cleanliness || 0);
      setReview(tenant.rating.review || "");
    } else {
      setBehavior(0);
      setPayment(0);
      setCleanliness(0);
      setReview("");
    }
  }, [tenant]);

  if (!isOpen || !tenant) return null;

  const overall = Math.round(((behavior + payment + cleanliness) / 3) * 10) / 10;
  const isSubmitDisabled = behavior === 0 || payment === 0 || cleanliness === 0 || isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tenant._id, { behavior, payment, cleanliness, review });
  };

  const renderStars = (value: number, onChange: (val: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`transition-all hover:scale-110 active:scale-95 ${
              star <= value ? "text-amber-400" : "text-slate-200 dark:text-slate-700"
            }`}
          >
            <Star size={24} fill={star <= value ? "currentColor" : "none"} strokeWidth={star <= value ? 0 : 2} />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100 dark:border-slate-700">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-100 dark:border-amber-900/30 flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Star className="text-amber-500" fill="currentColor" size={22} /> ভাড়াটিয়া রেটিং
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ভাড়াটিয়া: <span className="font-bold text-amber-600 dark:text-amber-500">{tenant.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all relative z-10">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          
          {/* Overall Display */}
          <div className="mb-6 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1">সর্বমোট রেটিং (Overall)</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{overall > 0 ? overall.toFixed(1) : "0.0"}</span>
                <div className="flex text-amber-400">
                  <Star size={20} fill="currentColor" strokeWidth={0} />
                </div>
              </div>
            </div>
            {overall >= 4.5 && (
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full text-white shadow-lg shadow-amber-500/30 rotate-12">
                <Sparkles size={20} />
                <span className="text-[9px] font-black mt-0.5">TOP</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Behavior */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <UserCheck size={16} className="text-blue-500" /> আচরণ (Behavior)
                </label>
                <p className="text-[10px] text-slate-400">ভাড়াটিয়ার সার্বিক আচরণ কেমন?</p>
              </div>
              {renderStars(behavior, setBehavior)}
            </div>

            {/* Payment */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-500" /> পেমেন্ট (Payment)
                </label>
                <p className="text-[10px] text-slate-400">সময়মতো কি ভাড়া পরিশোধ করে?</p>
              </div>
              {renderStars(payment, setPayment)}
            </div>

            {/* Cleanliness */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <ThumbsUp size={16} className="text-violet-500" /> পরিচ্ছন্নতা (Cleanliness)
                </label>
                <p className="text-[10px] text-slate-400">ফ্ল্যাট কি পরিষ্কার-পরিচ্ছন্ন রাখে?</p>
              </div>
              {renderStars(cleanliness, setCleanliness)}
            </div>

            {/* Review Input */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block">মতামত (ঐচ্ছিক)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="ভাড়াটিয়া সম্পর্কে আপনার বিস্তারিত মতামত লিখুন..."
                className="w-full h-24 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-amber-400 dark:focus:border-amber-500 text-sm resize-none dark:text-slate-200"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Star size={18} fill="currentColor" />
              )}
              {isLoading ? "সেভ হচ্ছে..." : "রেটিং সাবমিট করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RateTenantModal;
