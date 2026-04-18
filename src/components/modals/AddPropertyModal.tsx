import { X, Building2, MapPin, Layers, ImagePlus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUIStore } from "../../store/useUIStore";
import { useProperty } from "@/Hook/useProperty"; // আপনার দেওয়া পাথ অনুযায়ী

interface PropertyFormData {
  name: string;
  location: string;
  totalFloors: number;
  images: FileList;
}

const AddPropertyModal = () => {
  const { isAddPropertyModalOpen, closeAddPropertyModal } = useUIStore();
  const { createPropertyMutation } = useProperty();
  
  // ১. সলিড ডাটা এবং প্রিভিউ স্টেট
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>();

  if (!isAddPropertyModalOpen) return null;

  // ২. ইমেজ হ্যান্ডলিং (একদম ক্লিন!)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files); // FileList কে Array তে রূপান্তর
      setSelectedFiles((prev) => [...prev, ...newFiles]); // আগের ছবির সাথে নতুনগুলো যোগ করা

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file)); // ছবির প্রিভিউ তৈরি করা
      setPreviews((prev) => [...prev, ...newPreviews]); // আগের প্রিভিউ এর সাথে নতুনগুলো যোগ করা
    }
  };

  // ৩. ইমেজ রিমুভ (একদম সহজ!)
  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index)); // ফাইল রিমুভ করা
    setPreviews((prev) => prev.filter((_, i) => i !== index)); // প্রিভিউ রিমুভ করা
  };

  const onSubmit = (data: PropertyFormData) => {
     // ১. ছবি ছাড়া সেভ করতে দেবে না
    if (selectedFiles.length === 0) {
      return alert("দয়া করে অন্তত একটি ছবি সিলেক্ট করুন!");
    }

    const formData = new FormData(); // ফাইল পাঠানোর জন্য এটি জরুরি
    formData.append("name", data.name); // form data তে নাম যোগ করা
    formData.append("location", data.location); // form data তে ঠিকানা যোগ করা
    formData.append("totalFloors", data.totalFloors.toString()); // form data তে ফ্লোর সংখ্যা যোগ করা

     // ২. লুপ চালিয়ে প্রতিটি ফাইল খামে (FormData) ভরা
    selectedFiles.forEach((file) => {
      formData.append("images", file); // form data তে ছবি যোগ করা
    });

      // ৩. ব্যাকএন্ডে পাঠানো
    createPropertyMutation.mutate(formData, {
      onSuccess: () => {
        reset();
        setSelectedFiles([]);
        setPreviews([]);
        closeAddPropertyModal();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={closeAddPropertyModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black font-headline text-slate-900">নতুন প্রপার্টি</h2>
            <p className="text-slate-500 text-sm font-body mt-1">
              সঠিক তথ্য দিয়ে আপনার প্রপার্টি নথিভুক্ত করুন।
            </p>
          </div>
          <button
            onClick={closeAddPropertyModal}
            className="p-3 hover:bg-slate-100 rounded-full transition-all active:scale-90"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Main Form (Inside the card) */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 font-headline ml-1 text-slate-700">
                <Building2 size={16} className="text-primary" /> বাড়ির নাম
              </label>
              <input
                {...register("name", { required: "নাম দেওয়া আবশ্যক" })}
                placeholder="উদা: স্বপ্নপুরী প্যালেস"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-body text-sm transition-all"
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] font-bold ml-2">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 font-headline ml-1 text-slate-700">
                <MapPin size={16} className="text-primary" /> ঠিকানা
              </label>
              <input
                {...register("location", { required: "ঠিকানা আবশ্যক" })}
                placeholder="উদা: ধানমন্ডি, ঢাকা"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-body text-sm transition-all"
              />
              {errors.location && (
                <p className="text-red-500 text-[10px] font-bold ml-2">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Total Floors */}
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 font-headline ml-1 text-slate-700">
                <Layers size={16} className="text-primary" /> মোট ফ্লোর সংখ্যা
              </label>
              <input
                type="number"
                {...register("totalFloors", {
                  required: "ফ্লোর সংখ্যা আবশ্যক",
                  min: { value: 1, message: "কমপক্ষে ১টি ফ্লোর থাকতে হবে" },
                })}
                placeholder="উদা: ৫"
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary font-body text-sm transition-all"
              />
              {errors.totalFloors && (
                <p className="text-red-500 text-[10px] font-bold ml-2">
                  {errors.totalFloors.message}
                </p>
              )}
            </div>

            {/* Custom Image Upload Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 font-headline ml-1 text-slate-700">
                <ImagePlus size={16} className="text-primary" /> ছবি যোগ করুন
              </label>
              <div className="relative h-[56px]">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-full h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center hover:border-primary transition-colors gap-2">
                  <ImagePlus size={18} className="text-slate-400" />
                  <span className="text-slate-500 text-xs font-bold">ছবি সিলেক্ট করুন</span>
                </div>
              </div>
              {errors.images && (
                <p className="text-red-500 text-[10px] font-bold ml-2">
                  {errors.images.message}
                </p>
              )}
            </div>
          </div>

          {/* Image Previews with Removal Button */}
          {previews.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold font-headline text-slate-700">প্রিভিউ:</h4>
              <div className="flex gap-3 overflow-x-auto pb-4">
                {previews.map((src, index) => (
                  <div key={index} className="relative flex-shrink-0 group">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-2xl border-2 border-white shadow-md transition-transform group-hover:scale-95"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all shadow-lg hover:scale-110 active:scale-90"
                    >
                      <X size={12} strokeWidth={4} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={createPropertyMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold font-headline py-5 rounded-[1.5rem] transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {createPropertyMutation.isPending ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  সেভ হচ্ছে...
                </>
              ) : (
                <>
                  <Building2 size={22} />
                  প্রপার্টি সেভ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;
