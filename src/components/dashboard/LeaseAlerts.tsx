import { AlertTriangle, Calendar, Home, User } from "lucide-react";
import { useDashboard } from "@/Hook/useDashboard";

const LeaseAlerts = () => {
  const { leaseAlerts, isAlertsLoading } = useDashboard();

  if (isAlertsLoading || leaseAlerts.length === 0) return null;

  const getDaysLeft = (leaseEnd: string) => {
    const diff = new Date(leaseEnd).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return "bg-red-50 border-red-200 text-red-700";
    if (days <= 15) return "bg-orange-50 border-orange-200 text-orange-700";
    return "bg-amber-50 border-amber-200 text-amber-700";
  };

  return (
    <div className="bg-white rounded-[32px] border border-amber-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-amber-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="text-amber-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">লিজ এক্সপায়ারি অ্যালার্ট</h3>
          <p className="text-xs text-slate-500">আগামী ৩০ দিনের মধ্যে চুক্তি শেষ হবে</p>
        </div>
        <span className="ml-auto bg-amber-500 text-white text-xs font-black px-3 py-1 rounded-full">
          {leaseAlerts.length}টি
        </span>
      </div>

      <div className="divide-y divide-slate-50">
        {leaseAlerts.map((tenant: any) => {
          const daysLeft = getDaysLeft(tenant.leaseEnd);
          const colorClass = getUrgencyColor(daysLeft);
          return (
            <div key={tenant._id} className="p-5 flex items-center gap-4 hover:bg-slate-50/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                {tenant.name?.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-800 text-sm">{tenant.name}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Home size={10} /> {tenant.property?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={10} /> {tenant.unit?.unitName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(tenant.leaseEnd).toLocaleDateString("bn-BD")}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-xl text-[11px] font-black border ${colorClass}`}>
                {daysLeft <= 0 ? "মেয়াদ শেষ!" : `${daysLeft} দিন বাকি`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaseAlerts;
