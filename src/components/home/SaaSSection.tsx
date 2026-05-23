const SaaSSection = () => {
  return (
    <section className="bg-surface-container-low py-24">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-secondary font-bold tracking-widest uppercase text-xs mb-4">Smart Management</p>
          <h2 className="font-headline font-extrabold text-5xl mb-6">বাড়িওয়ালাদের জন্য স্মার্ট টুলস</h2>
          <p className="text-on-surface-variant text-lg">আপনার প্রপার্টি ম্যানেজমেন্টকে আরও দক্ষ এবং সহজ করতে আমাদের রয়েছে আধুনিক সব ফিচার।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-surface-container-lowest p-10 rounded-xl hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-4 text-on-surface">Tenant Tracking</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">ভাড়াটিয়াদের তথ্য, এনআইডি এবং চুক্তির বিস্তারিত এক জায়গায় রাখুন নিরাপদভাবে।</p>
          </div>
          <div className="bg-surface-container-lowest p-10 rounded-xl hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-4 text-on-surface">Automated Invoicing</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">প্রতি মাসে অটোমেটিক ইনভয়েস জেনারেট করুন এবং অনলাইনে ভাড়া গ্রহণ করুন।</p>
          </div>
          <div className="bg-surface-container-lowest p-10 rounded-xl hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>sms</span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-4 text-on-surface">SMS Alerts</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">ভাড়া পরিশোধের রিমাইন্ডার এবং গুরুত্বপূর্ণ নোটিশ পাঠান সরাসরি এসএমএস এর মাধ্যমে।</p>
          </div>
          <div className="bg-surface-container-lowest p-10 rounded-xl hover:-translate-y-2 transition-transform duration-300 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center mb-8">
              <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            </div>
            <h3 className="font-headline font-bold text-xl mb-4 text-on-surface">Revenue Reports</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">মাসিক এবং বার্ষিক আয়-ব্যয়ের গ্রাফিকাল রিপোর্ট দেখুন মাত্র এক ক্লিকেই।</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaaSSection;
