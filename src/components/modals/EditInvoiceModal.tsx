import { useState, useEffect } from "react";
import { Edit, X, Loader2, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onSave: (data: any) => void;
  isSubmitting: boolean;
}

const EditInvoiceModal = ({ isOpen, onClose, invoice, onSave, isSubmitting }: Props) => {
  const [formData, setFormData] = useState({
    waterBill: 0,
    gasBill: 0,
    electricityBill: 0,
    serviceCharge: 0,
    otherBill: 0,
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        waterBill: invoice.waterBill || 0,
        gasBill: invoice.gasBill || 0,
        electricityBill: invoice.electricityBill || 0,
        serviceCharge: invoice.serviceCharge || 0,
        otherBill: invoice.otherBill || 0,
      });
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = () => {
    onSave(formData);
  };

  const extraTotal = Object.values(formData).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const totalBill = (invoice.baseRent || 0) + extraTotal;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <Edit size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">বিল এডিট করুন</h2>
              <p className="text-xs text-slate-400">{invoice.tenant?.name} — {invoice.month}, {invoice.year}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">বেসিক ভাড়া:</span>
            <span className="text-sm font-black text-slate-800 dark:text-slate-100">৳ {invoice.baseRent?.toLocaleString()}</span>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-3">অতিরিক্ত চার্জ</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "waterBill", label: "পানি বিল" },
                { key: "gasBill", label: "গ্যাস বিল" },
                { key: "electricityBill", label: "বিদ্যুৎ" },
                { key: "serviceCharge", label: "সার্ভিস চার্জ" },
                { key: "otherBill", label: "অন্যান্য" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</label>
                  <input
                    type="number"
                    min={0}
                    value={(formData as any)[key]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [key]: Number(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-blue-500/20 dark:text-white transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between sticky bottom-0 bg-white dark:bg-slate-800">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">মোট বিল (আপডেট)</p>
            <p className="text-xl font-black text-blue-600 dark:text-blue-400">৳ {totalBill.toLocaleString()}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
            >
              বাতিল
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              সেভ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoiceModal;
