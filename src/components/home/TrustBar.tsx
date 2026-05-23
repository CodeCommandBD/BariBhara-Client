const TrustBar = () => {
  return (
    <section className="bg-surface-container-lowest py-10">
      <div className="max-w-screen-2xl mx-auto px-8 flex flex-wrap justify-center md:justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold font-headline text-primary">৫০কে+</span>
          <p className="text-sm font-semibold text-on-surface-variant">সফল বাসা খোঁজা</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold font-headline text-secondary">১০কে+</span>
          <p className="text-sm font-semibold text-on-surface-variant">লিস্টেড প্রপার্টি</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold font-headline text-primary">৯৯%</span>
          <p className="text-sm font-semibold text-on-surface-variant">সন্তুষ্ট গ্রাহক</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold font-headline text-secondary">২৪/৭</span>
          <p className="text-sm font-semibold text-on-surface-variant">কাস্টমার সাপোর্ট</p>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
