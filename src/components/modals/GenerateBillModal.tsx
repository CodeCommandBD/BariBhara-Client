import { useState } from "react";
import { X, Calendar, CreditCard, Zap, Droplets, Flame, ShieldAlert, PlusCircle, Save } from "lucide-react";
import { useRent } from "@/Hook/useRent";

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
}

const GenerateBillModal = ({ isOpen, onClose, tenant }: GenerateBillModalProps) => {
  const { generateInvoiceMutation } = useRent();
  
  const currentMonth = new Date().toLocaleString('en-us', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    month: currentMonth,
    year: currentYear,
    waterBill: "",
    gasBill: "",
    electricityBill: "",
    serviceCharge: "",
    otherBill: "",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // ৭ দিন পর
  });

  if (!isOpen || !tenant) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateInvoiceMutation.mutate({
      tenantId: tenant._id,
      ...formData
    }, {
      onSuccess: () => onClose(),
    });
  };

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* হেডার */}
        <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <PlusCircle className="text-orange-500" size={22} /> বিল জেনারেট করুন
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ভাড়াটিয়া: <span className="font-bold text-orange-600">{tenant.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* মাস ও বছর */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">মাস</label>
              <select 
                name="month" 
                value={formData.month} 
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-orange-200"
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">বছর</label>
              <input 
                name="year" type="number" 
                value={formData.year} onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-orange-200"
              />
            </div>
          </div>

          {/* ইউটিলিটি বিল গ্রিড */}
          <div className="grid grid-cols-2 gap-3">
             <InputField icon={<Zap size={14}/>} label="বিদ্যুৎ বিল" name="electricityBill" value={formData.electricityBill} onChange={handleChange} placeholder="0" />
             <InputField icon={<Droplets size={14}/>} label="পানির বিল" name="waterBill" value={formData.waterBill} onChange={handleChange} placeholder="0" />
             <InputField icon={<Flame size={14}/>} label="গ্যাস বিল" name="gasBill" value={formData.gasBill} onChange={handleChange} placeholder="0" />
             <InputField icon={<ShieldAlert size={14}/>} label="সার্ভিস চার্জ" name="serviceCharge" value={formData.serviceCharge} onChange={handleChange} placeholder="0" />
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">অন্যান্য বিল / জরিমানা</label>
              <input 
                name="otherBill" type="number"
                value={formData.otherBill} onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-orange-200"
              />
          </div>

          <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">পেমেন্টের শেষ তারিখ (Due Date)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  name="dueDate" type="date"
                  value={formData.dueDate} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-orange-200"
                />
              </div>
          </div>

          {/* ইনফো বক্স */}
          <div className="p-3 bg-blue-50 rounded-2xl flex gap-3 items-center">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase">মূল ভাড়া</p>
              <p className="text-sm font-black text-blue-700">৳ {tenant.rentAmount?.toLocaleString()}</p>
            </div>
            <p className="ml-auto text-[10px] text-blue-400 font-bold max-w-[100px] text-right">মূল ভাড়ার সাথে এই বিলগুলো যোগ হবে</p>
          </div>

          <button
            type="submit"
            disabled={generateInvoiceMutation.isPending}
            className="w-full py-3.5 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {generateInvoiceMutation.isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> জেনারেট হচ্ছে...</>
            ) : (
              <><Save size={18} /> ইনভয়েস নিশ্চিত করুন</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ icon, label, name, value, onChange, placeholder }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
      {icon} {label}
    </label>
    <input 
      name={name} type="number" 
      value={value} onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-orange-200"
    />
  </div>
);

export default GenerateBillModal;
