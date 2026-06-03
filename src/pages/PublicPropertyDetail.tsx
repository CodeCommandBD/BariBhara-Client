import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  MapPin, Phone, Mail, Building2, CheckCircle2, ChevronLeft,
  Loader2, Home, BedDouble, Layers, ArrowRight, Shield, Star, Heart, ImageOff,
  LayoutGrid, Utensils, Flame
} from "lucide-react";
import { useSavedPropertiesStore } from "@/store/useSavedPropertiesStore";
import { trackEvent } from "@/services/analytics";
import SEOHead from "@/components/common/SEOHead";
import { generatePropertySchema, generateBreadcrumbSchema, SITE_URL } from "@/lib/seo";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public`;

const statusLabel: Record<string, { label: string; color: string }> = {
  available: { label: "খালি আছে", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
  "খালি": { label: "খালি আছে", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30" },
  occupied:  { label: "ভাড়া দেওয়া", color: "text-red-500 bg-red-50 dark:bg-red-900/30" },
  "ভাড়া হয়েছে":  { label: "ভাড়া দেওয়া", color: "text-red-500 bg-red-50 dark:bg-red-900/30" },
  maintenance: { label: "মেইনটেন্যান্স", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30" },
  "মেরামত চলছে": { label: "মেইনটেন্যান্স", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30" },
};

const PublicPropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialUnitId = searchParams.get("unit");
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);
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

  // Auto-select the first available unit if none is selected
  useEffect(() => {
    if (data?.units && !expandedUnitId) {
      if (initialUnitId && data.units.find((u: any) => u._id === initialUnitId)) {
        setExpandedUnitId(initialUnitId);
      } else {
        const avail = data.units.filter((u: any) => u.status === "available" || u.status === "খালি");
        if (avail.length > 0) {
          setExpandedUnitId(avail[0]._id);
        }
      }
    }
  }, [data?.units, expandedUnitId, initialUnitId]);

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

  const owner = data.owner as any;
  const units = data.units || [];
  const availableUnits = units.filter((u: any) => u.status === "available" || u.status === "খালি");
  const selectedUnit = expandedUnitId ? units.find((u: any) => u._id === expandedUnitId) : null;
  
  // Use unit photos if expanded. DO NOT fallback to property photos so the user knows this unit has no photos.
  const rawPhotos = selectedUnit
    ? (selectedUnit.images || [])
    : (data.photos || data.images || []);

  const getImageUrl = (img: string) => {
    if (!img) return "";
    return img.startsWith("http") ? img : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/${img.replace(/\\/g, "/")}`;
  };

  const photos = rawPhotos.map((p: string) => getImageUrl(p));

  const propertyUrl = `${SITE_URL}/property/${id}`;
  const displayTitle = selectedUnit 
    ? `${selectedUnit.unitName}, ${data.name} — ভাড়া ${selectedUnit.rent}৳` 
    : `${data.name} — ${data.location} এ বাসা ভাড়া`;
  const displayDesc = selectedUnit
    ? `${data.name}-এ ${selectedUnit.type} ভাড়া। ${selectedUnit.bedrooms} বেডরুম, ${selectedUnit.bathrooms} বাথরুম। মাসিক ভাড়া: ${selectedUnit.rent} টাকা।`
    : `${data.location} এলাকায় ${data.name}-এ বাসা/ফ্ল্যাট ভাড়া। বিস্তারিত জানতে ক্লিক করুন।`;


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 pt-6">
      <SEOHead
        title={displayTitle}
        description={displayDesc}
        keywords={`বাসা ভাড়া ${data.location}, ${data.name}, ফ্ল্যাট ভাড়া, ${data.type || "residential"}`}
        ogImage={photos[0]}
        ogType="article"
        structuredData={[
          generateBreadcrumbSchema([
            { name: "হোম", url: SITE_URL },
            { name: "বাসা খুঁজুন", url: `${SITE_URL}/search` },
            { name: data.name, url: propertyUrl },
          ]),
          generatePropertySchema({
            name: data.name,
            description: data.description,
            address: data.address || data.location,
            rent: selectedUnit ? selectedUnit.rent : (data.minRent || data.rent || 0),
            image: photos[0],
            ownerName: owner?.fullName,
            url: propertyUrl,
          })
        ]}
      />
      <div className="max-w-6xl mx-auto px-4">
        {/* Header / Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/10 text-primary dark:text-primary-light text-xs font-black px-3 py-1 rounded-full">
                {data.type || "Residential"}
              </span>
              {availableUnits.length > 0 && (
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black px-3 py-1 rounded-full">
                  {availableUnits.length}টি ইউনিট খালি
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-on-surface">{data.name}</h1>
            <div className="flex items-center gap-1.5 text-on-surface-variant mt-1.5 text-sm font-medium">
              <MapPin size={16} className="text-primary" />
              <span>{data.address || data.location || "ঠিকানা নেই"}</span>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex w-fit items-center gap-2 bg-white dark:bg-slate-800 text-on-surface text-sm font-black px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            <ChevronLeft size={16} /> ফিরুন
          </button>
        </div>

        {/* Image Gallery */}
        <div className="mb-8 bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm relative">
          <div className="relative w-full h-[250px] sm:h-[400px] lg:h-[450px] rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900">
            {photos.length > 0 ? (
              <img src={photos[activePhotoIndex] || photos[0]} alt={data.name} className="w-full h-full object-cover transition-opacity duration-300" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-[1.5rem]">
                <ImageOff size={64} className="text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-slate-400 font-bold">এই ইউনিটের কোনো ছবি আপলোড করা নেই</p>
              </div>
            )}
          </div>

          {/* Photo Strip */}
          {photos.length > 1 && (
            <div className="flex gap-2 mt-2 sm:mt-3 overflow-x-auto pb-1 scrollbar-hide">
              {photos.map((ph: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActivePhotoIndex(index)}
                  className={`relative aspect-square h-16 sm:h-20 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                    activePhotoIndex === index 
                      ? "border-primary ring-2 ring-primary/20 scale-[1.02]" 
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={ph} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
          {/* Selected Unit Details Banner */}
          {selectedUnit ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <h2 className="text-xl font-black text-on-surface">{selectedUnit.unitName}</h2>
                  <p className="text-sm text-on-surface-variant font-bold">
                    {selectedUnit.type || "ফ্ল্যাট"} {selectedUnit.floor ? `• তলা ${selectedUnit.floor}` : ""}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs font-black text-on-surface-variant mb-1">মাসিক ভাড়া</p>
                  <p className="text-3xl font-black text-primary">৳{(selectedUnit.rent || 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedUnit.bedrooms > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl">
                    <BedDouble size={18} className="text-primary/70" />
                    <span>{selectedUnit.bedrooms} বেডরুম</span>
                  </div>
                )}
                {selectedUnit.bathrooms > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl">
                    <Layers size={18} className="text-primary/70" />
                    <span>{selectedUnit.bathrooms} বাথরুম</span>
                  </div>
                )}
                {selectedUnit.area > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl">
                    <Home size={18} className="text-primary/70" />
                    <span>{selectedUnit.area} স্কয়ার ফিট</span>
                  </div>
                )}
                {selectedUnit.balcony > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl">
                    <LayoutGrid size={18} className="text-primary/70" />
                    <span>{selectedUnit.balcony} বারান্দা</span>
                  </div>
                )}
                {selectedUnit.kitchen > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl">
                    <Utensils size={18} className="text-primary/70" />
                    <span>{selectedUnit.kitchen} কিচেন</span>
                  </div>
                )}
                {selectedUnit.gas && selectedUnit.gas !== "নেই" && (
                  <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-xl">
                    <Flame size={18} className="text-primary/70" />
                    <span>{selectedUnit.gas}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            data.minRent > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <p className="text-xs font-black text-on-surface-variant mb-1">মাসিক ভাড়া</p>
                <p className="text-3xl font-black text-primary">
                  ৳{data.minRent.toLocaleString()}
                  {data.maxRent > data.minRent && <span className="text-xl text-slate-400"> – {data.maxRent.toLocaleString()}</span>}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">{data.unitCount}টি ইউনিট • {data.availableUnits}টি খালি</p>
              </div>
            )
          )}

          {/* Description */}
          {data.description && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h2 className="font-black text-on-surface mb-3">বিস্তারিত বিবরণ</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Units Selector */}
          {availableUnits.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
              <h2 className="font-black text-on-surface mb-4">খালি ইউনিট সমূহ ({availableUnits.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableUnits.map((unit: any) => {
                  const isExpanded = selectedUnit?._id === unit._id;
                  return (
                    <div 
                      key={unit._id} 
                      onClick={() => {
                        if(!isExpanded) {
                          setExpandedUnitId(unit._id);
                          setActivePhotoIndex(0);
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isExpanded 
                          ? "bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/20" 
                          : "bg-slate-50 dark:bg-slate-700/40 border-slate-100 dark:border-slate-700/50 hover:shadow-md hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className={`font-black text-base ${isExpanded ? "text-primary" : "text-on-surface"}`}>{unit.unitName}</p>
                        <p className={`font-black ${isExpanded ? "text-primary" : "text-on-surface"}`}>৳{(unit.rent || 0).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-on-surface-variant font-bold">
                          {unit.type || "ফ্ল্যাট"}
                        </p>
                        <div className="flex gap-2">
                            {unit.bedrooms > 0 && <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${isExpanded ? "bg-primary/10 text-primary" : "bg-white dark:bg-slate-800 text-slate-500"}`}>{unit.bedrooms} Bed</span>}
                        </div>
                      </div>
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
    </div>
  );
};

export default PublicPropertyDetail;
