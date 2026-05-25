import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PublicStats {
  successSearches: string;
  listedProperties: string;
  satisfiedClients: string;
  supportHours: string;
}

const TrustBar = () => {
  // ১. প্ল্যাটফর্ম লাইভ স্ট্যাটস ফেচ করা
  const { data: stats } = useQuery<PublicStats>({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:4000/api/public/stats");
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <section className="bg-surface-container-lowest py-10">
      <div className="max-w-screen-2xl mx-auto px-8 flex flex-wrap justify-center md:justify-between items-center gap-8">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold font-headline text-primary transition-all duration-300">
            {stats?.successSearches || "৫০কে+"}
          </span>
          <p className="text-sm font-semibold text-on-surface-variant">সফল বাসা খোঁজা</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold font-headline text-secondary transition-all duration-300">
            {stats?.listedProperties || "১০কে+"}
          </span>
          <p className="text-sm font-semibold text-on-surface-variant">লিস্টেড প্রপার্টি</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold font-headline text-primary transition-all duration-300">
            {stats?.satisfiedClients || "৯৯%"}
          </span>
          <p className="text-sm font-semibold text-on-surface-variant">সন্তুষ্ট গ্রাহক</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-extrabold font-headline text-secondary transition-all duration-300">
            {stats?.supportHours || "২৪/৭"}
          </span>
          <p className="text-sm font-semibold text-on-surface-variant">কাস্টমার সাপোর্ট</p>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
