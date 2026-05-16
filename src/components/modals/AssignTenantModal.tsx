import { useState } from "react";
import { X, User, Phone, CreditCard, Calendar, Upload, IdCard, BadgeCheck } from "lucide-react";
import { useTenant } from "@/Hook/useTenant";

interface AssignTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  propertyId: string;
}

const AssignTenantModal = ({ isOpen, onClose, unit, propertyId }: AssignTenantModalProps) => {
  const { addTenantMutation } = useTenant();
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    nid: "",
    rentAmount: unit?.rent || "",
    advanceAmount: "",
    leaseStart: new Date().toISOString().split("T")[0],
    leaseEnd: "",
  });

  if (!isOpen || !unit) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("unit", unit._id);
    data.append("property", propertyId);
    data.append("name", formData.name);
    data.append("phone", formData.phone);
    data.append("nid", formData.nid);
    data.append("rentAmount", String(formData.rentAmount));
    data.append("advanceAmount", String(formData.advanceAmount || 0));
    data.append("leaseStart", formData.leaseStart);
    if (formData.leaseEnd) data.append("leaseEnd", formData.leaseEnd);
    if (photo) data.append("photo", photo);

    addTenantMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        setFormData({
          name: "", phone: "", nid: "", rentAmount: unit?.rent || "",
          advanceAmount: "", leaseStart: new Date().toISOString().split("T")[0], leaseEnd: "",
        });
        setPhoto(null);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* হেডার */}
        <div className="p-6 bg-gradient-to-r from-primary/10 to-violet-50 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BadgeCheck className="text-primary" size={22} /> ভাড়াটিয়া যোগ করুন
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ইউনিট: <span className="font-bold text-primary">{unit.unitName}</span> ({unit.floor} তলা)
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* ছবি আপলোড */}
          <div className="flex justify-center">
            <label className="cursor-pointer group">
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-200 group-hover:border-primary/50 overflow-hidden flex items-center justify-center bg-slate-50 transition-all">
                {photo ? (
                  <img src={URL.createObjectURL(photo)} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <div className="text-center">
                    <Upload size={20} className="text-slate-400 group-hover:text-primary mx-auto mb-1 transition-colors" />
                    <p className="text-[9px] text-slate-400 font-bold uppercase">ছবি</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* নাম ও ফোন */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">পুরো নাম *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="name" required
                  value={formData.name} onChange={handleChange}
                  placeholder="মোঃ রহিম উদ্দিন"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/30"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">WhatsApp নম্বর *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="phone" required
                  value={formData.phone} onChange={handleChange}
                  placeholder="01XXXXXXXXX (WhatsApp)"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/30"
                />
              </div>
              <p className="text-[10px] text-slate-400 ml-1">অটোমেটেড ইনভয়েস মেসেজের জন্য এটি প্রয়োজনীয়।</p>
            </div>
          </div>

          {/* NID */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">জাতীয় পরিচয়পত্র (NID)</label>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                name="nid"
                value={formData.nid} onChange={handleChange}
                placeholder="NID নম্বর (ঐচ্ছিক)"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/30"
              />
            </div>
          </div>

          {/* ভাড়া ও অগ্রিম */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">মাসিক ভাড়া (৳) *</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="rentAmount" type="number" required
                  value={formData.rentAmount} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/30"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">অগ্রিম (৳)</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="advanceAmount" type="number"
                  value={formData.advanceAmount} onChange={handleChange}
                  placeholder="০"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/30"
                />
              </div>
            </div>
          </div>

          {/* লিজের তারিখ */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">শুরুর তারিখ *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="leaseStart" type="date" required
                  value={formData.leaseStart} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/30"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">শেষ তারিখ</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="leaseEnd" type="date"
                  value={formData.leaseEnd} onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 rounded-xl outline-none text-sm font-bold border border-transparent focus:border-primary/30"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={addTenantMutation.isPending}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {addTenantMutation.isPending ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> যোগ করা হচ্ছে...</>
            ) : (
              <><BadgeCheck size={18} /> ভাড়াটিয়া নিশ্চিত করুন</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignTenantModal;
