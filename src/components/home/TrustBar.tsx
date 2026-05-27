import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

interface PublicStats {
  successSearches: string;
  listedProperties: string;
  satisfiedClients: string;
  supportHours: string;
}

// 🌟 অত্যন্ত প্রিমিয়াম ও স্মুথ কাউন্ট-আপ এনিমেশন কম্পোনেন্ট
const AnimatedCounter = ({ targetString, suffix = "+" }: { targetString: string; suffix?: string }) => {
  const [count, setCount] = useState(0);

  // স্ট্রিং থেকে সংখ্যা বের করা (যেমন: "42+" থেকে 42, "99.9%" থেকে 99.9)
  const targetVal = parseFloat(targetString.replace(/[^0-9.]/g, "")) || 0;
  const isDecimal = targetString.includes(".");

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ১.২ সেকেন্ড এনিমেশন ডিউরেশন
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutQuad) - কাউন্টিং এর শেষে গতি সুন্দরভাবে কমে যাবে
      const easeProgress = progress * (2 - progress);
      const currentVal = easeProgress * targetVal;

      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(targetVal);
      }
    };

    requestAnimationFrame(animate);
  }, [targetVal]);

  return (
    <span>
      {isDecimal ? count.toFixed(1) : Math.round(count)}
      {suffix}
    </span>
  );
};

const TrustBar = () => {
  // ১. প্ল্যাটফর্ম লাইভ স্ট্যাটস ফেচ করা
  const { data: stats } = useQuery<PublicStats>({
    queryKey: ["public-stats-v2"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/public/stats`);
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <section className="bg-surface-container-lowest py-12 border-y border-slate-100 dark:border-slate-800/80">
      <div className="max-w-screen-2xl mx-auto px-8 flex flex-wrap justify-around md:justify-between items-center gap-10">
        
        {/* ১. সফল বাসা খোঁজা */}
        <div className="flex items-center gap-4 group">
          <div className="w-1.5 h-10 bg-primary rounded-full group-hover:scale-y-125 transition-transform duration-300" />
          <div>
            <span className="text-4xl font-black font-headline text-primary tracking-tight block">
              {stats?.successSearches ? (
                <AnimatedCounter targetString={stats.successSearches} suffix="+" />
              ) : (
                "৪২+"
              )}
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">সফল বাসা খোঁজা</p>
          </div>
        </div>

        {/* ২. লিস্টেড প্রপার্টি */}
        <div className="flex items-center gap-4 group">
          <div className="w-1.5 h-10 bg-secondary rounded-full group-hover:scale-y-125 transition-transform duration-300" />
          <div>
            <span className="text-4xl font-black font-headline text-secondary tracking-tight block">
              {stats?.listedProperties ? (
                <AnimatedCounter targetString={stats.listedProperties} suffix="+" />
              ) : (
                "১৫+"
              )}
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">লিস্টেড প্রপার্টি</p>
          </div>
        </div>

        {/* ৩. সন্তুষ্ট গ্রাহক */}
        <div className="flex items-center gap-4 group">
          <div className="w-1.5 h-10 bg-primary rounded-full group-hover:scale-y-125 transition-transform duration-300" />
          <div>
            <span className="text-4xl font-black font-headline text-primary tracking-tight block">
              {stats?.satisfiedClients ? (
                <AnimatedCounter targetString={stats.satisfiedClients} suffix="%" />
              ) : (
                "৯৯.৯%"
              )}
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">সন্তুষ্ট গ্রাহক</p>
          </div>
        </div>

        {/* ৪. কাস্টমার সাপোর্ট */}
        <div className="flex items-center gap-4 group">
          <div className="w-1.5 h-10 bg-secondary rounded-full group-hover:scale-y-125 transition-transform duration-300" />
          <div>
            <span className="text-4xl font-black font-headline text-secondary tracking-tight block flex items-center">
              ২৪/৭
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 mt-0.5">কাস্টমার সাপোর্ট</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustBar;
