import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MapPin, Phone, Mail, Building2, CheckCircle2, ChevronLeft,
  Loader2, Home, BedDouble, Layers, ArrowRight, Shield, Star, Heart
} from "lucide-react";
import { useSavedPropertiesStore } from "@/store/useSavedPropertiesStore";
import { trackEvent } from "@/services/analytics";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public`;

const statusLabel: Record<string, { label: string; color: string }> = {
  available: { label: "খালি আছে", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
  "খালি": { label: "খালি আছে", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
  occupied:  { label: "ভাড়া দেওয়া", color: "text-red-500 bg-red-50 dark:bg-red-900/30" },
  "ভাড়া হয়েছে":  { label: "ভাড়া দেওয়া", color: "text-red-500 bg-red-50 dark:bg-red-900/30" },
  "ভাড়া হয়েছে":  { label: "ভাড়া দেওয়া", color: "text-red-500 bg-red-50 dark:bg-red-900/30" },
  maintenance: { label: "মেইনটেন্যান্স", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30" },
  "মেরামত চলছে": { label: "মেইনটেন্যান্স", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30" },
};

const PublicPropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const { isSaved, toggleSave } = useSavedPropertiesStore();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-property", id],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/properties/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  // Track property view when property data loads
  useEffect(() => {
    if (data?._id) {
      trackEvent("propertyView", { propertyId: data._id, metadata: { name: data.name, location: data.location } });
    }
  }, [data?._id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={44} className="animate-spin text-primary" />
          <p className="font-bold">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <Building2 size={56} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-black text-on-surface mb-2">প্রপার্টি পাওয়া যায়নি</h2>
          <Link to="/search" className="text-primary font-bold hover:underline">← সব বাসা দেখুন</Link>
        </div>
      </div>
    );
  }

  const photos = data.photos || data.images || [];
  const owner = data.owner as any;
  const units = data.units || [];
  const availableUnits = units.filter((u: any) => u.status === "available" || u.status === "খালি");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Image */}
      <div className="relative h-72 sm:h-96 bg-gradient-to-br from-primary/20 to-violet-100 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
        {photos.length > 0 ? (
          <img src={photos[activePhotoIndex] || photos[0]} alt={data.name} className="w-full h-full object-cover transition-all duration-500 ease-in-out" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 size={72} className="text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 text-on-surface text-sm font-black px-4 py-2 rounded-2xl shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronLeft size={16} /> ফিরুন
        </button>
        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full backdrop-blur-sm">
              {data.type || "Residential"}
            </span>
            {availableUnits.length > 0 && (
              <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">
                {availableUnits.length}টি ইউনিট খালি
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow">{data.name}</h1>
          <div className="flex items-center gap-1.5 text-white/80 mt-1 text-sm">
            <MapPin size={14} />
            <span>{data.address || data.location || "ঠিকানা নেই"}</span>
          </div>
        </div>
      </div>

      {/* Photo Strip */}
      {photos.length > 1 && (
        <div className="flex gap-3 px-4 pt-4 overflow-x-auto max-w-6xl mx-auto scrollbar-thin scrollbar-thumb-slate-300">
          {photos.map((ph: string, index: number) => (
            <button
              key={index}
              onClick={() => setActivePhotoIndex(index)}
              className={`relative h-20 w-32 rounded-2xl overflow-hidden shrink-0 border-2 transition-all hover:scale-105 active:scale-95 shadow-sm ${
                activePhotoIndex === index 
                  ? "border-primary ring-2 ring-primary/20 scale-105 opacity-100" 
                  : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-90"
              }`}
            >
              <img src={ph} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Banner */}
          {data.minRent > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <p className="text-xs font-black text-on-surface-variant mb-1">মাসিক ভাড়া</p>
              <p className="text-3xl font-black text-primary">
                ৳{data.minRent.toLocaleString()}
                {data.maxRent > data.minRent && <span className="text-xl text-slate-400"> – {data.maxRent.toLocaleString()}</span>}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">{data.unitCount}টি ইউনিট • {data.availableUnits}টি খালি</p>
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h2 className="font-black text-on-surface mb-3">বিস্তারিত বিবরণ</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Units Table */}
          {units.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h2 className="font-black text-on-surface mb-4">ইউনিট সমূহ</h2>
              <div className="space-y-3">
                {units.map((unit: any) => {
                  const st = statusLabel[unit.status] || statusLabel.available;
                  return (
                    <div key={unit._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Home size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-black text-on-surface text-base">{unit.unitName}</p>
                            <p className="text-xs text-on-surface-variant font-bold">
                              {unit.type || "ফ্ল্যাট"} {unit.floor ? `• তলা ${unit.floor}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <p className="font-black text-primary text-base">৳{(unit.rent || 0).toLocaleString()}</p>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-md ${st.color} uppercase tracking-wider`}>{st.label}</span>
                        </div>
                      </div>

                      {/* Unit Photo Gallery */}
                      {unit.images && unit.images.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-600/50">
                          <p className="text-xs font-bold text-slate-500 mb-2">ইউনিটের ছবিসমূহ ({unit.images.length})</p>
                          <div className="flex gap-2 overflow-x-auto pb-2 snap-x scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-600">
                            {unit.images.map((img: string, idx: number) => {
                              const src = img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/${img.replace(/\\/g, "/")}`;
                              return (
                                <a 
                                  key={idx} 
                                  href={src} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="shrink-0 snap-start block"
                                >
                                  <img 
                                    src={src} 
                                    alt={`Unit photo ${idx + 1}`} 
                                    className="w-24 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform bg-slate-100"
                                  />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Owner Card */}
          {owner && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="font-black text-on-surface mb-4">বাড়িওয়ালার তথ্য</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg overflow-hidden">
                  {owner.photo ? (
                    <img src={owner.photo} alt={owner.fullName} className="w-full h-full object-cover" />
                  ) : (
                    owner.fullName?.charAt(0) || "B"
                  )}
                </div>
                <div>
                  <p className="font-black text-on-surface">{owner.fullName}</p>
                  <div className="flex flex-col gap-1 mt-1">
                    {owner.isVerified === "verified" && (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <Shield size={11} /> যাচাইকৃত বাড়িওয়ালা
                      </div>
                    )}
                    {owner.landlordRating?.average?.overall >= 4.5 && owner.landlordRating?.totalRatings >= 2 && (
                      <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 text-xs font-bold bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md w-fit border border-amber-100 dark:border-amber-900/30 shadow-sm">
                        <Star size={11} fill="currentColor" /> Top Rated Landlord 👑
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {(owner.phone || owner.phoneNumber) && (
                  <a
                    href={`tel:${owner.phone || owner.phoneNumber}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
                  >
                    <Phone size={16} />
                    <span className="font-black text-sm">{owner.phone || owner.phoneNumber}</span>
                  </a>
                )}
                {owner.email && (
                  <a
                    href={`mailto:${owner.email}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 dark:bg-primary/10 text-primary hover:bg-primary/10 transition-all"
                  >
                    <Mail size={16} />
                    <span className="font-black text-sm truncate">{owner.email}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CTA Card */}
          <div className="bg-gradient-to-br from-primary to-violet-600 rounded-3xl p-5 text-white shadow-xl shadow-primary/20">
            <h3 className="font-black text-lg mb-2">আগ্রহী?</h3>
            <p className="text-white/80 text-sm mb-4">বাড়িওয়ালার সাথে সরাসরি যোগাযোগ করুন বা আরও বাসা দেখুন।</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  // @ts-ignore
                  toggleSave(data);
                }}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-sm transition-all border-2 ${
                  isSaved(data._id)
                    ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600 hover:border-rose-600"
                    : "bg-transparent border-white text-white hover:bg-white/10"
                }`}
              >
                <span className={`material-symbols-outlined text-sm ${isSaved(data._id) ? "fill-white" : ""}`} style={{ fontVariationSettings: isSaved(data._id) ? "'FILL' 1" : "'FILL' 0" }}>
                  favorite
                </span>
                {isSaved(data._id) ? "সেভ করা আছে" : "পছন্দের তালিকায় রাখুন"}
              </button>
              <Link
                to="/search"
                className="flex items-center justify-center gap-2 w-full py-3 bg-white text-primary rounded-2xl font-black text-sm hover:bg-white/90 transition-all"
              >
                আরও বাসা দেখুন <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPropertyDetail;
