import { Building2, MapPin, MoreVertical, Plus } from "lucide-react";
import { useProperty } from "../Hook/useProperty"; // আমাদের বানানো প্রপার্টি হুক
import { useUIStore } from "../store/useUIStore"; // মডাল ওপেন করার জন্য স্টোর
import { useConfirmStore } from "../store/useConfirmStore";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import EditPropertyModal from "@/components/modals/EditPropertyModal";
import { Edit3, Trash2, Share2 } from "lucide-react";
import { PropertiesGridSkeleton } from "@/components/ui/SkeletonLoaders";
import EmptyState from "@/components/ui/EmptyState";

const Properties = () => {
  // ২. হুক থেকে প্রপার্টি লিস্ট এবং লোডিং স্টেট নিয়ে আসা
  const { properties, isPropertiesLoading, deletePropertyMutation } = useProperty(); 
  
  // ৩. মডাল এবং মেনু স্টেট
  const { openAddPropertyModal } = useUIStore();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null); // কোন কার্ডের মেনু খোলা
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  // ৪. শেয়ার ফাংশন (লিঙ্ক কপি করা)
  const handleShare = (propertyId: string) => {
    const url = `${window.location.origin}/properties/${propertyId}`;
    navigator.clipboard.writeText(url);
    toast.success("লিঙ্ক কপি করা হয়েছে!");
    setOpenMenuId(null);
  };

  // ৫. ডিলিট ফাংশন
  const { openConfirm } = useConfirmStore();
  const handleDelete = (id: string) => {
    openConfirm({
      title: "প্রপার্টি ডিলিট",
      message: "আপনি কি নিশ্চিত যে এই প্রপার্টিটি ডিলিট করতে চান? এটি ডিলিট করলে এর সব রুম এবং ডাটাও মুছে যাবে!",
      confirmText: "ডিলিট করুন",
      onConfirm: () => deletePropertyMutation.mutate(id),
    });
    setOpenMenuId(null);
  };

  if (isPropertiesLoading) return <PropertiesGridSkeleton />;

  return (
    <div className="space-y-8 p-6">
      {/* ৪. হেডার সেকশন */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-headline">
            আপনার প্রপার্টিসমূহ
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            আপনার মালিকানাধীন সব বিল্ডিং এবং হাউজিং প্রকল্পের তালিকা
          </p>
        </div>

        <button
          onClick={openAddPropertyModal}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> নতুন বিল্ডিং যোগ করুন
        </button>
      </div>

      {/* ৫. গ্রিড লেআউট */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {properties?.map((property: any) => (
          <div
            key={property._id}
            className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/40 transition-all group"
          >
            {/* ছবির সেকশন */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={
                  property.images && property.images.length > 0
                    ? property.images[0].startsWith("http")
                      ? property.images[0]
                      : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/${property.images[0].replace(/\\/g, "/")}`
                    : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                }
                alt={property.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* ছবির ওপর হালকা কালো শেড (Overlay) যাতে বাটনগুলো স্পষ্ট হয় */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenMenuId(openMenuId === property._id ? null : property._id);
                  }}
                  className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40 transition-all shadow-lg border border-white/20"
                >
                  <MoreVertical size={18} />
                </button>

                {openMenuId === property._id && (
                  <>
                    {/* মেনুর বাইরে ক্লিক করলে বন্ধ করার জন্য একটি অদৃশ্য পর্দা */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setOpenMenuId(null)}
                    />
                    
                    {/* ড্রপডাউন মেনু */}
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => {
                          setSelectedProperty(property);
                          setEditModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-all font-bold"
                      >
                        <Edit3 size={16} className="text-blue-500" /> এডিট করুন
                      </button>
                      <button 
                        onClick={() => handleShare(property._id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-all font-bold"
                      >
                        <Share2 size={16} className="text-emerald-500" /> শেয়ার করুন
                      </button>
                      <button 
                        onClick={() => handleDelete(property._id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-all font-bold border-t border-slate-50"
                      >
                        <Trash2 size={16} /> ডিলিট করুন
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {property.name}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 mt-1">
                  <MapPin size={14} /> {property.location}
                </p>
              </div>

              <div className="flex flex-col pt-5 border-t border-slate-50 dark:border-slate-700 gap-4">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl flex-shrink-0">
                    <Building2 size={18} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black">স্ট্রাকচার</p>
                    <p className="text-xs font-bold dark:text-slate-200">{property.totalFloors} তলা বিল্ডিং</p>
                  </div>
                </div>
                <Link to={`/properties/${property._id}`} className="w-full py-3.5 bg-slate-50 dark:bg-slate-700 text-primary text-xs font-black rounded-2xl hover:bg-primary hover:text-white transition-all text-center block">
                  ডিটেইলস দেখুন
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {properties?.length === 0 && (
        <EmptyState
          title="কোনো বিল্ডিং বা বাড়ি তালিকাভুক্ত নেই!"
          description="ভাড়া ও ভাড়াটিয়া ম্যানেজমেন্টের প্রথম ধাপ হিসেবে আপনার প্রথম প্রজেক্ট বা বিল্ডিংটি যোগ করুন।"
          icon={Building2}
          actionText="প্রথম বিল্ডিং যোগ করুন +"
          onAction={openAddPropertyModal}
        />
      )}

       <EditPropertyModal 
         isOpen={isEditModalOpen}
         onClose={() => setEditModalOpen(false)}
         property={selectedProperty}
       />
    </div>
  );
};

export default Properties;
