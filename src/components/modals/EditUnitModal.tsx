import { useState, useRef, useEffect } from "react";
import { X, Home, CreditCard, Layers, Layout, Edit3, Image as ImageIcon, Trash2 } from "lucide-react";
import { useUnit } from "@/Hook/useUnit";
import { toast } from "sonner";

const EditUnitModal = ({ isOpen, onClose, unit }: any) => {
  const { updateUnitMutation } = useUnit();

  const [formData, setFormData] = useState({
    unitName: "",
    floor: "",
    type: "ফ্ল্যাট",
    rent: "",
    status: "খালি",
    bedrooms: "1",
    bathrooms: "1",
    balcony: "0",
    kitchen: "0",
    gas: "নেই",
    area: "",
  });
  
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (unit && isOpen) {
      setFormData({
        unitName: unit.unitName || "",
        floor: unit.floor || "",
        type: unit.type || "ফ্ল্যাট",
        rent: unit.rent || "",
        status: unit.status || "খালি",
        bedrooms: unit.bedrooms?.toString() || "1",
        bathrooms: unit.bathrooms?.toString() || "1",
        balcony: unit.balcony?.toString() || "0",
        kitchen: unit.kitchen?.toString() || "0",
        gas: unit.gas || "নেই",
        area: unit.area || "",
      });
      setExistingImages(unit.images || []);
      setImages([]);
    }
  }, [unit, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (existingImages.length + images.length + newFiles.length > 5) {
        toast.warning("সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে।");
        return;
      }
      setImages((prev) => [...prev, ...newFiles]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };
  


  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("unitName", formData.unitName);
    submitData.append("floor", formData.floor);
    submitData.append("type", formData.type);
    submitData.append("rent", formData.rent);
    submitData.append("status", formData.status);
    submitData.append("bedrooms", formData.bedrooms);
    submitData.append("bathrooms", formData.bathrooms);
    submitData.append("balcony", formData.balcony);
    submitData.append("kitchen", formData.kitchen);
    submitData.append("gas", formData.gas);
    submitData.append("area", formData.area);
    
    existingImages.forEach((img) => submitData.append("existingImages", img));
    images.forEach((img) => submitData.append("images", img));

    updateUnitMutation.mutate({ unitId: unit._id, data: submitData }, {
      onSuccess: () => {
        onClose();
        setImages([]);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        
        {/* ৪. হেডার সেকশন */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Edit3 className="text-primary" /> ইউনিট এডিট করুন
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* ৫. ফর্ম সেকশন */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">ইউনিটের নাম</label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
                    placeholder="যেমন: Flat 4A"
                    value={formData.unitName}
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
                    value={formData.floor}
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
                value={formData.rent}
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
                value={formData.type}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">বারান্দা</label>
                <div className="relative">
                  <select 
                    value={formData.balcony}
                    onChange={(e) => setFormData({...formData, balcony: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="0">নেই</option>
                    <option value="1">১ বারান্দা</option>
                    <option value="2">২ বারান্দা</option>
                    <option value="3">৩+ বারান্দা</option>
                  </select>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">কিচেন</label>
                <div className="relative">
                  <select 
                    value={formData.kitchen}
                    onChange={(e) => setFormData({...formData, kitchen: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="0">নেই</option>
                    <option value="1">১ কিচেন</option>
                    <option value="2">২+ কিচেন</option>
                  </select>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">গ্যাসের সুবিধা</label>
                <div className="relative">
                  <select 
                    value={formData.gas}
                    onChange={(e) => setFormData({...formData, gas: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold appearance-none cursor-pointer"
                  >
                    <option value="নেই">নেই</option>
                    <option value="লাইনের গ্যাস">লাইনের গ্যাস</option>
                    <option value="সিলিন্ডার">সিলিন্ডার</option>
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
            {(existingImages.length > 0 || images.length > 0) && (
              <div className="flex flex-wrap gap-3 mt-4">
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} className="relative group w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-slate-200">
                    <img src={img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/${img.replace(/\\/g, "/")}`} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeExistingImage(idx); }}
                      className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                ))}
                {images.map((img, idx) => (
                  <div key={`new-${idx}`} className="relative group w-20 h-20 rounded-xl overflow-hidden shadow-sm border border-slate-200">
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
            disabled={updateUnitMutation.isPending}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {updateUnitMutation.isPending ? "আপডেট হচ্ছে..." : "ইউনিট আপডেট করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUnitModal;
