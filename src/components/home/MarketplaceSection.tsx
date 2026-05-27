import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface PropertyOwner {
  fullName: string;
  phoneNumber: string;
  email: string;
  isVerified?: string;
}

interface PublicUnit {
  _id: string;
  unitName: string;
  floor: number;
  rent: number;
  status: string;
  type: string;
}

interface PublicProperty {
  _id: string;
  name: string;
  location: string;
  rent: number;
  minRent?: number;
  maxRent?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  contactNumber: string;
  images: string[];
  owner: PropertyOwner;
  units?: PublicUnit[];
  googleMapUrl?: string;
}

const getMapEmbedUrl = (locationName: string) => {
  return `https://maps.google.com/maps?q=${encodeURIComponent(locationName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
};

import { useUIStore } from "@/store/useUIStore";

const MarketplaceSection = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<PublicProperty | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const { searchLocation, searchHouseType, searchBudget, setSearchFilters } = useUIStore();

  // ১. তানস্ট্যাক কুয়েরি দিয়ে পাবলিক লিস্টিং ফেচ করা
  const { data: properties, isLoading } = useQuery<PublicProperty[]>({
    queryKey: ["public-properties"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public/properties`);
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });

  // ২. অ্যাডভান্সড ক্লায়েন্ট-সাইড ফিল্টারিং লজিক
  const filteredProperties = properties?.filter((property) => {
    // ক) লোকেশন ফিল্টার
    if (searchLocation && !property.location.toLowerCase().includes(searchLocation.toLowerCase())) {
      return false;
    }

    // খ) বাসার ধরণ ফিল্টার
    if (searchHouseType) {
      const typeLower = searchHouseType.toLowerCase();
      const matchesDescription = property.description?.toLowerCase().includes(typeLower);
      const matchesName = property.name?.toLowerCase().includes(typeLower);
      const matchesUnits = property.units?.some((unit) => 
        unit.type?.toLowerCase().includes(typeLower)
      );

      // বাংলা ও ইংরেজি উভয় কি-ওয়ার্ডের জন্য স্মার্ট ম্যাচিং
      const isFamilyQuery = typeLower === "family";
      const isBachelorQuery = typeLower === "bachelor";
      const isSubletQuery = typeLower === "sublet";
      const isCommercialQuery = typeLower === "commercial";

      let matched = false;

      if (isFamilyQuery) {
        matched = 
          property.description?.toLowerCase().includes("family") ||
          property.description?.toLowerCase().includes("ফ্যামিলি") ||
          property.name?.toLowerCase().includes("family") ||
          property.name?.toLowerCase().includes("ফ্যামিলি") ||
          property.units?.some(u => u.type?.toLowerCase().includes("family") || u.type?.toLowerCase().includes("ফ্যামিলি") || u.type?.includes("পরিবার")) ||
          false;
      } else if (isBachelorQuery) {
        matched = 
          property.description?.toLowerCase().includes("bachelor") ||
          property.description?.toLowerCase().includes("ব্যাচেলর") ||
          property.description?.toLowerCase().includes("মেস") ||
          property.name?.toLowerCase().includes("bachelor") ||
          property.name?.toLowerCase().includes("ব্যাচেলর") ||
          property.units?.some(u => u.type?.toLowerCase().includes("bachelor") || u.type?.toLowerCase().includes("ব্যাচেলর") || u.type?.includes("মেস")) ||
          false;
      } else if (isSubletQuery) {
        matched = 
          property.description?.toLowerCase().includes("sublet") ||
          property.description?.toLowerCase().includes("সাবলেট") ||
          property.name?.toLowerCase().includes("sublet") ||
          property.name?.toLowerCase().includes("সাবলেট") ||
          property.units?.some(u => u.type?.toLowerCase().includes("sublet") || u.type?.toLowerCase().includes("সাবলেট")) ||
          false;
      } else if (isCommercialQuery) {
        matched = 
          property.description?.toLowerCase().includes("commercial") ||
          property.description?.toLowerCase().includes("কমার্শিয়াল") ||
          property.description?.toLowerCase().includes("অফিস") ||
          property.name?.toLowerCase().includes("commercial") ||
          property.name?.toLowerCase().includes("কমার্শিয়াল") ||
          property.units?.some(u => u.type?.toLowerCase().includes("commercial") || u.type?.toLowerCase().includes("কমার্শিয়াল") || u.type?.includes("অফিস")) ||
          false;
      } else {
        matched = !!(matchesDescription || matchesName || matchesUnits);
      }

      if (!matched) return false;
    }

    // গ) বাজেট ফিল্টার
    if (searchBudget) {
      const [min, max] = searchBudget.split("-").map(Number);
      const propertyRent = property.rent || property.minRent || 0;
      if (propertyRent < min || propertyRent > max) {
        return false;
      }
    }

    return true;
  });

  return (
    <section id="marketplace-listings" className="py-24 max-w-screen-2xl mx-auto px-8 scroll-mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Marketplace</p>
          <h2 className="font-headline font-extrabold text-4xl">
            {searchLocation || searchHouseType || searchBudget ? "খোঁজা বাসার ফলাফল" : "জনপ্রিয় বাসাগুলো দেখুন"}
          </h2>
        </div>
        {(searchLocation || searchHouseType || searchBudget) && (
          <button 
            onClick={() => setSearchFilters({ location: "", houseType: "", budget: "" })}
            className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all bg-primary/5 px-6 py-2.5 rounded-full"
          >
            সার্চ ক্লিয়ার করুন <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      {isLoading ? (
        // প্রিমিয়াম লোডিং শিমার ইফেক্ট (Skeleton Loader)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
              <div className="h-64 bg-slate-200 dark:bg-slate-700" />
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1 mr-4">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
                  </div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-16" />
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full" />
                <div className="flex gap-3 pt-2">
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex-1" />
                  <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProperties && filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => {
            const imageUrl =
              property.images && property.images.length > 0
                ? property.images[0].startsWith("http")
                  ? property.images[0]
                  : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/${property.images[0].replace(/\\/g, "/")}`
                : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6";

            // কন্ট্যাক্ট বা হোয়াটসঅ্যাপ লিংক জেনারেট করা
            const contactPhone = property.contactNumber || property.owner?.phoneNumber || "01700000000";
            const whatsappText = encodeURIComponent(`আসসালামু আলাইকুম, আমি বাড়িভাড়া প্ল্যাটফর্মে আপনার "${property.name}" বাসাটি সম্পর্কে জানতে আগ্রহী।`);
            const whatsappUrl = `https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}?text=${whatsappText}`;
            const callUrl = `tel:${contactPhone}`;

            const hasRentRange = property.minRent && property.maxRent && property.minRent !== property.maxRent;
            const hasUnits = property.minRent && property.minRent > 0;

            return (
              <div
                key={property._id}
                onClick={() => navigate(`/property/${property._id}`)}
                className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-slate-200 dark:border-slate-800 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="relative h-64 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={property.name}
                      src={imageUrl}
                    />
                    {property.owner?.isVerified === "verified" ? (
                      <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-md font-bold text-[10px] select-none z-10 border border-emerald-400/20">
                        <span className="material-symbols-outlined text-[12px] fill-white" style={{ fontVariationSettings: "'FILL' 1" }}>
                          verified
                        </span>
                        <span>ভেরিফাইড বাড়ি</span>
                      </div>
                    ) : (
                      <div className="absolute top-4 left-4 bg-rose-500/15 backdrop-blur-md text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm font-black text-[10px] select-none z-10 border border-rose-500/25">
                        <span className="material-symbols-outlined text-[12px] text-rose-500 font-black">
                          gpp_maybe
                        </span>
                        <span>আনভেরিফাইড</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-headline font-bold text-xl text-on-surface line-clamp-1">
                        {property.name}
                      </h3>
                      <p className="text-on-surface-variant text-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-primary">location_on</span>
                        <span className="line-clamp-1">{property.location}</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 rounded-2xl">
                      <p className="font-headline font-black text-base text-primary whitespace-nowrap">
                        {hasRentRange ? (
                          `৳${property.minRent?.toLocaleString("bn-BD")} - ৳${property.maxRent?.toLocaleString("bn-BD")}`
                        ) : hasUnits ? (
                          `৳${property.minRent?.toLocaleString("bn-BD")}`
                        ) : (
                          "আলোচনা সাপেক্ষ"
                        )}
                      </p>
                      {hasRentRange ? (
                        <span className="self-start px-2 py-0.5 bg-violet-100 text-violet-750 dark:bg-violet-900/40 dark:text-violet-300 text-[9px] font-black rounded-md whitespace-nowrap">
                          ফ্লোরভেদে ভিন্ন ভাড়া
                        </span>
                      ) : !hasUnits ? (
                        <span className="self-start px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-[9px] font-black rounded-md whitespace-nowrap">
                          খালি নেই
                        </span>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[11px] font-black text-on-surface-variant border-y border-slate-100 dark:border-slate-800 py-3.5 justify-items-center">
                      <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <span className="material-symbols-outlined text-sm text-primary">bed</span>
                        {property.bedrooms} রুম
                      </span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                        <span className="material-symbols-outlined text-sm text-primary">bathtub</span>
                        {property.bathrooms} বাথ
                      </span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                        <span className="material-symbols-outlined text-sm text-primary">square_foot</span>
                        {property.area} স্কয়ার ফিট
                      </span>
                    </div>
                    {property.description && (
                      <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {property.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="px-8 pb-8 flex gap-3">
                  <a
                    href={whatsappUrl}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-green-500 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors text-center text-sm"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
                  </a>
                  <a
                    href={callUrl}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 border-2 border-primary text-primary py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all text-center text-sm"
                  >
                    <span className="material-symbols-outlined text-sm">call</span> Call Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-850 max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto shadow-md text-primary animate-bounce-slow">
            <span className="material-symbols-outlined text-4xl">search_off</span>
          </div>
          <div className="space-y-2">
            <h4 className="font-headline font-bold text-xl text-slate-800 dark:text-slate-100">কোনো বাসা খুঁজে পাওয়া যায়নি</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              আপনার ফিল্টার করা লোকেশন, বাসার ধরণ বা বাজেটের সাথে মিলছে এমন কোনো লিস্টিং বর্তমানে খালি নেই। অনুগ্রহ করে অন্য ফিল্টার চেষ্টা করুন।
            </p>
          </div>
          <button
            onClick={() => setSearchFilters({ location: "", houseType: "", budget: "" })}
            className="px-6 py-3 bg-primary text-white text-xs font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            সব বাসাগুলো একসাথে দেখুন
          </button>
        </div>
      )}

      {/* 🏡 পাবলিক প্রোপার্টি ডিটেইলস মডাল */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800">
            {/* ক্লোজ বাটন */}
            <button
              onClick={() => { setSelectedProperty(null); setActiveImgIndex(0); }}
              className="absolute top-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2.5 rounded-full shadow-md z-30 transition-all cursor-pointer border border-slate-100/10"
            >
              <span className="material-symbols-outlined block text-lg font-bold">close</span>
            </button>

            {/* বাম সাইড: ইমেজ গ্যালারি ও কন্ট্যাক্ট */}
            <div className="w-full md:w-[45%] bg-slate-50 dark:bg-slate-950/20 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
              <div className="space-y-4">
                {/* বড় মেইন ইমেজ */}
                <div className="w-full h-56 md:h-72 rounded-2xl overflow-hidden shadow-md bg-slate-100 relative">
                  <img
                    src={
                      selectedProperty.images && selectedProperty.images.length > 0
                        ? selectedProperty.images[activeImgIndex].startsWith("http")
                          ? selectedProperty.images[activeImgIndex]
                          : `http://localhost:4000/${selectedProperty.images[activeImgIndex].replace(/\\/g, "/")}`
                        : "https://images.unsplash.com/photo-1564013799919-ab600027ffc6"
                    }
                    className="w-full h-full object-cover"
                    alt={selectedProperty.name}
                  />
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Verified
                  </div>
                </div>

                {/* থাম্বনেইল লিস্ট */}
                {selectedProperty.images && selectedProperty.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                    {selectedProperty.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImgIndex === idx ? 'border-primary scale-105 shadow-sm' : 'border-transparent hover:border-slate-300'}`}
                      >
                        <img
                          src={img.startsWith("http") ? img : `http://localhost:4000/${img.replace(/\\/g, "/")}`}
                          className="w-full h-full object-cover"
                          alt="Thumbnail"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* বাড়িওয়ালার কন্ট্যাক্ট কার্ড */}
              <div className="mt-6 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">মালিকের প্রোফাইল</p>
                      <h5 className="font-bold text-slate-700 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                        {selectedProperty.owner?.fullName || "বাড়িওয়ালা"}
                        {selectedProperty.owner?.isVerified === "verified" && (
                          <span className="material-symbols-outlined text-[13px] text-emerald-500 fill-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                        )}
                      </h5>
                    </div>
                    {selectedProperty.owner?.isVerified === "verified" ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450 text-[9px] font-black rounded-md border border-emerald-100 dark:border-emerald-900/30">
                        🛡️ ভেরিফাইড
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 text-[9px] font-black rounded-md border border-rose-100 dark:border-rose-900/30">
                        আনভেরিফাইড
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{selectedProperty.owner?.email || "ইমেইল উপলব্ধ নয়"}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/${(selectedProperty.contactNumber || selectedProperty.owner?.phoneNumber || "01700000000").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`আসসালামু আলাইকুম, আমি বাড়িভাড়া প্ল্যাটফর্মে আপনার "${selectedProperty.name}" বাসাটি সম্পর্কে জানতে আগ্রহী।`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 bg-green-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-green-600 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
                  </a>
                  <a
                    href={`tel:${selectedProperty.contactNumber || selectedProperty.owner?.phoneNumber || "01700000000"}`}
                    className="flex-1 py-2.5 border-2 border-primary text-primary text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">call</span> কল করুন
                  </a>
                </div>
              </div>
            </div>

            {/* ডান সাইড: ইনফরমেশন প্যানেল ও ইউনিট তালিকা */}
            <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
              <div className="space-y-5">
                <div>
                  <h3 className="font-headline font-black text-2xl text-slate-800 dark:text-slate-100">
                    {selectedProperty.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-1 font-semibold">
                    <span className="material-symbols-outlined text-xs text-primary">location_on</span>
                    {selectedProperty.location}
                  </p>
                </div>

                {/* ভাড়া প্যানেল */}
                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider">মাসিক ভাড়া</p>
                    <p className="font-headline font-extrabold text-lg text-primary mt-0.5">
                      {selectedProperty.minRent && selectedProperty.maxRent && selectedProperty.minRent !== selectedProperty.maxRent ? (
                        `৳${selectedProperty.minRent?.toLocaleString("bn-BD")} - ৳${selectedProperty.maxRent?.toLocaleString("bn-BD")}`
                      ) : selectedProperty.minRent && selectedProperty.minRent > 0 ? (
                        `৳${selectedProperty.minRent?.toLocaleString("bn-BD")}`
                      ) : (
                        "আলোচনা সাপেক্ষ"
                      )}
                    </p>
                  </div>
                  {selectedProperty.minRent && selectedProperty.maxRent && selectedProperty.minRent !== selectedProperty.maxRent && (
                    <span className="px-3 py-1 bg-violet-100 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400 text-[10px] font-black rounded-full uppercase tracking-wider">
                      ফ্লোরভেদে ভিন্ন ভাড়া
                    </span>
                  )}
                </div>

                {/* মূল ফিচারসমূহ */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="material-symbols-outlined text-primary text-base">bed</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">রুম</p>
                    <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-0.5">{selectedProperty.bedrooms}টি</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="material-symbols-outlined text-primary text-base">bathtub</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">বাথরুম</p>
                    <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-0.5">{selectedProperty.bathrooms}টি</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <span className="material-symbols-outlined text-primary text-base">square_foot</span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">সাইজ</p>
                    <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-0.5 whitespace-nowrap">{selectedProperty.area} স্কয়ার ফিট</p>
                  </div>
                </div>

                {/* বিস্তারিত বিবরণ */}
                {selectedProperty.description && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">বিস্তারিত বিবরণ</h5>
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                      {selectedProperty.description}
                    </p>
                  </div>
                )}

                {/* ডায়নামিক ইউনিট তালিকা */}
                {selectedProperty.units && selectedProperty.units.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary">domain</span>
                      উপলব্ধ ইউনিট তালিকা ({selectedProperty.units.length}টি)
                    </h4>
                    <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
                      {selectedProperty.units.map((unit) => (
                        <div key={unit._id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all">
                          <div>
                            <p className="font-bold text-xs text-slate-700 dark:text-slate-200">{unit.unitName}</p>
                            <p className="text-[9px] text-slate-450 dark:text-slate-500 font-bold uppercase">{unit.floor} তলা • {unit.type === 'Flat' ? 'ফ্ল্যাট' : unit.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-xs text-primary">৳{unit.rent?.toLocaleString("bn-BD")}</p>
                            <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded-full mt-0.5 ${unit.status === 'খালি' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-450' : 'bg-red-50 text-red-650 dark:bg-red-950/30 dark:text-red-450'}`}>
                              {unit.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🗺️ গুগল ম্যাপ লোকেশন */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-primary">map</span>
                    বাসার ম্যাপ লোকেশন
                  </h4>
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm relative bg-slate-50">
                    <iframe
                      title="Property Location Map"
                      src={getMapEmbedUrl(selectedProperty.location)}
                      className="w-full h-full border-none"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MarketplaceSection;
