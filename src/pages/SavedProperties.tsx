import { Link, useNavigate } from "react-router-dom";
import { useSavedPropertiesStore } from "@/store/useSavedPropertiesStore";
import {
  MapPin, Building2, ChevronLeft, BedDouble, Bath, Square, Star, Heart
} from "lucide-react";
import SEOHead from "@/components/common/SEOHead";
import { PAGE_SEO } from "@/lib/seo";

const PropertyCard = ({ property }: { property: any }) => {
  const navigate = useNavigate();
  const isUnit = !!property.propertyId; // unit হলে propertyId থাকবে
  const photos = property.photos || property.images || [];
  const thumb = photos[0] || null;

  const { isSaved, toggleSave } = useSavedPropertiesStore();

  return (
    <div
      onClick={() => navigate(`/property/${isUnit ? `${property.propertyId}?unit=${property._id}` : property._id}`)}
      className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
    >
      {/* Photo */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-violet-100 dark:from-primary/20 dark:to-slate-700 overflow-hidden">
        {thumb ? (
          <img src={thumb.startsWith("http") ? thumb : `http://localhost:4000/${thumb.replace(/\\/g, "/")}`} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 size={48} className="text-primary/30" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 dark:bg-slate-800/90 text-primary font-black text-xs px-3 py-1 rounded-full shadow">
            {property.type || (isUnit ? "ফ্ল্যাট" : "Residential")}
          </span>
          {isUnit && (
            <span className="bg-primary text-white font-black text-xs px-3 py-1 rounded-full shadow">
              ইউনিট
            </span>
          )}
        </div>

        {/* ❤️ Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // @ts-ignore
            toggleSave(property);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 rounded-full flex items-center justify-center shadow-md z-20 border border-white/40 dark:border-slate-700 transition-all hover:scale-110 active:scale-95"
        >
          <span className={`material-symbols-outlined text-[16px] ${isSaved(property._id) ? "text-rose-500 fill-rose-500" : "text-slate-600 dark:text-slate-300"}`} style={{ fontVariationSettings: isSaved(property._id) ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-black text-on-surface text-base line-clamp-1 mb-1">
          {isUnit ? property.name : property.name}
        </h3>
        {isUnit && property.unitName && (
          <p className="text-xs font-bold text-primary mb-1">{property.unitName}</p>
        )}
        <div className="flex items-center gap-1.5 text-on-surface-variant text-sm mb-3">
          <MapPin size={13} className="text-primary shrink-0" />
          <span className="truncate">{property.address || property.location || "ঠিকানা নেই"}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {(property.minRent && property.minRent > 0) || property.rent > 0 ? (
              <div>
                <p className="text-xs text-on-surface-variant font-bold">ভাড়া (মাসিক)</p>
                <p className="text-lg font-black text-primary">
                  ৳{(property.minRent || property.rent)?.toLocaleString()}
                  {property.maxRent > property.minRent && `–${property.maxRent.toLocaleString()}`}
                </p>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant font-bold">ভাড়া জানতে যোগাযোগ করুন</p>
            )}
          </div>
          <div className="text-right flex items-center gap-2 text-on-surface-variant">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-black bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                <BedDouble size={10} /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-black bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                <Bath size={10} /> {property.bathrooms}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SavedProperties = () => {
  const { savedProperties, clearAll } = useSavedPropertiesStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-16">
      <SEOHead {...PAGE_SEO.savedProperties} />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>

            <h1 className="text-3xl font-black text-on-surface flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={28} /> পছন্দের বাসাসমূহ
            </h1>
            <p className="text-on-surface-variant mt-1">
              আপনার সংরক্ষিত {savedProperties.length}টি বাসা
            </p>
          </div>
          {savedProperties.length > 0 && (
            <button 
              onClick={clearAll}
              className="text-sm font-bold text-slate-500 hover:text-rose-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl transition-all"
            >
              সব ক্লিয়ার করুন
            </button>
          )}
        </div>

        {/* Results Grid */}
        {savedProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <Heart size={56} className="text-slate-200 dark:text-slate-800 mb-4" />
            <h3 className="text-xl font-black text-on-surface mb-2">কোনো বাসা সেভ করা নেই</h3>
            <p className="text-sm mb-6 text-center max-w-sm leading-relaxed">
              আপনি এখনো কোনো বাসা আপনার পছন্দের তালিকায় যুক্ত করেননি। সার্চ পেজ থেকে পছন্দমতো বাসা খুঁজুন এবং "❤️" বাটনে ক্লিক করে সেভ করুন।
            </p>
            <Link to="/search" className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-xl transition-all">
              বাসা খুঁজুন
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {savedProperties.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProperties;
