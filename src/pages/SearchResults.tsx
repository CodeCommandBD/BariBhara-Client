import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import {
  Search, SlidersHorizontal, X, MapPin, Home, Building2,
  ChevronLeft, ChevronRight, Loader2, BedDouble, ArrowUpDown, Star
} from "lucide-react";
import { useSavedPropertiesStore } from "@/store/useSavedPropertiesStore";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public`;

const PROPERTY_TYPES = ["all", "Residential", "Commercial", "Office", "Shop", "Warehouse"];
const SORT_OPTIONS = [
  { value: "newest", label: "সর্বশেষ আগে" },
  { value: "oldest", label: "পুরনো আগে" },
  { value: "rent_asc", label: "ভাড়া কম থেকে বেশি" },
  { value: "rent_desc", label: "ভাড়া বেশি থেকে কম" },
];

const UnitCard = ({ unit }: { unit: any }) => {
  const navigate = useNavigate();
  const photos = unit.images || [];
  const thumb = photos[0] || null;
  const availBadge = unit.status === "খালি" || unit.status === "available";
  
  const { isSaved, toggleSave } = useSavedPropertiesStore();

  return (
    <div
      onClick={() => navigate(`/property/${unit.propertyId}`)}
      className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Photo */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-violet-100 dark:from-primary/20 dark:to-slate-700 overflow-hidden">
        {thumb ? (
          <img src={thumb.startsWith("http") ? thumb : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/${thumb.replace(/\\/g, "/")}`} alt={unit.unitName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 size={48} className="text-primary/30" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 dark:bg-slate-800/90 text-primary font-black text-xs px-3 py-1 rounded-full shadow">
            {unit.type || "ফ্ল্যাট"}
          </span>
          {availBadge && (
            <span className="bg-emerald-500 text-white font-black text-xs px-3 py-1 rounded-full shadow">
              ✓ খালি আছে
            </span>
          )}
          {unit.owner?.landlordRating?.average?.overall >= 4.5 && unit.owner?.landlordRating?.totalRatings >= 2 && (
            <span className="bg-amber-500 text-white font-black text-xs px-2 py-1 rounded-full shadow flex items-center gap-1" title="Top Rated Landlord">
              <Star size={12} fill="currentColor" /> Top Rated
            </span>
          )}
        </div>

        {/* ❤️ Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // @ts-ignore
            toggleSave({ _id: unit.propertyId, ...unit }); // compatible with save store which needs an _id as property ID
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 rounded-full flex items-center justify-center shadow-md z-20 border border-white/40 dark:border-slate-700 transition-all hover:scale-110 active:scale-95"
        >
          <span className={`material-symbols-outlined text-[16px] ${isSaved(unit.propertyId) ? "text-rose-500 fill-rose-500" : "text-slate-600 dark:text-slate-300"}`} style={{ fontVariationSettings: isSaved(unit.propertyId) ? "'FILL' 1" : "'FILL' 0" }}>
            favorite
          </span>
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-black text-on-surface text-base line-clamp-1 mb-1">{unit.unitName} - {unit.propertyName}</h3>
        <div className="flex items-center gap-1.5 text-on-surface-variant text-sm mb-3">
          <MapPin size={13} className="text-primary shrink-0" />
          <span className="truncate">{unit.address || unit.location || "ঠিকানা নেই"}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {unit.rent > 0 ? (
              <div>
                <p className="text-xs text-on-surface-variant font-bold">ভাড়া (মাসিক)</p>
                <p className="text-lg font-black text-primary">
                  ৳{unit.rent.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant font-bold">ভাড়া জানতে যোগাযোগ করুন</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-on-surface-variant">{unit.bedrooms || 1} রুম</p>
            <p className="text-xs font-bold text-emerald-600">{unit.bathrooms || 1} বাথ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // Filter state from URL
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [minRent, setMinRent] = useState(searchParams.get("minRent") || "");
  const [maxRent, setMaxRent] = useState(searchParams.get("maxRent") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  // Sync URL → state on param change
  useEffect(() => {
    setLocation(searchParams.get("location") || "");
    setType(searchParams.get("type") || "all");
    setMinRent(searchParams.get("minRent") || "");
    setMaxRent(searchParams.get("maxRent") || "");
    setSort(searchParams.get("sort") || "newest");
    setPage(parseInt(searchParams.get("page") || "1"));
  }, [searchParams]);

  const applyFilters = () => {
    const params: any = { page: "1" };
    if (location) params.location = location;
    if (type && type !== "all") params.type = type;
    if (minRent) params.minRent = minRent;
    if (maxRent) params.maxRent = maxRent;
    if (sort) params.sort = sort;
    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setLocation(""); setType("all"); setMinRent(""); setMaxRent(""); setSort("newest");
    setSearchParams({ page: "1" });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["search-properties", location, type, minRent, maxRent, sort, page],
    queryFn: async () => {
      const params: any = { page, limit: 12 };
      if (location) params.location = location;
      if (type && type !== "all") params.type = type;
      if (minRent) params.minRent = minRent;
      if (maxRent) params.maxRent = maxRent;
      if (sort) params.sort = sort;
      const res = await axios.get(`${API_URL}/properties`, { params });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const properties = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;
  const hasActiveFilters = location || type !== "all" || minRent || maxRent;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-black text-on-surface">বাসা খুঁজুন</h1>
          <p className="text-on-surface-variant mt-1">
            {isLoading ? "লোড হচ্ছে..." : `${total}টি বাসা পাওয়া গেছে`}
          </p>
        </div>

        {/* Search Bar + Filter Toggle */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-location-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="এলাকা, ঠিকানা বা প্রপার্টির নাম লিখুন..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-on-surface text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>
          <button
            id="search-filter-btn"
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl font-black text-sm shadow-sm border transition-all ${
              hasActiveFilters
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-slate-800 text-on-surface border-slate-200 dark:border-slate-700"
            }`}
          >
            <SlidersHorizontal size={16} />
            ফিল্টার {hasActiveFilters && "•"}
          </button>
          <button
            id="search-submit-btn"
            onClick={applyFilters}
            className="px-5 py-3.5 bg-primary text-white rounded-2xl font-black text-sm shadow-sm hover:bg-primary/90 transition-all"
          >
            খুঁজুন
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6 shadow-sm animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type */}
              <div>
                <label className="text-xs font-black text-on-surface-variant mb-2 block">প্রপার্টি ধরন</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm font-bold text-on-surface focus:outline-none"
                >
                  {PROPERTY_TYPES.map(t => (
                    <option key={t} value={t}>{t === "all" ? "সব ধরন" : t}</option>
                  ))}
                </select>
              </div>
              {/* Min Rent */}
              <div>
                <label className="text-xs font-black text-on-surface-variant mb-2 block">সর্বনিম্ন ভাড়া (৳)</label>
                <input
                  type="number"
                  value={minRent}
                  onChange={(e) => setMinRent(e.target.value)}
                  placeholder="যেমন: 5000"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm font-bold text-on-surface focus:outline-none"
                />
              </div>
              {/* Max Rent */}
              <div>
                <label className="text-xs font-black text-on-surface-variant mb-2 block">সর্বোচ্চ ভাড়া (৳)</label>
                <input
                  type="number"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  placeholder="যেমন: 20000"
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm font-bold text-on-surface focus:outline-none"
                />
              </div>
              {/* Sort */}
              <div>
                <label className="text-xs font-black text-on-surface-variant mb-2 block">সাজানো</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm font-bold text-on-surface focus:outline-none"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={applyFilters} className="px-6 py-2.5 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                ফিল্টার প্রয়োগ
              </button>
              <button onClick={clearFilters} className="px-6 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 text-on-surface-variant font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2">
                <X size={14} /> রিসেট
              </button>
            </div>
          </div>
        )}

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {location && <span className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-black px-3 py-1.5 rounded-full"><MapPin size={12} />{location}</span>}
            {type !== "all" && <span className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-black px-3 py-1.5 rounded-full"><Home size={12} />{type}</span>}
            {(minRent || maxRent) && <span className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black px-3 py-1.5 rounded-full">৳{minRent || "০"} – {maxRent || "∞"}</span>}
          </div>
        )}

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={40} className="animate-spin text-primary mb-4" />
            <p className="font-bold">বাসা খোঁজা হচ্ছে...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Building2 size={56} className="opacity-30 mb-4" />
            <h3 className="text-xl font-black text-on-surface mb-2">কোনো বাসা পাওয়া যায়নি</h3>
            <p className="text-sm mb-4">অন্য ফিল্টার চেষ্টা করুন বা ফিল্টার রিসেট করুন</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-primary text-white rounded-2xl font-black text-sm">ফিল্টার রিসেট</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {properties.map((p: any) => <UnitCard key={p._id} unit={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); setSearchParams(prev => { prev.set("page", String(Math.max(1, page - 1))); return prev; }); }}
              disabled={page <= 1}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button
                key={p}
                onClick={() => { setPage(p); setSearchParams(prev => { prev.set("page", String(p)); return prev; }); }}
                className={`w-10 h-10 rounded-2xl font-black text-sm transition-all ${
                  p === page ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-on-surface hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => { setPage(p => Math.min(totalPages, p + 1)); setSearchParams(prev => { prev.set("page", String(Math.min(totalPages, page + 1))); return prev; }); }}
              disabled={page >= totalPages}
              className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
