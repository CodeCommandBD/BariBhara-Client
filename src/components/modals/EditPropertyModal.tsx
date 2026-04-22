import { Building2, Layers, MapPin, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useProperty } from "../../Hook/useProperty";

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

const EditPropertyModal = ({ isOpen, onClose, property }: EditPropertyModalProps) => {
  const { updatePropertyMutation } = useProperty();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    totalFloors: "",
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  useEffect(() => {
    if (property && isOpen) {
      setFormData({
        name: property.name || "",
        location: property.location || "",
        totalFloors: property.totalFloors || "",
      });
      setExistingImages(property.images || []);
      setSelectedImages([]);
    }
  }, [property, isOpen]);

  if (!isOpen) return null;

  const handleRemoveExisting = (path: string) => {
    setExistingImages(prev => prev.filter(img => img !== path));
  };

  const handleRemoveNew = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("location", formData.location);
    data.append("totalFloors", formData.totalFloors);
    
    existingImages.forEach(img => {
      data.append("existingImages", img);
    });

    selectedImages.forEach((image) => {
      data.append("images", image);
    });
    
    updatePropertyMutation.mutate({ id: property._id, formData: data }, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="text-primary" /> প্রপার্টি আপডেট করুন
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">প্রপার্টির নাম</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold"
                    />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">মোট তলা</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="number"
                      value={formData.totalFloors}
                      onChange={(e) => setFormData({...formData, totalFloors: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold"
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">লোকেশন</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl outline-none text-sm font-bold"
                  />
                </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">ফটো গ্যালারি</label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {existingImages.map((path, idx) => (
                  <div key={`existing-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group shadow-sm">
                    <img 
                      src={path.startsWith("http") ? path : `http://localhost:4000/${path.replace(/\\/g, "/")}`} 
                      className="w-full h-full object-cover" 
                      alt="Existing" 
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all" />
                    <button 
                      type="button"
                      onClick={() => handleRemoveExisting(path)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {selectedImages.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-100 group shadow-sm ring-2 ring-emerald-50">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="New" />
                    <button 
                      type="button"
                      onClick={() => handleRemoveNew(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                    >
                      <X size={12} />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-emerald-500 text-[8px] text-white px-1 rounded font-black uppercase">New</div>
                  </div>
                ))}
                
                <label className="relative aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-white hover:border-primary/50 transition-all cursor-pointer group">
                   <Upload className="text-slate-400 group-hover:text-primary transition-colors" size={20} />
                   <p className="text-[8px] text-slate-400 font-black uppercase mt-1 group-hover:text-primary transition-colors text-center px-1">যোগ করুন</p>
                   <input 
                    type="file" 
                    multiple
                    accept="image/*"
                    onChange={(e) => setSelectedImages(prev => [...prev, ...Array.from(e.target.files || [])])}
                    className="hidden"
                   />
                </label>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={updatePropertyMutation.isPending}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {updatePropertyMutation.isPending ? "আপডেট হচ্ছে..." : "পরিবর্তনগুলো সেভ করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyModal;
