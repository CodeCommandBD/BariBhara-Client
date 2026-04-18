import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import {
  Home,
  Users,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import OccupancyChart from "../components/dashboard/OccupancyChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import ActivityTable from "../components/dashboard/ActivityTable";

const Dashboard = () => {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">
            ওভারভিউ
          </h1>
          <p className="text-on-surface-variant mt-2 font-body">
            আপনার প্রপার্টি পোর্টফোলিও এবং আয় এক নজরে দেখুন।
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-white text-on-surface font-semibold rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-100">
            রিপোর্ট ডাউনলোড
          </button>
          <button className="px-6 py-3 bg-primary text-white font-semibold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            কুইক অ্যাকশন
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="মোট প্রপার্টি"
          value="২৪"
          icon={Home}
          trend="এই মাসে ২ জন নতুন"
          trendIcon={TrendingUp}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
        />
        <StatCard
          title="অ্যাক্টিভ ভাড়াটিয়া"
          value="১৮২"
          icon={Users}
          trend="৯৪% অকুপেন্সি রেট"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="মাসিক আয়"
          value="৳ ৮২k"
          icon={Wallet}
          trend="+১২% গত মাস থেকে"
          trendIcon={ArrowUpRight}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="বকেয়া ভাড়া"
          value="৳ ২৫K"
          icon={AlertTriangle}
          trend="১২টি পেমেন্ট বাকি"
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <OccupancyChart />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="pb-10">
        <ActivityTable />
      </div>
    </div>
  );
};


export default Dashboard;
