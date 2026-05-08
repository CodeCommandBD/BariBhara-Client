import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CreditCard, FileText, Wrench, AlertTriangle, Building, Home, MapPin, CheckCircle2 } from "lucide-react";
import { useTenantAuthStore } from "../../store/useTenantAuthStore";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:4000/api/tenant-portal";

const TenantDashboard = () => {
  const { token } = useTenantAuthStore();

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["tenant-dashboard"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/dashboard`, { headers: authHeader });
      return res.data;
    },
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const { tenant, stats, recentInvoices, activeMaintenance } = dashboardData || {};

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-[32px] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">স্বাগতম, {tenant?.name}! 👋</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-bold mt-4">
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <Building size={16} /> {tenant?.property?.name}
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <Home size={16} /> ইউনিট: {tenant?.unit?.unitName}
            </span>
            <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <MapPin size={16} /> {tenant?.property?.address}
            </span>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute right-20 -bottom-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Due */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-start gap-4 transition-all hover:shadow-md">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${stats?.totalDue > 0 ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20'}`}>
            <CreditCard size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">মোট বকেয়া</p>
            <h3 className={`text-2xl font-black mt-1 ${stats?.totalDue > 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
              ৳ {stats?.totalDue?.toLocaleString() || 0}
            </h3>
            {stats?.totalDue === 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full mt-2">
                <CheckCircle2 size={10} /> কোনো বকেয়া নেই
              </span>
            )}
          </div>
        </div>

        {/* Total Paid */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-start gap-4 transition-all hover:shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <FileText size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">মোট পরিশোধিত</p>
            <h3 className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-100">
              ৳ {stats?.totalPaid?.toLocaleString() || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-bold">{stats?.totalInvoices} টি ইনভয়েস</p>
          </div>
        </div>

        {/* Active Maintenance */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-start gap-4 transition-all hover:shadow-md">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${stats?.activeMaintenance > 0 ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20' : 'bg-slate-50 text-slate-500 dark:bg-slate-800'}`}>
            <Wrench size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">চলমান মেইনটেন্যান্স</p>
            <h3 className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-100">
              {stats?.activeMaintenance || 0} টি
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">সাম্প্রতিক বিল</h3>
            <Link to="/tenant/invoices" className="text-sm font-bold text-primary hover:underline">সব দেখুন</Link>
          </div>
          
          <div className="space-y-4">
            {recentInvoices?.length === 0 ? (
              <p className="text-center text-slate-400 py-4 font-bold text-sm">কোনো বিল পাওয়া যায়নি</p>
            ) : (
              recentInvoices?.map((invoice: any) => (
                <div key={invoice._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center text-primary font-black">
                      {invoice.month.substring(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">{invoice.month} {invoice.year}</p>
                      <p className="text-xs text-slate-500 font-bold mt-0.5">মোট: ৳{invoice.totalAmount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                      invoice.status === "Paid" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      invoice.status === "Partial" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {invoice.status}
                    </span>
                    {invoice.dueAmount > 0 && (
                      <p className="text-xs font-bold text-red-500 mt-1">বকেয়া: ৳{invoice.dueAmount}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Maintenance Requests */}
        <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">মেইনটেন্যান্স স্ট্যাটাস</h3>
            <Link to="/tenant/maintenance" className="text-sm font-bold text-primary hover:underline">অনুরোধ করুন</Link>
          </div>

          <div className="space-y-4">
            {activeMaintenance?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={24} className="text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold text-sm">কোনো চলমান সমস্যা নেই</p>
              </div>
            ) : (
              activeMaintenance?.map((req: any) => (
                <div key={req._id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{req.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                      req.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-200" : "bg-blue-50 text-blue-600 border border-blue-200"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
