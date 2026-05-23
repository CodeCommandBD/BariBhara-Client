const MarketplaceSection = () => {
  return (
    <section className="py-24 max-w-screen-2xl mx-auto px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <p className="text-primary font-bold tracking-widest uppercase text-xs mb-4">Marketplace</p>
          <h2 className="font-headline font-extrabold text-4xl">জনপ্রিয় বাসাগুলো দেখুন</h2>
        </div>
        <button className="text-primary font-bold flex items-center gap-2 hover:gap-4 transition-all">
          সবগুলো দেখুন <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Property Card 1 */}
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-200 dark:border-slate-800">
          <div className="relative h-64">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Luxurious 3-bedroom apartment in Uttara Dhaka" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQDLAXrQ9WUmk6XYYS7i_6niM-lR3Xx5szQnY2AcsNkU5HBDZ9Za3CFRwnmfJ5VAfU_dXFfEBUA_VsVUUyiqe0Mp7mEE13F1FAYyz9eg7AtY3NLVOuqDQRWFnU49F9H9Ct2F8fA6nRYxy5rb2kR83fZRKnpbKPspRFDI9NECg-0vh-f4fJkgPIOoBhK1Ubq5oibevX3w5p-TnMuS56B-ZDN4yeyZddM-_1QwsQaD2Sajmlq5iib7c4dM4g9VzKBHqBi4Q6ci6d0Tne" />
            <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-green-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-[10px] font-bold text-on-surface">Verified</span>
            </div>
          </div>
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline font-bold text-xl text-on-surface">মডার্ন লাক্সারি অ্যাপার্টমেন্ট</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span> সেক্টর ৪, উত্তরা, ঢাকা
                </p>
              </div>
              <p className="font-headline font-extrabold text-xl text-primary">৳ ২৫,০০০</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-on-surface-variant border-y border-surface-container py-4">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bed</span> ৩ রুম</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bathtub</span> ২ বাথ</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">square_foot</span> ১৬০০ স্কয়ার ফিট</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
              </button>
              <button className="flex-1 border-2 border-primary text-primary py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">call</span> Call Now
              </button>
            </div>
          </div>
        </div>
        {/* Property Card 2 */}
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-200 dark:border-slate-800">
          <div className="relative h-64">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Modern studio apartment for bachelors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5gcTJtATmFLJF9heKa9Iqinr7oIRVAnfa4cqTi5AvVpnjp2jXbzzjLiGpKVXrLleeIxwEXFlasYBG4xwJWjMg7Cvfp1MtOewVrrBC8Ok12ktPrkjx5XYkaT-ZkqI3g8J9Dhtkaz-BAeilejzkGry-LjRn18pZl7AWapOdrBJwxOdRPZc6JkOvt1M_ocM983-XaAC2e6C_LI9IpNuXVHN5WCSrURH_5nsQewJQ1RS6A07fiA6-PsikEVjwZSLcKArYbrt-p2Ux4LVF" />
            <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-green-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-[10px] font-bold text-on-surface">Verified</span>
            </div>
          </div>
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline font-bold text-xl text-on-surface">ব্যাচেলর স্টুডিও ফ্ল্যাট</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span> বনানী, ঢাকা
                </p>
              </div>
              <p className="font-headline font-extrabold text-xl text-primary">৳ ১২,০০০</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-on-surface-variant border-y border-surface-container py-4">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bed</span> ১ রুম</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bathtub</span> ১ বাথ</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">square_foot</span> ৪০০ স্কয়ার ফিট</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
              </button>
              <button className="flex-1 border-2 border-primary text-primary py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">call</span> Call Now
              </button>
            </div>
          </div>
        </div>
        {/* Property Card 3 */}
        <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-200 dark:border-slate-800">
          <div className="relative h-64">
            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Spacious family home in Dhanmondi" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRGWqsw3g_Sco0b3AFt0QH-rlCxyvI1h-DcXuEYGvK84O-DwKvu2PnMmC-1WYjcWjePL2FeG6P_YWO3ckDe2vUTArWtqjweuFs_x5cVkhaBxaO1sjcR77HSPtSE8cCe7PFRl8oXbn1VwfyIB9e4OuudVbb8djhpmn2xpQsk2jxlm6dAEshKTTeJ5B8nqo7C22dNm2SbbrPgIeXH7_6DzBsA230_OVg6Xpjcl592T0wRiTQjIHz9R7H70tco4MMufd1tXSLxFR_yx7V" />
            <div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-green-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="text-[10px] font-bold text-on-surface">Verified</span>
            </div>
          </div>
          <div className="p-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline font-bold text-xl text-on-surface">ফ্যামিলি ডুপ্লেক্স বাসা</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">location_on</span> ধানমন্ডি, ঢাকা
                </p>
              </div>
              <p className="font-headline font-extrabold text-xl text-primary">৳ ৪৫,০০০</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-on-surface-variant border-y border-surface-container py-4">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bed</span> ৪ রুম</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">bathtub</span> ৩ বাথ</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">square_foot</span> ২২০০ স্কয়ার ফিট</span>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-colors">
                <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
              </button>
              <button className="flex-1 border-2 border-primary text-primary py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined text-sm">call</span> Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceSection;
