import { useState } from "react";
import {
  Home,
  Users,
  Wallet,
  TrendingUp,
  AlertCircle,
  BadgeDollarSign,
  Wrench,
} from "lucide-react";
import { useDashboard } from "../Hook/useDashboard";
import StatCard from "../components/dashboard/StatCard";
import OccupancyChart from "../components/dashboard/OccupancyChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import ActivityTable from "../components/dashboard/ActivityTable";
import LeaseAlerts from "../components/dashboard/LeaseAlerts";
import { DashboardSkeleton } from "@/components/ui/SkeletonLoaders";
import { useUIStore } from "@/store/useUIStore";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { openAddPropertyModal } = useUIStore();
  const { stats, isLoading, error } = useDashboard();

  const [isDismissed, setIsDismissed] = useState(() => localStorage.getItem("onboarding_dismissed") === "true");

  if (isLoading) return <DashboardSkeleton />;

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        ডাটা আনতে সমস্যা হয়েছে!
      </div>
    );

  const hasCompletedAllSteps = stats?.totalProperties > 0 && stats?.totalUnits > 0 && stats?.rentedUnits > 0;
  const showOnboarding = !isDismissed && !hasCompletedAllSteps;
  const completedStepsCount = 
    (stats?.totalProperties > 0 ? 1 : 0) + 
    (stats?.totalUnits > 0 ? 1 : 0) + 
    (stats?.rentedUnits > 0 ? 1 : 0) + 1; // 1 step is registration (always done)
  const onboardingProgress = Math.round((completedStepsCount / 4) * 100);

  const handleDismissOnboarding = () => {
    localStorage.setItem("onboarding_dismissed", "true");
    setIsDismissed(true);
  };

  const handleRestoreOnboarding = () => {
    localStorage.removeItem("onboarding_dismissed");
    setIsDismissed(false);
  };

  return (
    <div className="lg:space-y-10 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="lg:text-4xl text-2xl font-extrabold tracking-tight text-on-surface font-headline">
            ওভারভিউ
          </h1>
          <p className="text-on-surface-variant mt-1 font-body text-sm">
            আপনার প্রপার্টি পোর্টফোলিও এবং আয় এক নজরে দেখুন।
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {isDismissed && !hasCompletedAllSteps && (
            <button
              onClick={handleRestoreOnboarding}
              className="px-6 py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-2xl shadow-sm hover:bg-indigo-100 transition-all text-sm cursor-pointer"
            >
              গাইড দেখুন
            </button>
          )}
          <button
            onClick={openAddPropertyModal}
            className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all text-sm cursor-pointer"
          >
            নতুন প্রপার্টি
          </button>
        </div>
      </div>

      {/* 🚀 Landlord Interactive Onboarding Guide */}
      {showOnboarding && (
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-primary p-6 md:p-8 rounded-[32px] text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-white/20 text-white font-extrabold rounded-full text-[10px] uppercase tracking-wider">
                  টিউটোরিয়াল গাইড / Onboarding
                </span>
                <h2 className="text-xl md:text-2xl font-black mt-2">BariBhara-তে আপনাকে স্বাগতম! 🏠</h2>
                <p className="text-white/80 text-xs md:text-sm mt-0.5">আপনার বাড়ি ও ভাড়াটিয়া পরিচালনা শুরু করতে নিচের সহজ ৪টি ধাপ সম্পন্ন করুন।</p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="text-right">
                  <p className="text-xs text-white/70 font-bold">অগ্রগতি</p>
                  <p className="text-lg font-black">{onboardingProgress}%</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center font-black bg-white/10">
                  {completedStepsCount}/4
                </div>
              </div>
            </div>

            {/* Glowing progress line */}
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/55 transition-all duration-500" 
                style={{ width: `${onboardingProgress}%` }}
              />
            </div>

            {/* Stepper Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {[
                { 
                  title: "১. একাউন্ট তৈরি", 
                  desc: "সফলভাবে সম্পন্ন হয়েছে", 
                  done: true, 
                  action: null 
                },
                { 
                  title: "২. ১ম প্রপার্টি যোগ", 
                  desc: stats?.totalProperties > 0 ? "সম্পন্ন হয়েছে" : "বাড়ি বা ফ্ল্যাট তালিকাভুক্ত করুন", 
                  done: stats?.totalProperties > 0, 
                  action: openAddPropertyModal,
                  btnText: "বাড়ি যোগ করুন +" 
                },
                { 
                  title: "৩. ইউনিট/ফ্ল্যাট সাজান", 
                  desc: stats?.totalUnits > 0 ? "সম্পন্ন হয়েছে" : "রুম বা ফ্লোর প্ল্যান তৈরি করুন", 
                  done: stats?.totalUnits > 0, 
                  action: () => navigate("/properties"),
                  btnText: "ইউনিট সাজান ⚙️" 
                },
                { 
                  title: "৪. ভাড়াটিয়া আমন্ত্রণ", 
                  desc: stats?.rentedUnits > 0 ? "সম্পন্ন হয়েছে" : "প্রথম ভাড়াটিয়াকে যুক্ত করুন", 
                  done: stats?.rentedUnits > 0, 
                  action: () => navigate("/tenants"),
                  btnText: "ভাড়াটিয়া আনুন 👥" 
                }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between h-36 ${
                    step.done 
                      ? "bg-white/10 border-white/25 text-white/90" 
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/8 hover:border-white/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider">{step.title}</span>
                      {step.done ? (
                        <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center text-xs font-extrabold shadow-sm">✓</span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-2 leading-relaxed ${step.done ? "text-emerald-300 font-bold" : "text-white/70"}`}>
                      {step.desc}
                    </p>
                  </div>
                  {!step.done && step.action && (
                    <button
                      onClick={(e) => { e.stopPropagation(); step.action!(); }}
                      className="mt-3 w-full py-2 bg-white text-primary font-black text-[11px] rounded-xl hover:bg-white/90 active:scale-95 transition-all text-center cursor-pointer"
                    >
                      {step.btnText}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Stepper Footer Controls */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleDismissOnboarding}
                className="text-xs text-white/60 hover:text-white font-bold transition-all cursor-pointer underline decoration-dotted"
              >
                গাইডটি বন্ধ করুন (Dismiss Tutorial)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid — এখন ৫টি কার্ড (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        <StatCard
          title="মোট প্রপার্টি"
          value={stats?.totalProperties ?? "০"}
          icon={Home}
          trend={`মোট ইউনিট: ${stats?.totalUnits ?? "০"}`}
          trendIcon={TrendingUp}
          iconBg="bg-violet-100 dark:bg-violet-900/20"
          iconColor="text-violet-600 dark:text-violet-400"
        />
        <StatCard
          title="ভাড়াটিয়া"
          value={stats?.rentedUnits ?? "০"}
          icon={Users}
          trend={`খালি: ${stats?.availableUnits ?? "০"}`}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="এই মাসের আয়"
          value={"৳ " + (stats?.totalRevenue?.toLocaleString() ?? "০")}
          icon={Wallet}
          trend={`অকুপেন্সি: ${stats?.occupancyRate ?? "০"}%`}
          trendIcon={TrendingUp}
          iconBg="bg-emerald-100 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="মোট বকেয়া"
          value={"৳ " + (stats?.totalDue?.toLocaleString() ?? "০")}
          icon={AlertCircle}
          trend={stats?.totalDue > 0 ? "পেমেন্ট সংগ্রহ করুন" : "কোনো বকেয়া নেই ✓"}
          iconBg="bg-rose-100 dark:bg-rose-900/20"
          iconColor="text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="মেইনটেন্যান্স"
          value={stats?.pendingMaintenance ?? "০"}
          icon={Wrench}
          trend={stats?.pendingMaintenance > 0 ? "অনুরোধ পেন্ডিং আছে" : "সব ঠিক আছে ✓"}
          iconBg="bg-amber-100 dark:bg-amber-900/20"
          iconColor="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* লিজ এক্সপায়ারি অ্যালার্ট (শুধু থাকলেই দেখাবে) */}
      <LeaseAlerts />

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>
        <div className="col-span-1">
          <OccupancyChart />
        </div>
      </div>

      {/* Recent Activity Table */}
      <ActivityTable />
    </div>
  );
};

export default Dashboard;
