import { useState } from "react";
import { 
  ShieldCheck, FileText, RefreshCw, Printer, Search, HelpCircle,
  ChevronRight, ArrowLeft, Bookmark
} from "lucide-react";
import { Link } from "react-router-dom";

const TermsPrivacy = () => {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "refund">("terms");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrint = () => {
    window.print();
  };

  const sections = {
    terms: [
      {
        title: "১. সাধারণ নিয়মাবলী ও একাউন্ট ব্যবহার",
        content: "BariBhara প্ল্যাটফর্মে রেজিস্ট্রেশন করার মাধ্যমে আপনি আমাদের শর্তাবলীতে সম্মতি প্রদান করছেন। প্রতিটি ল্যান্ডলর্ড এবং ভাড়াটিয়াকে নিজের সঠিক ও বৈধ জাতীয় পরিচয়পত্র (NID) অথবা প্রামাণ্য তথ্য ব্যবহার করতে হবে। কোনো ভুয়া বা বিভ্রান্তিকর তথ্য ব্যবহার করলে একাউন্ট সাময়িকভাবে বা স্থায়ীভাবে স্থগিত (block) করা হবে।"
      },
      {
        title: "২. সাবস্ক্রিপশন ও বিলিং পলিসি",
        content: "বাড়িওয়ালাদের জন্য আমাদের ফ্রি, বেসিক ও প্রো প্ল্যান রয়েছে। সাবস্ক্রিপশন প্ল্যান কেনার সময় সঠিক TrxID (Transaction ID) এবং পেমেন্ট মেথড প্রদান করতে হবে। প্ল্যাটফর্মে কোনো পেমেন্ট সিস্টেমের অপব্যবহার বা ভুয়া পেমেন্ট রিকোয়েস্ট সাবমিট করা কঠোরভাবে নিষিদ্ধ এবং এটি শাস্তিযোগ্য অপরাধ।"
      },
      {
        title: "৩. ব্যবহারকারীর দায়িত্ব ও আচরণ",
        content: "প্ল্যাটফর্মের মাধ্যমে তৈরি করা সমস্ত বাড়িভাড়া চুক্তি এবং ইনভয়েস ল্যান্ডলর্ড এবং ভাড়াটিয়ার পারস্পরিক বোঝাপড়ার ওপর ভিত্তি করে তৈরি। BariBhara কোনো ভাড়া বা টাকা আদান-প্রদান সংক্রান্ত পারস্পরিক বিরোধের জন্য দায়ী থাকবে না।"
      },
      {
        title: "৪. মেধা সম্পত্তি ও লাইসেন্স",
        content: "BariBhara প্ল্যাটফর্মের লোগো, কোডবেস, ইউজার ইন্টারফেস এবং অন্যান্য কনটেন্ট কপিরাইট আইন দ্বারা সুরক্ষিত। অনুমতি ছাড়া কোনো কনটেন্ট রি-প্রোডিউস বা বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা যাবে না।"
      }
    ],
    privacy: [
      {
        title: "১. সংগৃহীত তথ্যাবলী",
        content: "আমরা ব্যবহারকারীর নাম, ইমেইল এড্রেস, ফোন নম্বর, প্রোফাইল ছবি এবং বাসা সম্পর্কিত তথ্য সংগ্রহ করি। ভাড়াটিয়াদের চুক্তিপত্র তৈরির ক্ষেত্রে জাতীয় পরিচয়পত্রের প্রামাণিক নম্বর বা প্রাসঙ্গিক তথ্যাদি সম্পূর্ণ সুরক্ষিত ডেটাবেজে সংরক্ষণ করা হয়।"
      },
      {
        title: "২. তথ্যের নিরাপত্তা ও ব্যবহার",
        content: "আপনার ব্যক্তিগত তথ্য সম্পূর্ণ এনক্রিপ্টেড অবস্থায় রাখা হয়। আমরা কোনো ব্যবহারকারীর তথ্য কোনো তৃতীয় পক্ষের কাছে বাণিজ্যিক উদ্দেশ্যে বিক্রি বা শেয়ার করি না। আপনার তথ্য শুধুমাত্র আপনার ড্যাশবোর্ডের অ্যাক্সেস এবং নোটিফিকেশন অ্যালার্ট প্রদানের কাজে ব্যবহৃত হয়।"
      },
      {
        title: "৩. সকেট ও রিয়েল-টাইম ট্র্যাকিং",
        content: "আমাদের সিস্টেমে নোটিফিকেশন এবং রিয়েল-টাইম অ্যালার্ট প্রদানের জন্য সকেট কানেকশন ব্যবহার করা হয়। এটি শুধুমাত্র লাইভ সেশন অ্যাক্টিভিটি সচল রাখার উদ্দেশ্যে ব্যবহৃত হয় এবং সেশন শেষ হলে স্বয়ংক্রিয়ভাবে ডিসকানেক্ট হয়ে যায়।"
      },
      {
        title: "৪. কুকিজ পলিসি",
        content: "আমরা ব্যবহারকারীর ব্রাউজার সেশন সচল রাখতে এবং থিম প্রেফারেন্স (লাইট/ডার্ক মোড) ও ভাষা সংরক্ষণ করতে কুকিজ ব্যবহার করি।"
      }
    ],
    refund: [
      {
        title: "১. রিফান্ড যোগ্যতা",
        content: "BariBhara একটি ডিজিটাল SaaS প্ল্যাটফর্ম। সাবস্ক্রিপশন সক্রিয় করার পর সাধারণত কোনো রিফান্ড প্রদান করা হয় না। তবে আপনি যদি ভুলবশত বা ডুপ্লিকেট পেমেন্ট করে থাকেন, তবে ২৪ ঘণ্টার মধ্যে আমাদের সাপোর্ট সেন্টারে যোগাযোগ করলে রিফান্ড বিবেচনা করা হবে।"
      },
      {
        title: "২. অ্যাকাউন্ট অ্যাক্টিভেশন সমস্যা",
        content: "ভুল TrxID বা পেমেন্ট গেটওয়ের ত্রুটির কারণে সাবস্ক্রিপশন সক্রিয় হতে দেরি হলে অনুগ্রহ করে রিফান্ড রিকোয়েস্ট করার আগে অ্যাডমিন রিভিউ-এর জন্য অপেক্ষা করুন।"
      },
      {
        title: "৩. রিফান্ড প্রসেস সময়",
        content: "যথাযথ রিফান্ড রিকোয়েস্ট অনুমোদিত হওয়ার পর ৩ থেকে ৫ কার্যদিবসের মধ্যে আপনার মোবাইল ব্যাংকিং (বিকাশ/নগদ/রকেট) অ্যাকাউন্টে টাকা ফেরত পাঠানো হবে।"
      }
    ]
  };

  const currentSections = sections[activeTab].filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-on-surface pt-28 pb-16 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Breadcrumbs and Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black font-headline text-slate-900 dark:text-white">টার্মস ও প্রাইভেসি পলিসি</h1>
            <p className="text-xs text-on-surface-variant">সর্বশেষ আপডেট: ২৬ মে, ২০২৬</p>
          </div>
          
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-on-surface border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Printer size={16} />
            প্রিন্ট করুন
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Glassmorphic Tabs Menu */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-450 dark:text-slate-550 uppercase tracking-widest ml-1">আইনি নথিপত্র</h3>
            <div className="flex flex-col gap-2">
              {[
                { id: "terms", label: "ব্যবহারের শর্তাবলী", desc: "Terms of Service", icon: FileText, color: "text-violet-500 bg-violet-50 dark:bg-violet-950/20" },
                { id: "privacy", label: "প্রাইভেসি পলিসি", desc: "Privacy Policy", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
                { id: "refund", label: "রিফান্ড পলিসি", desc: "Refund Policy", icon: RefreshCw, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setSearchQuery(""); }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                      isActive 
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "bg-transparent border-slate-100 dark:border-slate-800/40 text-on-surface hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20 text-white' : tab.color}`}>
                        <tab.icon size={20} />
                      </div>
                      <div>
                        <p className="font-black text-sm">{tab.label}</p>
                        <p className={`text-[10px] ${isActive ? 'text-white/80' : 'text-on-surface-variant'}`}>{tab.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  </button>
                );
              })}
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 mt-4">
              <span className="text-[11px] text-on-surface-variant font-bold block mb-1">যেকোনো সহায়তায়</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">শর্তাবলী সংক্রান্ত কোনো জটিলতা বা প্রশ্নের জন্য আমাদের সাপোর্ট মেইলে যোগাযোগ করুন।</p>
              <a href="mailto:support@baribhara.com" className="text-xs font-black text-primary block mt-2 hover:underline">
                support@baribhara.com
              </a>
            </div>
          </div>

          {/* Right Column: Search Box & Tab Content */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Elegant Search Bar */}
            <div className="relative">
              <span className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শর্ত বা পলিসির কোনো অংশ খুঁজুন..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm font-bold placeholder-slate-400 dark:placeholder-slate-600 outline-none focus:border-primary focus:shadow-md transition-all dark:text-slate-200"
              />
            </div>

            {/* Content Sheets Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              
              {/* Content Header */}
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Bookmark size={18} className="fill-primary" />
                </div>
                <div>
                  <h2 className="font-extrabold text-xl capitalize font-headline text-slate-850 dark:text-slate-100">
                    {activeTab === "terms" ? "ব্যবহারের শর্তাবলী (Terms of Service)" : activeTab === "privacy" ? "প্রাইভেসি পলিসি (Privacy Policy)" : "রিফান্ড পলিসি (Refund Policy)"}
                  </h2>
                  <p className="text-[11px] text-on-surface-variant font-bold mt-0.5">অনুগ্রহ করে মনোযোগ দিয়ে পড়ুন</p>
                </div>
              </div>

              {/* Legal Sections Lists */}
              <div className="space-y-6">
                {currentSections.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle size={44} className="text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-400 text-sm">কোনো তথ্য পাওয়া যায়নি।</p>
                  </div>
                ) : (
                  currentSections.map((sec, idx) => (
                    <div key={idx} className="space-y-2 border-b border-slate-50 dark:border-slate-800/40 pb-5 last:border-0 last:pb-0">
                      <h4 className="font-black text-sm md:text-base text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {sec.title}
                      </h4>
                      <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed text-justify md:pl-3.5">
                        {sec.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

            {/* Quick Agreement Consent Box */}
            <div className="bg-gradient-to-br from-primary/5 via-violet-500/5 to-transparent border border-primary/20 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl animate-pulse">📝</span>
                <div>
                  <h4 className="font-bold text-xs md:text-sm">সম্মতি সূচক আইন</h4>
                  <p className="text-[11px] text-on-surface-variant">BariBhara ব্যবহারে ল্যান্ডলর্ড এবং ভাড়াটিয়া এই শর্তাবলীতে দায়বদ্ধ থাকবেন।</p>
                </div>
              </div>
              <Link 
                to="/register" 
                className="px-6 py-2.5 bg-primary text-white font-black text-xs rounded-xl shadow-md shadow-primary/10 hover:scale-105 active:scale-95 transition-all text-center shrink-0"
              >
                একাউন্ট তৈরি করুন
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default TermsPrivacy;
