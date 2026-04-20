import {
  Home,
  Users,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useDashboard } from "../Hook/useDashboard"; // আমাদের useDashboard হুকটি ইম্পোর্ট করলাম
import StatCard from "../components/dashboard/StatCard"; // স্ট্যাট কার্ড কম্পোনেন্ট
import OccupancyChart from "../components/dashboard/OccupancyChart"; // অকুপেন্সি চার্ট কম্পোনেন্ট
import RevenueChart from "../components/dashboard/RevenueChart"; // রেভিনিউ চার্ট কম্পোনেন্ট
import ActivityTable from "../components/dashboard/ActivityTable"; // অ্যাক্টিভিটি টেবিল কম্পোনেন্ট
import { useUIStore } from "@/store/useUIStore"; // UI স্টোর ইম্পোর্ট করলাম

// ড্যাশবোর্ড পেজ
const Dashboard = () => {
  // UI স্টোর থেকে openAddPropertyModal ফাংশনটি নিচ্ছি কারণ এটি আমাদের modal খোলার জন্য দরকার
  const { openAddPropertyModal } = useUIStore();

  // হুক থেকে ডাটা এবং লোডিং স্টেট নিচ্ছি
  const { stats, isLoading, error } = useDashboard();

  // যদি ডাটা লোড হতে থাকে, তবে একটি সিম্পল মেসেজ দেখাব (পরে আমরা এখানে স্কেলিটন লোডার দেব)
  if (isLoading)
    return <div className="p-10 text-center font-bold">ডাটা লোড হচ্ছে...</div>;

  // কোনো এরর হলে সেটি দেখাবে
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        ডাটা আনতে সমস্যা হয়েছে!
      </div>
    );
  return (
    <div className="lg:space-y-10 space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="lg:text-4xl text-2xl font-extrabold tracking-tight text-on-surface font-headline">
            ওভারভিউ
          </h1>
          <p className="text-on-surface-variant mt-1 font-body text-sm">
            আপনার প্রপার্টি পোর্টফোলিও এবং আয় এক নজরে দেখুন।
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white text-on-surface font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100 text-sm">
            রিপোর্ট
          </button>
          <button
            onClick={openAddPropertyModal}
            className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all text-sm"
          >
            নতুন প্রপার্টি
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* ১ম কার্ড: মোট প্রপার্টি */}
        <StatCard
          title="মোট প্রপার্টি"
          value={stats?.totalProperties ?? "০"}
          icon={Home}
          trend="এই মাসে ২ জন নতুন"
          trendIcon={TrendingUp}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />
        {/* ২য় কার্ড: মোট ইউনিট */}
        <StatCard
          title="অ্যাক্টিভ ভাড়াটিয়া"
          value={stats?.rentedUnits ?? "০"}
          icon={Users}
          trend={`খালি আছে: ${stats?.availableUnits ?? "০"}`}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        {/* ৩য় কার্ড: মাসিক আয় */}
        <StatCard
          title="মাসিক আয়"
          value={"৳ " + (stats?.totalRevenue?.toLocaleString("bn-BD") ?? "০")}
          icon={Wallet}
          trend="+১২% গত মাস থেকে"
          trendIcon={ArrowUpRight}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        {/* ৪র্থ কার্ড: ভাড়ার হার */}
        <StatCard
          title="ভাড়ার হার"
          value={`${stats?.occupancyRate ?? "০"}%`}
          icon={AlertTriangle}
          trend={stats?.occupancyRate > 80 ? "চমৎকার অবস্থা!" : "খালি আছে"}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="col-span-1">
          <OccupancyChart />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-on-surface">সাম্প্রতিক লেনদেন</h3>
          <button className="text-primary text-sm font-bold hover:underline">সব দেখুন</button>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[600px] lg:min-w-full">
            <ActivityTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
