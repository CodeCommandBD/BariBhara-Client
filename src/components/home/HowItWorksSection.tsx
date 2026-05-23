const HowItWorksSection = () => {
  return (
    <section className="py-24 max-w-screen-2xl mx-auto px-8">
      <h2 className="font-headline font-extrabold text-4xl text-center mb-20">কিভাবে শুরু করবেন?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-surface-container -translate-y-1/2 z-0"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-surface-container-lowest border-4 border-primary flex items-center justify-center font-headline font-black text-3xl text-primary shadow-xl">১</div>
          <h3 className="font-headline font-bold text-xl text-on-surface">অ্যাকাউন্ট খুলুন</h3>
          <p className="text-on-surface-variant">আপনার ফোন নম্বর দিয়ে খুব সহজেই কয়েক সেকেন্ডে রেজিস্টার করুন।</p>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-surface-container-lowest border-4 border-secondary flex items-center justify-center font-headline font-black text-3xl text-secondary shadow-xl">২</div>
          <h3 className="font-headline font-bold text-xl text-on-surface">প্রপার্টি যুক্ত করুন</h3>
          <p className="text-on-surface-variant">আপনার বাসার ছবি এবং প্রয়োজনীয় তথ্য দিয়ে লিস্টিং অথবা ম্যানেজমেন্ট শুরু করুন।</p>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-surface-container-lowest border-4 border-primary flex items-center justify-center font-headline font-black text-3xl text-primary shadow-xl">৩</div>
          <h3 className="font-headline font-bold text-xl text-on-surface">স্মার্টলি ম্যানেজ করুন</h3>
          <p className="text-on-surface-variant">ভাড়াটিয়া খুঁজুন অথবা বর্তমান ভাড়াটিয়াদের সবকিছু অটোমেশন সিস্টেমে আনুন।</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
