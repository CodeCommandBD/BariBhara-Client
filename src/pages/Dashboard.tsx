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

const Dashboard = () => {
  const { openAddPropertyModal } = useUIStore();
  const { stats, isLoading, error } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        ডাটা আনতে সমস্যা হয়েছে!
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
            আপনার প্রপার্টি পোর্টফোলিও এবং আয় এক নজরে দেখুন।
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={openAddPropertyModal}
            className="flex-1 md:flex-none px-6 py-3 bg-primary text-white font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all text-sm"
          >
            নতুন প্রপার্টি
          </button>
        </div>
      </div>

      {/* Stats Grid — এখন ৫টি কার্ড (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
