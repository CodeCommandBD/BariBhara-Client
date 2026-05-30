import React, { useState, useEffect } from "react";
import { Star, X, UserCheck, ShieldCheck, ThumbsUp, Sparkles, Wrench } from "lucide-react";

interface RateLandlordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ratingData: { behavior: number; maintenance: number; review: string }) => void;
  isLoading: boolean;
  existingRating?: any;
}

const RateLandlordModal = ({ isOpen, onClose, onSave, isLoading, existingRating }: RateLandlordModalProps) => {
  const [behavior, setBehavior] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (existingRating) {
      setBehavior(existingRating.behavior || 0);
      setMaintenance(existingRating.maintenance || 0);
      setReview(existingRating.review || "");
    } else {
      setBehavior(0);
      setMaintenance(0);
      setReview("");
    }
  }, [existingRating, isOpen]);

  if (!isOpen) return null;

  const overall = Math.round(((behavior + maintenance) / 2) * 10) / 10;
  const isSubmitDisabled = behavior === 0 || maintenance === 0 || isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ behavior, maintenance, review });
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
              <Star className="text-amber-500" fill="currentColor" size={22} /> বাড়িওয়ালা রেটিং
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              আপনার বাড়িওয়ালা সম্পর্কে মতামত দিন
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
                <p className="text-[10px] text-slate-400">বাড়িওয়ালার সার্বিক আচরণ কেমন?</p>
              </div>
              {renderStars(behavior, setBehavior)}
            </div>

            {/* Maintenance */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Wrench size={16} className="text-emerald-500" /> মেইনটেনেন্স (Service)
                </label>
                <p className="text-[10px] text-slate-400">কোনো সমস্যা হলে কত দ্রুত সমাধান করে?</p>
              </div>
              {renderStars(maintenance, setMaintenance)}
            </div>

            {/* Review Input */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5 block">মতামত (ঐচ্ছিক)</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="বাড়িওয়ালা সম্পর্কে আপনার বিস্তারিত মতামত লিখুন..."
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

export default RateLandlordModal;
