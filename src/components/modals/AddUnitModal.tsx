import { useState, useRef } from "react";
import { X, Home, CreditCard, Layers, Layout, Plus, Image as ImageIcon, Trash2 } from "lucide-react";
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
    bedrooms: "1",
    bathrooms: "1",
    area: "",
  });
  
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null; // মডাল ওপেন না থাকলে কিছু দেখাবে না

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 5) {
        alert("সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে।");
        return;
      }
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ৩. ফর্ম সাবমিট করার লজিক
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("property", formData.property);
    submitData.append("unitName", formData.unitName);
    submitData.append("floor", formData.floor);
    submitData.append("type", formData.type);
    submitData.append("rent", formData.rent);
    submitData.append("status", formData.status);
    submitData.append("bedrooms", formData.bedrooms);
    submitData.append("bathrooms", formData.bathrooms);
    submitData.append("area", formData.area);
    
    images.forEach((img) => submitData.append("images", img));

    createUnitMutation.mutate(submitData, {
      onSuccess: () => {
        onClose(); // সফলভাবে সেভ হলে মডাল বন্ধ হয়ে যাবে
        setFormData({ ...formData, unitName: "", floor: "", rent: "" }); // ফর্ম রিসেট
        setImages([]);
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">বেডরুমের সংখ্যা</label>
                <div className="relative">
                  <select 
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="1">১ রুম</option>
                    <option value="2">২ রুম</option>
                    <option value="3">৩ রুম</option>
                    <option value="4">৪ রুম</option>
                    <option value="5">৫+ রুম</option>
                  </select>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">বাথরুমের সংখ্যা</label>
                <div className="relative">
                  <select 
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="1">১ বাথ</option>
                    <option value="2">২ বাথ</option>
                    <option value="3">৩ বাথ</option>
                    <option value="4">৪+ বাথ</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">আয়তন (স্কয়ার ফিট)</label>
            <div className="relative">
              <input 
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: e.target.value})}
                placeholder="উদা: ১২০০"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold"
              />
            </div>
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">ছবির গ্যালারি (সর্বোচ্চ ৫টি)</label>
            <div 
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all cursor-pointer bg-slate-50 dark:bg-slate-800/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <ImageIcon size={24} className="text-primary" />
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-1">ক্লিক করে ছবি আপলোড করুন</p>
              <p className="text-xs text-slate-500">JPG, PNG, WEBP গ্রহণযোগ্য</p>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
