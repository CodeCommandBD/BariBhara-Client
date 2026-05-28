import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Star, StarHalf, MessageSquare } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoaders";

const BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/profile`;

const Reviews = () => {
  const { token, user } = useAuthStore();
  
  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/me`, { headers: authHeader });
      return res.data.user;
    },
    enabled: !!token,
  });

  if (isLoading) return <DashboardSkeleton />;

  if (user?.role !== "landlord") {
    return (
      <div className="p-10 text-center font-bold text-slate-500">
        এই পেজটি শুধুমাত্র বাড়িওয়ালাদের জন্য।
      </div>
    );
  }

  const rating = profileData?.landlordRating;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="text-primary" size={26} /> ভাড়াটিয়াদের রেটিং ও মতামত
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          ভাড়াটিয়াদের দেওয়া ফিডব্যাক শুধুমাত্র আপনিই দেখতে পারবেন।
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Star size={20} className="text-amber-500 fill-amber-500" /> রেটিং ওভারভিউ
            </h3>
          </div>
          {rating?.average?.overall >= 4.5 && rating?.totalRatings >= 2 && (
            <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 border border-amber-200 dark:border-amber-900/50 shadow-sm animate-in zoom-in">
              <Star size={14} fill="currentColor" /> Top Rated Landlord 👑
            </div>
          )}
        </div>

        {!rating || rating?.totalRatings === 0 ? (
          <div className="text-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <Star size={28} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-black text-slate-700 dark:text-slate-300 mb-1">এখনো কোনো রেটিং নেই</h3>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-sm">
              আপনার ভাড়াটিয়ারা রেটিং দিলে সেটি এখানে দেখা যাবে। মার্কেটপ্লেসে ব্যাজ পেতে অন্তত ২ জন ভাড়াটিয়া থেকে ৪.৫+ রেটিং প্রয়োজন।
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Average Scores Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-5 text-center border border-amber-100 dark:border-amber-900/30">
                <p className="text-[11px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-2">সর্বমোট (Overall)</p>
                <p className="text-3xl font-black text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1.5">
                  {rating.average.overall.toFixed(1)} <Star size={20} fill="currentColor" />
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 text-center border border-blue-100 dark:border-blue-900/30">
                <p className="text-[11px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-wider mb-2">আচরণ (Behavior)</p>
                <p className="text-2xl font-black text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1.5">
                  {rating.average.behavior.toFixed(1)} <Star size={18} fill="currentColor" />
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-5 text-center border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-wider mb-2">সার্ভিস (Service)</p>
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                  {rating.average.maintenance.toFixed(1)} <Star size={18} fill="currentColor" />
                </p>
              </div>
            </div>

            {/* Review List */}
            <div>
              <h4 className="text-base font-black text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                সব মতামত ({rating.totalRatings})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rating.reviews.map((rev: any, idx: number) => (
                  <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center font-bold text-primary text-sm shadow-inner">
                          {rev.tenantId?.photo ? (
                            <img src={rev.tenantId.photo} alt={rev.tenantId.fullName} className="w-full h-full object-cover" />
                          ) : (
                            rev.tenantId?.fullName?.charAt(0) || "T"
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 dark:text-slate-200">
                            {rev.tenantId?.fullName || "অজানা ভাড়াটিয়া"}
                          </p>
                          <p className="text-xs text-slate-400">{new Date(rev.date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="flex text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const avg = (rev.behavior + rev.maintenance) / 2;
                          if (i + 1 <= avg) return <Star key={i} size={13} fill="currentColor" />;
                          if (i < avg) return <StarHalf key={i} size={13} fill="currentColor" />;
                          return <Star key={i} size={13} className="text-slate-300 dark:text-slate-600" />;
                        })}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mb-3 text-xs text-slate-500 dark:text-slate-400 font-bold bg-white dark:bg-slate-800 p-2 rounded-xl">
                      <span className="flex items-center gap-1"><span className="text-blue-500">আচরণ:</span> {rev.behavior}/5</span>
                      <span className="flex items-center gap-1"><span className="text-emerald-500">সার্ভিস:</span> {rev.maintenance}/5</span>
                    </div>

                    {rev.review ? (
                      <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed bg-slate-100/50 dark:bg-slate-700/50 p-3 rounded-xl border-l-2 border-primary">
                        "{rev.review}"
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">কোনো লিখিত মতামত নেই।</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
