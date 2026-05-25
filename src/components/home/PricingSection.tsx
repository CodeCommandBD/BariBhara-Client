import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PublicPlan {
  _id: string;
  name: string;
  title: string;
  price: number;
  billingCycle: string;
  features: string[];
  limits: {
    maxProperties: number;
    maxTenants: number;
  };
}

const PricingSection = () => {
  const { user } = useAuthStore();

  const isFreePlanActive = user?.role === "landlord" && user?.subscriptionPlan === "free" && user?.subscriptionStatus === "active";
  const isProPlanActive = user?.role === "landlord" && user?.subscriptionPlan === "pro" && user?.subscriptionStatus === "active";
  const isProPlanPending = user?.role === "landlord" && user?.subscriptionPlan === "pro" && user?.subscriptionStatus === "pending";

  // ১. সাবস্ক্রিপশন প্ল্যানস ডায়নামিকালি ফেচ করা
  const { data: plans, isLoading } = useQuery<PublicPlan[]>({
    queryKey: ["public-plans"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:4000/api/public/plans");
      return response.data.data;
    },
    refetchOnWindowFocus: false,
  });

  // ২. ফলব্যাক প্ল্যানস (এপিআই ফেইল করলে ব্যাকওয়ার্ড কমপ্যাটিবিলিটির জন্য)
  const defaultPlans: PublicPlan[] = [
    {
      _id: "free-fallback",
      name: "free",
      title: "ফ্রি প্ল্যান",
      price: 0,
      billingCycle: "forever",
      features: [
        "১টি বিল্ডিং লিস্টিং",
        "২ জন ভাড়াটিয়া ম্যানেজমেন্ট",
        "বেসিক ড্যাশবোর্ড সুবিধা",
        "এসএমএস ও ইমেইল নোটিফিকেশন নেই"
      ],
      limits: { maxProperties: 1, maxTenants: 2 }
    },
    {
      _id: "pro-fallback",
      name: "pro",
      title: "প্রো প্ল্যান",
      price: 999,
      billingCycle: "monthly",
      features: [
        "অনলিমিটেড বিল্ডিং লিস্টিং",
        "অনলিমিটেড ভাড়াটিয়া ম্যানেজমেন্ট",
        "এসএমএস ও ইমেইল এলার্ট",
        "সব প্রিমিয়াম ফিচার আনলক 💎"
      ],
      limits: { maxProperties: -1, maxTenants: -1 }
    }
  ];

  const activePlans = plans && plans.length > 0 ? plans : defaultPlans;

  return (
    <section className="bg-surface py-24">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline font-extrabold text-4xl mb-4">সাশ্রয়ী সাবস্ক্রিপশন প্ল্যান</h2>
          <p className="text-on-surface-variant">আপনার প্রয়োজন অনুযায়ী বেছে নিন সেরা প্ল্যানটি।</p>
        </div>

        {isLoading ? (
          // শিমার স্কেলেটন ইফেক্ট
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="bg-surface-container-lowest p-10 rounded-3xl shadow-sm border border-slate-100 animate-pulse space-y-6">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/4" />
                </div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
                <div className="space-y-3 pt-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-full" />
                  ))}
                </div>
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-full w-full pt-4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {activePlans.map((plan) => {
              const isPro = plan.name === "pro";
              const isPlanActive = plan.name === "free" ? isFreePlanActive : isProPlanActive;

              return (
                <div
                  key={plan._id}
                  className={`bg-surface-container-lowest p-10 rounded-[2rem] relative flex flex-col justify-between transition-all duration-300 ${
                    isPlanActive
                      ? isPro
                        ? "shadow-2xl ring-2 ring-violet-500 border-violet-500 bg-violet-500/5"
                        : "ring-2 ring-primary/40 border-primary bg-primary/5 shadow-md"
                      : isPro
                      ? "shadow-2xl ring-2 ring-primary border-primary"
                      : "border-slate-200 dark:border-slate-800 border shadow-sm"
                  }`}
                >
                  {isPro && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className={`font-bold ${isPro ? "text-primary text-lg" : "text-on-surface-variant"}`}>
                        {plan.title}
                      </p>
                      {isPlanActive && (
                        <span
                          className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                            isPro ? "bg-violet-500 text-white animate-pulse" : "bg-primary/20 text-primary"
                          }`}
                        >
                          সক্রিয় {isPro && "প্রো "}প্ল্যান {isPro && "🔥"}
                        </span>
                      )}
                    </div>

                    <div className="mb-8 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold font-headline text-on-surface">
                        ৳{plan.price.toLocaleString("bn-BD")}
                      </span>
                      <span className="text-on-surface-variant text-sm font-semibold">
                        / {plan.billingCycle === "forever" ? "চিরকাল" : "মাস"}
                      </span>
                    </div>

                    <ul className="space-y-4 mb-10">
                      {plan.features.map((feature, index) => {
                        const isNotSupported = feature.includes("নেই") || feature.includes("no") || feature.includes("Not");
                        return (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm text-on-surface-variant font-medium"
                          >
                            <span className={`material-symbols-outlined text-sm ${isNotSupported ? "text-red-500" : "text-green-500"}`}>
                              {isNotSupported ? "cancel" : "check_circle"}
                            </span>
                            {feature}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* সাবস্ক্রিপশন ও অ্যাকশন লিংকস */}
                  {isPlanActive ? (
                    <div
                      className={`w-full py-3 rounded-full border-2 font-bold text-center flex items-center justify-center gap-2 ${
                        isPro ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400" : "border-primary/50 bg-primary/10 text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isPro ? "verified" : "check"}
                      </span>
                      আপনার বর্তমান প্ল্যান
                    </div>
                  ) : plan.name === "pro" && isProPlanPending ? (
                    <div className="w-full py-3 rounded-full border-2 border-amber-500 bg-amber-500/10 text-amber-600 font-bold text-center flex items-center justify-center gap-2 animate-pulse">
                      <span className="material-symbols-outlined text-lg">hourglass_empty</span>
                      পেমেন্ট ভেরিফিকেশন পেন্ডিং...
                    </div>
                  ) : user ? (
                    <Link
                      to={plan.name === "free" ? "/dashboard" : "/payment/pro"}
                      className="w-full py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center"
                    >
                      {plan.name === "free" ? "ড্যাশবোর্ডে ফিরে যান" : "সাবস্ক্রাইব করুন"}
                    </Link>
                  ) : (
                    <Link
                      to={plan.name === "free" ? "/register" : "/register?redirect=/payment/pro"}
                      className="w-full py-3 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center"
                    >
                      {plan.name === "free" ? "শুরু করুন" : "সাবস্ক্রাইব করুন"}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
