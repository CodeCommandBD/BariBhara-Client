import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, MapPin, Home, Banknote, ShieldCheck, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PublicProperty {
  location: string;
  minRent?: number;
  maxRent?: number;
  rent?: number;
}

const HeroSection = () => {
  const { setSearchFilters } = useUIStore();
  const navigate = useNavigate();
  const [locationInput, setLocationInput] = useState("");
  const [houseType, setHouseType] = useState("সব ধরণের বাসা");
  const [budgetInput, setBudgetInput] = useState("");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showBudgetSuggestions, setShowBudgetSuggestions] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  // প্ল্যাটফর্ম লাইভ স্ট্যাটস ফেচ করা (ব্যানারের ব্যাজ ডায়নামিক করার জন্য)
  const { data: stats } = useQuery({
    queryKey: ["public-stats-v2"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public/stats`);
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });

  // ১. ডাইনামিক লোকেশন সাজেশনের জন্য ডাটা নিয়ে আসা
  const { data: properties } = useQuery<PublicProperty[]>({
    queryKey: ["public-properties-locations"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public/properties`);
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });

  // ইউনিক লোকেশন ফিল্টারিং
  const uniqueLocations = properties
    ? Array.from(new Set(properties.map((p) => p.location.trim()))).filter(Boolean)
    : ["উত্তরা, ঢাকা", "মিরপুর, ঢাকা", "মোহাম্মদপুর, ঢাকা", "ধানমন্ডি, ঢাকা", "বাড্ডা, ঢাকা"];

  // ফিল্টার করা লোকেশন সাজেশন
  const filteredSuggestions = uniqueLocations.filter((loc) =>
    loc.toLowerCase().includes(locationInput.toLowerCase())
  );

  // বাজেট সাজেশন অপশন
  const budgetOptions = [
    { label: "৳ ৫,০০০ - ১০,০০০", val: "5000-10000" },
    { label: "৳ ১০,০০০ - ২০,০০০", val: "10000-20000" },
    { label: "৳ ২০,০০০ - ৩০,০০০", val: "20000-30000" },
    { label: "৳ ৩০,০০০+", val: "30000-999999" },
  ];

  // বাইরে ক্লিক করলে ড্রপডাউন বন্ধ করার হ্যান্ডলার
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationSuggestions(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) {
        setShowBudgetSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // কুয়েরি প্যারামস তৈরি
    const params = new URLSearchParams();
    if (locationInput) params.append("location", locationInput);
    if (houseType && houseType !== "সব ধরণের বাসা") params.append("type", houseType);
    if (budgetInput) {
      const [min, max] = budgetInput.split("-");
      if (min) params.append("minRent", min);
      if (max) params.append("maxRent", max);
    }

    // নতুন সার্চ পেইজে রিডাইরেক্ট করা
    navigate(`/search?${params.toString()}`);
  };

  return (
    <header className="relative pt-32 pb-20 hero-gradient overflow-visible">
      {/* Decorative Blur Gradients */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            সহজ ও স্মার্ট রেন্টাল প্ল্যাটফর্ম
          </div>

          <h1 className="font-headline font-extrabold text-5xl sm:text-6xl leading-[1.35] tracking-normal text-slate-800 dark:text-slate-100">
            বাড়ি ভাড়া হোক <br />
            <span className="gradient-text bg-gradient-to-r from-primary to-violet-600 inline-block mt-2 sm:mt-3 pt-3 pb-2 px-1 ">সহজ ও ডিজিটাল</span>
          </h1>

          {/* Target User Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 space-y-2 hover:scale-[1.02] transition-transform shadow-sm">
              <p className="font-headline font-black text-lg text-primary">ভাড়াটিয়াদের জন্য</p>
              <p className="text-on-surface-variant dark:text-slate-300 text-xs leading-relaxed font-semibold">
                পছন্দমতো বাসা খুঁজে নিন কোনো ঝামেলা ছাড়াই সরাসরি মালিকের সাথে যোগাযোগ করে।
              </p>
            </div>
            <div className="p-5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 space-y-2 hover:scale-[1.02] transition-transform shadow-sm">
              <p className="font-headline font-black text-lg text-violet-600">বাড়িওয়ালাদের জন্য</p>
              <p className="text-on-surface-variant dark:text-slate-300 text-xs leading-relaxed font-semibold">
                ভাড়া ম্যানেজমেন্ট করুন অটোমেটেড ইনভয়েস এবং ট্র্যাকিং সিস্টেমের মাধ্যমে।
              </p>
            </div>
          </div>

          {/* 🌟 Highly Balanced & Elegant Search Grid Panel */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-[36px] border border-slate-250 dark:border-slate-800 shadow-2xl space-y-5">
            
            {/* Search Help Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  সার্চ করুন ও বাসা খুঁজে নিন 
                  <span className="text-[10px] bg-primary/10 px-2.5 py-0.5 rounded-full font-black text-primary">লাইভ প্রপার্টি</span>
                </p>
              </div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Smart Search Filter</p>
            </div>

            <form
              onSubmit={handleSearch}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 relative z-30"
            >
              {/* ১. লোকেশন ফিল্টার কার্ড - ১০০% উইডথ */}
              <div 
                ref={locationRef} 
                className="relative sm:col-span-2 bg-white dark:bg-slate-950 px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-850 hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer group flex items-center gap-2 shadow-sm"
              >
                {/* আইকন বক্স */}
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <MapPin size={16} className="stroke-[2.5]" />
                </div>
                
                {/* ইনপুট */}
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] uppercase tracking-wider font-black text-slate-450 dark:text-slate-400 select-none cursor-pointer">কোথায় থাকবেন?</label>
                  <input
                    value={locationInput}
                    onChange={(e) => {
                      setLocationInput(e.target.value);
                      setShowLocationSuggestions(true);
                    }}
                    onFocus={() => setShowLocationSuggestions(true)}
                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-black w-full outline-none dark:text-white placeholder-slate-400 dark:placeholder-slate-500 mt-0.5"
                    placeholder="উদা: উত্তরা, ঢাকা"
                    type="text"
                  />
                </div>

                {/* লোকেশন সাজেশন ড্রপডাউন */}
                {showLocationSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200 max-h-52 overflow-y-auto">
                    {filteredSuggestions.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setLocationInput(loc);
                          setShowLocationSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-750 font-black text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
                      >
                        <MapPin size={14} className="text-slate-400" />
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ২. বাসা ধরণ কার্ড - ৫০% উইডথ */}
              <div className="bg-white dark:bg-slate-950 px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-850 hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer group flex items-center gap-2 shadow-sm">
                {/* আইকন বক্স */}
                <div className="w-8 h-8 rounded-lg bg-violet-150/10 dark:bg-violet-950/20 flex items-center justify-center text-violet-600 dark:text-violet-400 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Home size={16} className="stroke-[2.5]" />
                </div>

                {/* ইনপুট */}
                <div className="flex-1 min-w-0 relative pr-5">
                  <label className="block text-[10px] uppercase tracking-wider font-black text-slate-450 dark:text-slate-400 select-none">বাসার ধরণ</label>
                  <select
                    value={houseType}
                    onChange={(e) => setHouseType(e.target.value)}
                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-black w-full appearance-none outline-none cursor-pointer dark:text-white dark:bg-slate-950 mt-0.5"
                  >
                    <option value="সব ধরণের বাসা">সব ধরণের বাসা</option>
                    <option value="Family">ফ্যামিলি বাসা</option>
                    <option value="Bachelor">ব্যাচেলর মেস</option>
                    <option value="Sublet">সাবলেট রুম</option>
                    <option value="Commercial">কমার্শিয়াল স্পেস</option>
                  </select>
                  {/* Chevron Down helper */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* ৩. বাজেট ফিল্টার কার্ড - ৫০% উইডথ */}
              <div 
                ref={budgetRef} 
                className="relative bg-white dark:bg-slate-950 px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-850 hover:border-primary/50 dark:hover:border-primary/50 transition-all cursor-pointer group flex items-center gap-2 shadow-sm"
                onClick={() => setShowBudgetSuggestions(true)}
              >
                {/* আইকন বক্স */}
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Banknote size={16} className="stroke-[2.5]" />
                </div>

                {/* ইনপুট */}
                <div className="flex-1 min-w-0 relative pr-5">
                  <label className="block text-[10px] uppercase tracking-wider font-black text-slate-450 dark:text-slate-400 select-none">বাজেট সীমানা</label>
                  <input
                    value={
                      budgetInput
                        ? budgetOptions.find((o) => o.val === budgetInput)?.label || `৳ ${Number(budgetInput).toLocaleString()}`
                        : ""
                    }
                    readOnly
                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-black w-full outline-none cursor-pointer dark:text-white placeholder-slate-700 mt-0.5"
                    placeholder="বাজেট সিলেক্ট"
                    type="text"
                  />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>

                {/* বাজেট সাজেশন ড্রপডাউন */}
                {showBudgetSuggestions && (
                  <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBudgetInput("");
                        setShowBudgetSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-750 font-black text-xs sm:text-sm text-slate-450 dark:text-slate-400 transition-colors"
                    >
                      যেকোনো বাজেট
                    </button>
                    {budgetOptions.map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBudgetInput(opt.val);
                          setShowBudgetSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-750 font-black text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-2"
                      >
                        <Banknote size={14} className="text-slate-400" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 🚀 Grand & Obvious Call-to-Action Search Button - ১০০% উইডথ */}
              <button
                type="submit"
                className="sm:col-span-2 bg-gradient-to-r from-primary to-violet-600 text-white w-full px-8 py-5 rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-99 hover:shadow-xl hover:shadow-primary/20 transition-all font-headline font-black text-base shadow-lg shadow-primary/10 cursor-pointer"
              >
                <Search size={20} className="stroke-[2.5]" />
                <span>বাসা খুঁজুন</span>
              </button>
            </form>
          </div>
        </div>

        {/* Banner Illustration */}
        <div className="relative group">
          <div className="rounded-[40px] overflow-hidden aspect-[4/3] shadow-2xl relative border-4 border-white dark:border-slate-800 ring-1 ring-slate-100 dark:ring-slate-800 transition-transform duration-500 hover:scale-[1.01]">
            <img
              alt="Modern Bangladeshi Interior"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Verified Host Badge Widget */}
          <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-6 rounded-[28px] shadow-2xl border border-slate-100 dark:border-slate-700/80 max-w-[220px] z-25 hidden sm:block animate-bounce-slow">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-black text-xs text-slate-800 dark:text-slate-100">Verified Landlords</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">১০০% ভেরিফাইড</p>
              </div>
            </div>
            <p className="text-3xl font-black font-headline text-slate-800 dark:text-white">
              {stats?.verifiedLandlords 
                ? stats.verifiedLandlords.replace(/[0-9]/g, (w: string) => ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'][+w]) 
                : "০+"}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold leading-relaxed mt-1">
              সক্রিয় বাড়িওয়ালা আমাদের ডিজিটাল প্ল্যাটফর্মে আছেন
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
