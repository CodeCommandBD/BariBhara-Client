const HeroSection = () => {
  return (
    <header className="relative pt-32 pb-20 hero-gradient">
      <div className="max-w-screen-2xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="font-headline font-extrabold text-6xl leading-[1.1] mb-8 tracking-tight">
            বাড়ি ভাড়া হোক <br />
            <span className="gradient-text">সহজ ও ডিজিটাল</span>
          </h1>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="space-y-2">
              <p className="font-headline font-bold text-xl text-primary">ভাড়াটিয়াদের জন্য</p>
              <p className="text-on-surface-variant leading-relaxed">পছন্দমতো বাসা খুঁজে নিন কোনো ঝামেলা ছাড়াই সরাসরি মালিকের সাথে যোগাযোগ করে।</p>
            </div>
            <div className="space-y-2">
              <p className="font-headline font-bold text-xl text-secondary">বাড়িওয়ালাদের জন্য</p>
              <p className="text-on-surface-variant leading-relaxed">ভাড়া ম্যানেজমেন্ট করুন অটোমেটেড ইনভয়েস এবং ট্র্যাকিং সিস্টেমের মাধ্যমে।</p>
            </div>
          </div>
          {/* Smart Search Bar */}
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xl flex flex-wrap md:flex-nowrap items-center gap-4 border border-outline-variant/10">
            <div className="flex-1 space-y-1 px-4">
              <label className="text-[10px] uppercase tracking-wider font-bold text-outline">Location</label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                <input className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full font-semibold outline-none" placeholder="উত্তরা, ঢাকা" type="text" />
              </div>
            </div>
            <div className="w-px h-10 bg-surface-container hidden md:block"></div>
            <div className="flex-1 space-y-1 px-4">
              <label className="text-[10px] uppercase tracking-wider font-bold text-outline">House Type</label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">home</span>
                <select className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full font-semibold appearance-none outline-none">
                  <option>ফ্যামিলি বাসা</option>
                  <option>ব্যাচেলর মেস</option>
                  <option>অফিস স্পেস</option>
                </select>
              </div>
            </div>
            <div className="w-px h-10 bg-surface-container hidden md:block"></div>
            <div className="flex-1 space-y-1 px-4">
              <label className="text-[10px] uppercase tracking-wider font-bold text-outline">Budget</label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">payments</span>
                <input className="bg-transparent border-none p-0 focus:ring-0 text-sm w-full font-semibold outline-none" placeholder="৳ ১০,০০০ - ২০,০০০" type="text" />
              </div>
            </div>
            <button className="bg-primary text-on-primary w-full md:w-16 h-14 rounded-full flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-xl overflow-hidden aspect-[4/3] shadow-2xl">
            <img alt="Modern Bangladeshi Interior" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0XuO56UmBml8tzm8pZvaKyMyBLR09KEdxo43A6CUP2KL-iwDzXcVIZMZV9rc32HEZKqGXJvqpuJxapHknKxxbrY3NHW3THmnrmEAkJ-M1SH7kOXxKUexbYWbL9znJ9HplVOaNc-ATL--UI4Cx-GUkceaqEHTu9syIfPmR8SwzKwbgNIBYispKh9Or9Uo21ofmsIwht79AYsEB7EuxBOPrV5gOOQqzgUd5bGI-TF8GIoCkP0ijSb_HMEOK_NzL06JYXThxiui0QM9D" />
          </div>
          <div className="absolute -bottom-10 -left-10 bg-surface-container-lowest p-6 rounded-lg shadow-xl max-w-[200px] z-10 hidden md:block border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <p className="font-bold text-xs">Verified Landlords</p>
            </div>
            <p className="text-2xl font-black font-headline">৫,০০০+</p>
            <p className="text-[10px] text-on-surface-variant">সক্রিয় বাড়িওয়ালা আমাদের সাথে আছেন</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
