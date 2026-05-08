import { useState } from "react";
import { useTenant } from "@/Hook/useTenant";
import { Building2, MapPin, Phone, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/ui/Pagination";
import TenantPortalAccessModal from "@/components/modals/TenantPortalAccessModal";
import { ShieldCheck, ShieldOff } from "lucide-react";

const ITEMS_PER_PAGE = 9;

const Tenants = () => {
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const { tenants, total, totalPages, isTenantsLoading } = useTenant(page, ITEMS_PER_PAGE);

  if (isTenantsLoading) {
    return (
      <div className="p-10 flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="font-bold text-slate-500 dark:text-slate-400">লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="text-primary" size={26} /> ভাড়াটিয়া তালিকা
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            আপনার সকল সক্রিয় ভাড়াটিয়াদের কেন্দ্রীয় তালিকা
          </p>
        </div>
        <div className="px-5 py-2.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-2xl font-black text-sm">
          মোট: {total} জন
        </div>
      </div>

      {/* খালি স্টেট */}
      {tenants.length === 0 && (
        <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Users className="text-slate-300 dark:text-slate-500" size={36} />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">কোনো ভাড়াটিয়া নেই</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            প্রপার্টির কোনো ইউনিটে ভাড়াটিয়া যোগ করুন
          </p>
          <Link
            to="/properties"
            className="inline-block mt-5 px-6 py-2.5 bg-primary text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            প্রপার্টি দেখুন
          </Link>
        </div>
      )}

      {/* ভাড়াটিয়া কার্ড গ্রিড */}
      {tenants.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant: any) => (
              <div
                key={tenant._id}
                className="bg-white dark:bg-slate-800 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/40 transition-all overflow-hidden group"
              >
                {/* কার্ড হেডার — প্রপার্টি তথ্য */}
                <div className="bg-gradient-to-r from-primary/10 to-violet-50 dark:from-primary/20 dark:to-violet-900/20 px-5 py-3 flex items-center gap-2">
                  <Building2 size={14} className="text-primary" />
                  <p className="text-xs font-black text-primary truncate">
                    {tenant.property?.name}
                  </p>
                  <span className="ml-auto text-[10px] bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold">
                    {tenant.unit?.unitName}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* ভাড়াটিয়ার প্রোফাইল */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-violet-100 dark:from-primary/30 dark:to-violet-900/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {tenant.photo ? (
                        <img
                          src={tenant.photo.startsWith("http") ? tenant.photo : `http://localhost:4000/${tenant.photo}`}
                          className="w-full h-full object-cover"
                          alt={tenant.name}
                        />
                      ) : (
                        <User className="text-primary" size={22} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-800 dark:text-slate-100 truncate">{tenant.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Phone size={11} className="text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{tenant.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* ভাড়া ও লোকেশন */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <MapPin size={12} />
                      <span className="text-xs font-bold truncate max-w-[140px]">{tenant.property?.location}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-black uppercase">মাসিক ভাড়া</p>
                      <p className="text-base font-black text-primary">৳ {tenant.rentAmount?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* ইউনিট তথ্য */}
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase">
                      {tenant.unit?.floor} তলা
                    </span>
                    <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase">
                      {tenant.unit?.type}
                    </span>
                    <span className="ml-auto px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase">
                      সক্রিয়
                    </span>
                  </div>

                  {/* পোর্টাল অ্যাক্সেস বাটন */}
                  <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                    <button
                      onClick={() => setSelectedTenant(tenant)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-colors bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                    >
                      {tenant.portalEnabled ? (
                        <><ShieldCheck size={16} className="text-emerald-500" /> পোর্টাল এনাবলড</>
                      ) : (
                        <><ShieldOff size={16} className="text-slate-400" /> পোর্টাল অ্যাক্সেস দিন</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            total={total}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </>
      )}

      {/* Modal */}
      <TenantPortalAccessModal
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        tenant={selectedTenant}
      />
    </div>
  );
};

export default Tenants;
