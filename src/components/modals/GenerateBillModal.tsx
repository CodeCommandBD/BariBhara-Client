import { useState, useEffect } from "react";
import { X, Calendar, CreditCard, Zap, Droplets, Flame, ShieldAlert, PlusCircle, Save } from "lucide-react";
import { useRent } from "@/Hook/useRent";

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
}

const GenerateBillModal = ({ isOpen, onClose, tenant }: GenerateBillModalProps) => {
  const { generateInvoiceMutation } = useRent();
  
  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  
  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    month: currentMonth,
    year: currentYear,
    waterBill: 0,
    gasBill: 0,
    electricityBill: 0,
    serviceCharge: 0,
    otherBill: "",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    // Metered unit inputs
    electricityUnits: "",
    waterUnits: "",
    gasUnits: "",
  });

  useEffect(() => {
    if (tenant?.utilityConfig) {
      const uc = tenant.utilityConfig;
      setFormData(prev => ({
        ...prev,
        electricityBill: uc.electricity?.type === "Fixed" ? Number(uc.electricity.fixedAmount) || 0 : 0,
        waterBill: uc.water?.type === "Fixed" ? Number(uc.water.fixedAmount) || 0 : 0,
        gasBill: uc.gas?.type === "Fixed" ? Number(uc.gas.fixedAmount) || 0 : 0,
        serviceCharge: uc.serviceCharge?.type === "Fixed" ? Number(uc.serviceCharge.fixedAmount) || 0 : 0,
        // Reset unit inputs when tenant changes
        electricityUnits: "",
        waterUnits: "",
        gasUnits: "",
      }));
    }
  }, [tenant]);

  // Recalculate metered bills when units change
  useEffect(() => {
    if (!tenant?.utilityConfig) return;
    const uc = tenant.utilityConfig;

    setFormData(prev => ({
      ...prev,
      electricityBill: uc.electricity?.type === "Metered"
        ? Math.round((Number(prev.electricityUnits) || 0) * (Number(uc.electricity.perUnitCost) || 0))
        : prev.electricityBill,
      waterBill: uc.water?.type === "Metered"
        ? Math.round((Number(prev.waterUnits) || 0) * (Number(uc.water.perUnitCost) || 0))
        : prev.waterBill,
      gasBill: uc.gas?.type === "Metered"
        ? Math.round((Number(prev.gasUnits) || 0) * (Number(uc.gas.perUnitCost) || 0))
        : prev.gasBill,
    }));
  }, [formData.electricityUnits, formData.waterUnits, formData.gasUnits, tenant]);

  if (!isOpen || !tenant) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateInvoiceMutation.mutate({
      tenantId: tenant._id,
      month: formData.month,
      year: formData.year,
      waterBill: formData.waterBill,
      gasBill: formData.gasBill,
      electricityBill: formData.electricityBill,
      serviceCharge: formData.serviceCharge,
      otherBill: formData.otherBill,
      dueDate: formData.dueDate,
    }, {
      onSuccess: () => onClose(),
    });
  };

  const renderUtilityField = (title: string, icon: any, key: "electricity" | "water" | "gas") => {
    const config = tenant?.utilityConfig?.[key];
    const type = config?.type || "None";
    
    if (type === "None") {
      return (
        <div className="space-y-1.5 opacity-50">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
            {icon} {title} (নেই)
          </label>
          <input disabled value="0" className="w-full px-3 py-2 bg-slate-100 rounded-xl outline-none text-sm font-bold border border-transparent text-slate-400" />
        </div>
      );
    }
    
    if (type === "Fixed") {
      return (
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
            {icon} {title} (ফিক্সড)
          </label>
          <input disabled value={formData[`${key}Bill` as keyof typeof formData]} className="w-full px-3 py-2 bg-orange-50/50 rounded-xl outline-none text-sm font-bold border border-orange-100 text-orange-700" />
        </div>
      );
    }

    if (type === "Metered") {
      const perUnitCost = Number(config?.perUnitCost) || 0;
      const units = Number(formData[`${key}Units` as keyof typeof formData]) || 0;
      const calculated = Math.round(units * perUnitCost);

      return (
        <div className="space-y-1.5 bg-blue-50/50 p-2 rounded-xl border border-blue-100">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-1 flex justify-between items-center w-full">
            <span className="flex items-center gap-1 text-blue-600">{icon} {title} (ইউনিট)</span>
            <span className="text-slate-400">প্রতি ইউনিট: ৳{perUnitCost}</span>
          </label>
          <div className="flex gap-2">
            <input 
              name={`${key}Units`} type="number" 
              value={formData[`${key}Units` as keyof typeof formData]} onChange={handleChange}
              placeholder="এই মাসে ব্যবহৃত ইউনিট"
              className="w-full px-2 py-1.5 bg-white rounded-lg outline-none text-sm font-bold border border-blue-200 focus:border-blue-400"
            />
            <div className="w-20 shrink-0 bg-blue-100/50 text-blue-700 px-2 py-1.5 rounded-lg flex items-center justify-center text-sm font-black border border-blue-200/50">
              ৳ {calculated}
            </div>
          </div>
        </div>
      );
    }
  };

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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 gap-3">
             <div className="grid grid-cols-2 gap-3">
               {renderUtilityField("বিদ্যুৎ বিল", <Zap size={14}/>, "electricity")}
               {renderUtilityField("পানির বিল", <Droplets size={14}/>, "water")}
             </div>
             <div className="grid grid-cols-2 gap-3">
               {renderUtilityField("গ্যাস বিল", <Flame size={14}/>, "gas")}
               
               <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
                   <ShieldAlert size={14}/> সার্ভিস চার্জ
                 </label>
                 <input 
                   disabled={tenant?.utilityConfig?.serviceCharge?.type === "Fixed"}
                   name="serviceCharge" type="number" 
                   value={formData.serviceCharge} onChange={handleChange}
                   className="w-full px-3 py-2 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-orange-200 disabled:opacity-70 disabled:bg-slate-100"
                 />
               </div>
             </div>
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
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase">মূল ভাড়া</p>
              <p className="text-sm font-black text-blue-700">৳ {tenant.rentAmount?.toLocaleString()}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] font-black text-blue-400 uppercase">মোট বিল (আনুমানিক)</p>
              <p className="text-lg font-black text-blue-700">
                ৳ {(
                  (tenant.rentAmount || 0) + 
                  (Number(formData.electricityBill) || 0) + 
                  (Number(formData.waterBill) || 0) + 
                  (Number(formData.gasBill) || 0) + 
                  (Number(formData.serviceCharge) || 0) + 
                  (Number(formData.otherBill) || 0)
                ).toLocaleString()}
              </p>
            </div>
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

export default GenerateBillModal;
