import { useState } from "react";
import { useTenant } from "@/Hook/useTenant";
import { Building2, MapPin, Phone, User, Users, Clock, AlertTriangle, CalendarClock, RefreshCcw, PenTool, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/ui/Pagination";
import TenantPortalAccessModal from "@/components/modals/TenantPortalAccessModal";
import ManualRenewModal from "@/components/modals/ManualRenewModal";
import DocumentModal from "@/components/modals/DocumentModal";
import DeleteAgreementModal from "@/components/modals/DeleteAgreementModal";
import { ShieldCheck, ShieldOff, FileText } from "lucide-react";

const ITEMS_PER_PAGE = 9;

const Tenants = () => {
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [renewingTenant, setRenewingTenant] = useState<any>(null);
  const [documentTenant, setDocumentTenant] = useState<any>(null);
  const [deletingAgreementId, setDeletingAgreementId] = useState<string | null>(null);
  const { 
    tenants, total, totalPages, isTenantsLoading, 
    toggleAutoRenewMutation, renewLeaseMutation, 
    generateAgreementMutation, deleteAgreementMutation 
  } = useTenant(page, ITEMS_PER_PAGE);

  const getLeaseStatus = (leaseEnd: string | undefined) => {
    if (!leaseEnd) return { status: 'none', days: 0 };
    const end = new Date(leaseEnd);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'expired', days: diffDays };
    if (diffDays <= 30) return { status: 'expiring-soon', days: diffDays };
    return { status: 'active', days: diffDays };
  };

  const handleToggleAutoRenew = (id: string, currentStatus: boolean) => {
    toggleAutoRenewMutation.mutate({ id, autoRenew: !currentStatus });
  };

  const handleManualRenew = (id: string, newEndDate: string) => {
    renewLeaseMutation.mutate({ id, newEndDate });
  };

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

                  {/* Lease Expiry Warning Badge */}
                  {(() => {
                    const lease = getLeaseStatus(tenant.leaseEnd);
                    if (lease.status === 'none') return null;
                    return (
                      <div className={`flex items-center justify-between p-3 rounded-xl border ${lease.status === 'expired' ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30' : lease.status === 'expiring-soon' ? 'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}>
                        <div className="flex items-center gap-2">
                          {lease.status === 'expired' ? <AlertTriangle size={16} className="text-red-500" /> : <Clock size={16} className={lease.status === 'expiring-soon' ? 'text-orange-500' : 'text-slate-400'} />}
                          <div>
                            <p className={`text-xs font-bold ${lease.status === 'expired' ? 'text-red-600 dark:text-red-400' : lease.status === 'expiring-soon' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300'}`}>
                              {lease.status === 'expired' ? 'লিজের মেয়াদ শেষ' : lease.status === 'expiring-soon' ? `${lease.days} দিন পর মেয়াদ শেষ` : 'মেয়াদ আছে'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">{new Date(tenant.leaseEnd).toLocaleDateString('bn-BD')} পর্যন্ত</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setRenewingTenant(tenant)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors ${lease.status === 'expired' ? 'bg-red-500 text-white hover:bg-red-600' : lease.status === 'expiring-soon' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                        >
                          <RefreshCcw size={12} /> নবায়ন
                        </button>
                      </div>
                    );
                  })()}

                  {/* Auto Renew Toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">অটো-রিনিউয়াল</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">মেয়াদ শেষে স্বয়ংক্রিয়ভাবে বাড়বে</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={tenant.autoRenew}
                        onChange={() => handleToggleAutoRenew(tenant._id, tenant.autoRenew)}
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* পোর্টাল ও ডকুমেন্টস */}
                  <div className="pt-2 border-t border-slate-50 dark:border-slate-700 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedTenant(tenant)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs transition-colors bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                    >
                      {tenant.portalEnabled ? (
                        <><ShieldCheck size={14} className="text-emerald-500" /> পোর্টাল অ্যাক্সেস</>
                      ) : (
                        <><ShieldOff size={14} className="text-slate-400" /> পোর্টাল</>
                      )}
                    </button>
                    <button
                      onClick={() => setDocumentTenant(tenant)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs transition-colors bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/20"
                    >
                      <FileText size={14} className="text-violet-500" /> ডকুমেন্টস
                    </button>
                  </div>

                  {/* ডিজিটাল চুক্তি বাটন */}
                  <div className="pt-2">
                    {tenant.agreement?.pdfUrl ? (
                      <div className="flex items-center justify-between p-3 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tenant.agreement?.isSigned ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {tenant.agreement?.isSigned ? <ShieldCheck size={16} /> : <FileText size={16} />}
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase text-slate-400">চুক্তি স্ট্যাটাস</p>
                            <p className={`text-xs font-bold ${tenant.agreement?.isSigned ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {tenant.agreement?.isSigned ? 'স্বাক্ষরিত' : 'স্বাক্ষর পেন্ডিং'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <a 
                            href={tenant.agreement.pdfUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-white dark:bg-slate-700 text-primary border border-primary/20 rounded-lg text-[10px] font-black hover:bg-primary hover:text-white transition-all"
                          >
                            দেখুন
                          </a>
                          <button
                            onClick={() => setDeletingAgreementId(tenant._id)}
                            disabled={deleteAgreementMutation.isPending}
                            className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-900/30 rounded-lg text-[10px] font-black hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => generateAgreementMutation.mutate(tenant._id)}
                        disabled={generateAgreementMutation.isPending}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                      >
                        {generateAgreementMutation.isPending ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <PenTool size={14} />
                        )}
                        ডিজিটাল চুক্তিপত্র তৈরি করুন
                      </button>
                    )}
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

      {/* Modals */}
      <TenantPortalAccessModal
        isOpen={!!selectedTenant}
        onClose={() => setSelectedTenant(null)}
        tenant={selectedTenant}
      />
      <ManualRenewModal
        isOpen={!!renewingTenant}
        onClose={() => setRenewingTenant(null)}
        tenant={renewingTenant}
        onRenew={handleManualRenew}
      />
      <DocumentModal
        isOpen={!!documentTenant}
        onClose={() => setDocumentTenant(null)}
        tenantId={documentTenant?._id}
        tenantName={documentTenant?.name}
      />
      <DeleteAgreementModal
        isOpen={!!deletingAgreementId}
        onClose={() => setDeletingAgreementId(null)}
        isLoading={deleteAgreementMutation.isPending}
        onConfirm={() => {
          if (deletingAgreementId) {
            deleteAgreementMutation.mutate(deletingAgreementId, {
              onSuccess: () => setDeletingAgreementId(null),
            });
          }
        }}
      />
    </div>
  );
};

export default Tenants;
