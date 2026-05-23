import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

const PricingSection = () => {
  const { user } = useAuthStore();

  const isFreePlanActive = user?.role === "landlord" && user?.subscriptionPlan === "free" && user?.subscriptionStatus === "active";
  const isProPlanActive = user?.role === "landlord" && user?.subscriptionPlan === "pro" && user?.subscriptionStatus === "active";
  const isProPlanPending = user?.role === "landlord" && user?.subscriptionPlan === "pro" && user?.subscriptionStatus === "pending";

  return (
    <section className="bg-surface py-24">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline font-extrabold text-4xl mb-4">সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান</h2>
          <p className="text-on-surface-variant">আপনার প্রয়োজন অনুযায়ী বেছে নিন সেরা প্ল্যানটি।</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <div className={`bg-surface-container-lowest p-10 rounded-lg shadow-sm border flex flex-col justify-between transition-all duration-300 ${isFreePlanActive ? "ring-2 ring-primary/40 border-primary bg-primary/5" : "border-slate-200 dark:border-slate-800"}`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-on-surface-variant font-bold">ফ্রি প্ল্যান</p>
                {isFreePlanActive && (
                  <span className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                    সক্রিয় প্ল্যান
                  </span>
                )}
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold font-headline text-on-surface">৳ ০</span>
                <span className="text-on-surface-variant">/ চিরকাল</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-green-500">check_circle</span> ১টি বিল্ডিং লিস্টিং</li>
                <li className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-green-500">check_circle</span> ২ জন ভাড়াটিয়া ম্যানেজমেন্ট</li>
                <li className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-green-500">check_circle</span> বেসিক ড্যাশবোর্ড সুবিধা</li>
                <li className="flex items-center gap-2 text-sm text-outline"><span className="material-symbols-outlined text-red-500">cancel</span> এসএমএস ও ইমেইল নোটিফিকেশন</li>
              </ul>
            </div>
            {isFreePlanActive ? (
              <div className="w-full py-3 rounded-full border-2 border-primary/50 bg-primary/10 text-primary font-bold text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">check</span>
                আপনার বর্তমান প্ল্যান
              </div>
            ) : user ? (
              <Link to="/dashboard" className="w-full py-3 rounded-full border-2 border-surface-container text-on-surface font-bold hover:bg-surface-container transition-all flex items-center justify-center">
                ড্যাশবোর্ডে ফিরে যান
              </Link>
            ) : (
              <Link to="/register" className="w-full py-3 rounded-full border-2 border-surface-container text-on-surface font-bold hover:bg-surface-container transition-all flex items-center justify-center">
                শুরু করুন
              </Link>
            )}
          </div>

          {/* Pro */}
          <div className={`bg-surface-container-lowest p-10 rounded-lg relative flex flex-col justify-between transition-all duration-300 ${isProPlanActive ? "shadow-2xl ring-2 ring-violet-500 border-violet-500 bg-violet-500/5" : "shadow-2xl ring-2 ring-primary"}`}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
              Most Popular
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-primary font-bold">প্রো প্ল্যান</p>
                {isProPlanActive && (
                  <span className="px-3 py-1 bg-violet-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm animate-pulse">
                    সক্রিয় প্রো প্ল্যান 🔥
                  </span>
                )}
              </div>
              <div className="mb-8">
                <span className="text-4xl font-extrabold font-headline text-on-surface">৳ ৯৯৯</span>
                <span className="text-on-surface-variant">/ মাস</span>
              </div>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-green-500">check_circle</span> আনলিমিটেড বিল্ডিং লিস্টিং</li>
                <li className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-green-500">check_circle</span> আনলিমিটেড ভাড়াটিয়া ম্যানেজমেন্ট</li>
                <li className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-green-500">check_circle</span> এসএমএস ও ইমেইল এলার্ট</li>
                <li className="flex items-center gap-2 text-sm text-on-surface-variant"><span className="material-symbols-outlined text-green-500">check_circle</span> সব প্রিমিয়াম ফিচার আনলক 💎</li>
              </ul>
            </div>

            {isProPlanActive ? (
              <div className="w-full py-3 rounded-full border-2 border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-center flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">verified</span>
                আপনার বর্তমান প্ল্যান
              </div>
            ) : isProPlanPending ? (
              <div className="w-full py-3 rounded-full border-2 border-amber-500 bg-amber-500/10 text-amber-600 font-bold text-center flex items-center justify-center gap-2 animate-pulse">
                <span className="material-symbols-outlined text-lg">hourglass_empty</span>
                পেমেন্ট ভেরিফিকেশন পেন্ডিং...
              </div>
            ) : user ? (
              <Link to="/payment/pro" className="w-full py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:opacity-90 transition-all flex items-center justify-center">
                সাবস্ক্রাইব করুন
              </Link>
            ) : (
              <Link to="/register?redirect=/payment/pro" className="w-full py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:opacity-90 transition-all flex items-center justify-center">
                সাবস্ক্রাইব করুন
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
