import React, { useState } from "react";
import { X, CalendarClock } from "lucide-react";

interface ManualRenewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
  onRenew: (id: string, newEndDate: string) => void;
}

const ManualRenewModal: React.FC<ManualRenewModalProps> = ({ isOpen, onClose, tenant, onRenew }) => {
  const [newEndDate, setNewEndDate] = useState("");

  if (!isOpen || !tenant) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEndDate) return;
    onRenew(tenant._id, newEndDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[32px] p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <X size={18} strokeWidth={3} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <CalendarClock size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">লিজ নবায়ন করুন</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {tenant.name} - {tenant.unit?.unitName}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              নতুন মেয়াদ শেষ হওয়ার তারিখ <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              নিশ্চিত করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualRenewModal;
