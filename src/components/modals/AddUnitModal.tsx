import { useState } from "react";
import { X, Home, CreditCard, Layers, Layout, Plus } from "lucide-react";
import { useUnit } from "@/Hook/useUnit";

const AddUnitModal = ({ isOpen, onClose, propertyId }: any) => {
  // ১. হুক থেকে মিউটেশনটি নিয়ে আসছি
  const { createUnitMutation } = useUnit();

  // ২. ফর্মের স্টেট (State) ম্যানেজমেন্ট
  const [formData, setFormData] = useState({
    property: propertyId, // কোন বাড়ির জন্য ইউনিট তৈরি হচ্ছে
    unitName: "",
    floor: "",
    type: "ফ্ল্যাট", // ডাটাবেস মডেল অনুযায়ী বাংলা ভ্যালু
    rent: "",
    status: "খালি", // শুরুতে রুমটি খালি থাকবে
  });

  if (!isOpen) return null; // মডাল ওপেন না থাকলে কিছু দেখাবে না

  // ৩. ফর্ম সাবমিট করার লজিক
  const handleSubmit = (e: any) => {
    e.preventDefault();
    createUnitMutation.mutate(formData, {
      onSuccess: () => {
        onClose(); // সফলভাবে সেভ হলে মডাল বন্ধ হয়ে যাবে
        setFormData({ ...formData, unitName: "", floor: "", rent: "" }); // ফর্ম রিসেট
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* ৪. হেডার সেকশন */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Plus className="text-primary" /> নতুন ইউনিট যোগ করুন
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* ৫. ফর্ম সেকশন */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">ইউনিটের নাম</label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                    placeholder="যেমন: Flat 4A"
                    onChange={(e) => setFormData({...formData, unitName: e.target.value})}
                  />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">তলা / Floor</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="number"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                    placeholder="যেমন: 4"
                    onChange={(e) => setFormData({...formData, floor: e.target.value})}
                  />
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">ভাড়া / Monthly Rent</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required
                type="number"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                placeholder="৳ ১৫,০০০"
                onChange={(e) => setFormData({...formData, rent: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">ধরণ / Type</label>
            <div className="relative">
              <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm appearance-none font-bold"
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="ফ্ল্যাট">ফ্ল্যাট (Flat)</option>
                <option value="রুম">রুম (Single Room)</option>
                <option value="সিট">সিট (Hostel Seat)</option>
                <option value="দোকান">দোকান (Commercial Shop)</option>
              </select>
            </div>
          </div>

          {/* ৬. সাবমিট বাটন */}
          <button 
            disabled={createUnitMutation.isPending}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {createUnitMutation.isPending ? "যোগ করা হচ্ছে..." : "ইউনিট সেভ করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUnitModal;
