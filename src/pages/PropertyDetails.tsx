import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Plus, ArrowLeft, Trash2, Edit3, UserPlus, Users, PlusCircle } from "lucide-react";
import { useProperty } from "@/Hook/useProperty"; // ১. বাড়ির তথ্য আনার হুক
import { useUnit } from "@/Hook/useUnit";         // ২. ইউনিটের তথ্য এবং ডিলিট হুক
import AddUnitModal from "@/components/modals/AddUnitModal"; // ৩. নতুন ইউনিট যোগ করার মডাল
import EditPropertyModal from "@/components/modals/EditPropertyModal";
import AssignTenantModal from "@/components/modals/AssignTenantModal";
import TenantDetailModal from "@/components/modals/TenantDetailModal";
import GenerateBillModal from "@/components/modals/GenerateBillModal";

const getMapEmbedUrl = (locationName: string) => {
  return `https://maps.google.com/maps?q=${encodeURIComponent(locationName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [isTenantDetailOpen, setTenantDetailOpen] = useState(false);
  const [isBillModalOpen, setBillModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<any>(null);
  
  // ৪. হুকগুলো থেকে লাইভ ডাটা নিয়ে আসছি
  const { useSingleProperty } = useProperty();
  const { data: property, isLoading: isPropertyLoading } = useSingleProperty(id);
  
  const { useGetUnits, deleteUnitMutation } = useUnit();
  const { data: units, isLoading: isUnitsLoading } = useGetUnits(id);

  if (isPropertyLoading) return <div className="p-10 text-center font-bold">লোড হচ্ছে...</div>;

  return (
    <div className="space-y-8 pb-20">
      {/* হেডার এবং ওভারভিউ সেকশন */}
      <div className="flex items-center gap-4">
        <Link to="/properties" className="p-2 hover:bg-slate-100 rounded-full transition-all">
          <ArrowLeft size={24} className="text-slate-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">{property?.name}</h1>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-all text-slate-400 hover:text-primary"
              title="Edit Property"
            >
              <Edit3 size={18} />
            </button>
          </div>
          <p className="text-slate-500 text-sm">{property?.location}</p>
        </div>
      </div>

      {/* ৫. বিল্ডিং ইনফো কার্ড (লাইভ ডাটা সহ) */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-8 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-8 items-center flex-1 w-full">
          <div className="w-full md:w-64 h-48 rounded-2xl overflow-hidden shadow-lg bg-slate-100 flex-shrink-0">
          {property?.images?.[0] ? (
            <img
              src={property.images[0].startsWith("http") ? property.images[0] : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/${property.images[0].replace(/\\/g, "/")}`}
              className="w-full h-full object-cover"
              alt="Building"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold">
              ছবি নেই
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-black text-slate-800">
              {property?.name}
            </h2>
            <p className="text-slate-500 flex items-center justify-center md:justify-start gap-2 mt-1 text-sm">
              <MapPin size={14} /> {property?.location}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-2 bg-violet-50 text-violet-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
              {property?.totalFloors} তলা বিল্ডিং
            </span>
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-wider">
              {units?.length || 0}টি ইউনিট
            </span>
          </div>
        </div>
        </div>

        {/* 🗺️ লাইভ ম্যাপ উইজেট */}
        <div className="w-full lg:w-80 h-48 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative bg-slate-50 flex-shrink-0">
          <iframe
            title="Property Location Map"
            src={getMapEmbedUrl(property?.location || "")}
            className="w-full h-full border-none"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* ৬. ইউনিট লিস্ট এবং অ্যাড বাটন */}
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-bold text-slate-800">রুম/ফ্ল্যাট তালিকা</h3>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:scale-105 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> নতুন ইউনিট যোগ করুন
        </button>
      </div>

      {/* ৭. লাইভ ইউনিট টেবিল */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-5 text-xs font-black text-slate-400 uppercase">ইউনিট</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase">তলা</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase">ভাড়া</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase">অবস্থা</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {isUnitsLoading ? (
              <tr><td colSpan={5} className="p-10 text-center">লোড হচ্ছে...</td></tr>
            ) : units?.length === 0 ? (
              <tr><td colSpan={5} className="p-10 text-center text-slate-400">কোনো ইউনিট পাওয়া যায়নি</td></tr>
            ) : (
              units?.map((unit: any) => (
                <tr key={unit._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all group">
                  <td className="p-5 font-bold text-slate-700">{unit.unitName}</td>
                  <td className="p-5 text-sm text-slate-500 tracking-tighter">{unit.floor} তলা</td>
                  <td className="p-5 font-bold text-slate-800">৳ {unit.rent?.toLocaleString()}</td>
                  <td className="p-5">
                     <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${unit.status === 'খালি' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                       {unit.status}
                     </span>
                  </td>
                  <td className="p-5 text-right">
                     <div className="flex justify-end gap-2">
                       {unit.status === "খালি" ? (
                         <button
                           onClick={() => { setSelectedUnit(unit); setAssignModalOpen(true); }}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all"
                         >
                           <UserPlus size={13} /> ভাড়া দিন
                         </button>
                       ) : (
                         <div className="flex items-center gap-2">
                           <button
                             onClick={() => { setSelectedUnit(unit); setTenantDetailOpen(true); }}
                             className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-black hover:bg-blue-500 hover:text-white transition-all"
                           >
                             <Users size={13} /> ভাড়াটিয়া দেখুন
                           </button>
                           <button
                             onClick={() => { setSelectedUnit(unit); setBillModalOpen(true); }}
                             className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-xs font-black hover:bg-orange-500 hover:text-white transition-all"
                             title="বিল তৈরি"
                           >
                             <PlusCircle size={13} /> বিল তৈরি
                           </button>
                         </div>
                       )}
                        <button 
                            onClick={() => { setUnitToDelete(unit); setDeleteModalOpen(true); }}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-xl transition-all" 
                            title="Delete Unit"
                         >
                            <Trash2 size={14} />
                         </button>
                      </div>
                    </td>
                 </tr>
               ))
             )}
          </tbody>
        </table>
      </div>

      <AddUnitModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} propertyId={id} />

      <EditPropertyModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} property={property} />

      <AssignTenantModal
        isOpen={isAssignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        unit={selectedUnit}
        propertyId={id || ""}
      />

      <TenantDetailModal
        isOpen={isTenantDetailOpen}
        onClose={() => setTenantDetailOpen(false)}
        unitId={selectedUnit?._id}
      />

      <GenerateBillModal 
        isOpen={isBillModalOpen}
        onClose={() => setBillModalOpen(false)}
        tenant={selectedUnit?.currentTenant}
      />

      {/* 🛑 ইউনিট ডিলিট কনফার্মেশন মডাল */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] max-w-sm w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center text-red-500 animate-bounce">
              <Trash2 size={28} />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">নিশ্চিত ডিলিট করবেন?</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                আপনি কি নিশ্চিত যে আপনি <span className="font-bold text-slate-700 dark:text-slate-300">"{unitToDelete?.unitName}"</span> ইউনিটটি ডিলিট করতে চান? এই কাজটি আর ফিরিয়ে নেওয়া যাবে না।
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setDeleteModalOpen(false); setUnitToDelete(null); }}
                className="flex-1 py-3 px-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  if (unitToDelete) {
                    deleteUnitMutation.mutate(unitToDelete._id);
                  }
                  setDeleteModalOpen(false);
                  setUnitToDelete(null);
                }}
                className="flex-1 py-3 px-5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold rounded-2xl hover:shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all"
              >
                ডিলিট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
