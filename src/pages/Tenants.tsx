import { useState } from "react";
import { useTenant } from "@/Hook/useTenant";
import { Building2, MapPin, Phone, User, Users, Clock, AlertTriangle, CalendarClock, RefreshCcw, PenTool, Trash2, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Pagination from "@/components/ui/Pagination";
import TenantPortalAccessModal from "@/components/modals/TenantPortalAccessModal";
import ManualRenewModal from "@/components/modals/ManualRenewModal";
import DocumentModal from "@/components/modals/DocumentModal";
import DeleteAgreementModal from "@/components/modals/DeleteAgreementModal";
import ReviewNidModal from "@/components/modals/ReviewNidModal";
import UtilitySettingsModal from "@/components/modals/UtilitySettingsModal";
import { ShieldCheck, ShieldOff, FileText, IdCard, Settings2 } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

const ITEMS_PER_PAGE = 9;

const Tenants = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [renewingTenant, setRenewingTenant] = useState<any>(null);
  const [documentTenant, setDocumentTenant] = useState<any>(null);
  const [deletingAgreementId, setDeletingAgreementId] = useState<string | null>(null);
  const [reviewingNidTenant, setReviewingNidTenant] = useState<any>(null);
  const [utilityTenant, setUtilityTenant] = useState<any>(null);

  const { 
    tenants, total, totalPages, isTenantsLoading, 
    toggleAutoRenewMutation, renewLeaseMutation, 
    generateAgreementMutation, deleteAgreementMutation,
    verifyNidMutation, updateUtilitiesMutation
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

  const handleVerifyNid = (id: string, status: string, reason: string) => {
    verifyNidMutation.mutate(
      { id, status, rejectionReason: reason },
      {
        onSuccess: () => {
          setReviewingNidTenant(null);
        },
      }
    );
  };

  const handleSaveUtilities = (id: string, utilityConfig: any) => {
    updateUtilitiesMutation.mutate(
      { id, utilityConfig },
      {
        onSuccess: () => {
          setUtilityTenant(null);
        },
      }
    );
  };

  const filteredTenants = tenants.filter((t: any) =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.phone?.includes(search) ||
    t.property?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.unit?.unitName?.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="নাম, ফোন, প্রপার্টি খুঁজুন..."
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 rounded-2xl text-sm font-bold border border-slate-200 dark:border-slate-700 outline-none focus:border-primary/40 dark:text-slate-200"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="px-5 py-2.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-2xl font-black text-sm shrink-0">
            মোট: {total} জন
          </div>
        </div>
      </div>

      {/* খালি স্টেট */}
      {filteredTenants.length === 0 && !isTenantsLoading && (
        <EmptyState
          title={search ? `"${search}" এর জন্য কেউ পাওয়া যায়নি!` : "কোনো ভাড়াটিয়া যুক্ত নেই!"}
          description={search ? "অনুগ্রহ করে বানান বা সার্চ কুয়েরি পুনরায় পরীক্ষা করুন।" : "আপনার প্রপার্টির কোনো খালি ফ্ল্যাট বা রুমে ভাড়াটিয়া আমন্ত্রণ জানিয়ে চুক্তি সম্পাদন করুন।"}
          icon={Users}
          actionText={search ? undefined : "প্রপার্টি তালিকা দেখুন"}
          onAction={search ? undefined : () => window.location.href = "/properties"}
        />
      )}

      {/* ভাড়াটিয়া কার্ড গ্রিড */}
      {filteredTenants.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTenants.map((tenant: any) => (
              <div
                key={tenant._id}
                className="bg-white dark:bg-slate-800 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl dark:hover:shadow-slate-900/40 transition-all overflow-hidden group"
              >
                {/* কার্ড হেডার — প্রপার্টি তথ্য */}
                <div className="bg-gradient-to-r from-primary/10 to-violet-50 dark:from-primary/20 dark:to-violet-900/20 px-5 py-3 flex items-center gap-2">
                  <Building2 size={14} className="text-primary shrink-0" />
                  <p className="text-xs font-black text-primary truncate">
                    {tenant.property?.name}
                  </p>
                  <span className="ml-auto text-[10px] bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">
                    {tenant.unit?.unitName}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* ভাড়াটিয়ার প্রোফাইল */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-violet-100 dark:from-primary/30 dark:to-violet-900/40 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {tenant.photo ? (
                        <img
                          src={tenant.photo.startsWith("http") ? tenant.photo : `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/${tenant.photo}`}
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
                        <Phone size={11} className="text-slate-400 shrink-0" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold truncate">{tenant.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* ভাড়া ও লোকেশন */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 min-w-0 pr-2">
                      <MapPin size={12} className="shrink-0" />
                      <span className="text-xs font-bold truncate">{tenant.property?.location}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] text-slate-400 font-black uppercase">মাসিক ভাড়া</p>
                      <p className="text-base font-black text-primary whitespace-nowrap">৳ {tenant.rentAmount?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* ইউনিট তথ্য */}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase whitespace-nowrap">
                      {tenant.unit?.floor} তলা
                    </span>
                    <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase whitespace-nowrap">
                      {tenant.unit?.type}
                    </span>
                    <span className="ml-auto px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase whitespace-nowrap shrink-0">
                      সক্রিয়
                    </span>
                  </div>

                  {/* Lease Expiry Warning Badge */}
                  {(() => {
                    const lease = getLeaseStatus(tenant.leaseEnd);
                    if (lease.status === 'none') return null;
                    return (
                      <div className={`flex items-center justify-between p-3 rounded-xl border ${lease.status === 'expired' ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30' : lease.status === 'expiring-soon' ? 'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}>
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          {lease.status === 'expired' ? <AlertTriangle size={16} className="text-red-500 shrink-0" /> : <Clock size={16} className={lease.status === 'expiring-soon' ? 'text-orange-500 shrink-0' : 'text-slate-400 shrink-0'} />}
                          <div className="min-w-0">
                            <p className={`text-xs font-bold truncate ${lease.status === 'expired' ? 'text-red-600 dark:text-red-400' : lease.status === 'expiring-soon' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-300'}`}>
                              {lease.status === 'expired' ? 'লিজের মেয়াদ শেষ' : lease.status === 'expiring-soon' ? `${lease.days} দিন পর মেয়াদ শেষ` : 'মেয়াদ আছে'}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{new Date(tenant.leaseEnd).toLocaleDateString('bn-BD')} পর্যন্ত</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setRenewingTenant(tenant)}
                          className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 transition-colors ${lease.status === 'expired' ? 'bg-red-500 text-white hover:bg-red-600' : lease.status === 'expiring-soon' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
                        >
                          <RefreshCcw size={12} /> নবায়ন
                        </button>
                      </div>
                    );
                  })()}

                  {/* Auto Renew Toggle */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">অটো-রিনিউয়াল</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">মেয়াদ শেষে স্বয়ংক্রিয়ভাবে বাড়বে</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={tenant.autoRenew}
                        onChange={() => handleToggleAutoRenew(tenant._id, tenant.autoRenew)}
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  {/* NID Verification Status */}
                  <div className="flex items-center justify-between p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center gap-2">
                      <IdCard size={16} className="text-indigo-500 shrink-0" />
                      <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400">NID স্ট্যাটাস</p>
                    </div>
                    {(() => {
                      const status = tenant.nidVerification?.status || "unsubmitted";
                      if (status === "pending") {
                        return (
                          <button 
                            onClick={() => setReviewingNidTenant(tenant)}
                            className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20 animate-pulse"
                          >
                            রিভিউ করুন
                          </button>
                        );
                      }
                      if (status === "verified") {
                        return (
                          <button 
                            onClick={() => setReviewingNidTenant(tenant)}
                            className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                          >
                            ভেরিফাইড
                          </button>
                        );
                      }
                      if (status === "rejected") {
                        return <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black rounded-lg">বাতিলকৃত</span>;
                      }
                      return <span className="text-[10px] font-bold text-slate-400">পাওয়া যায়নি</span>;
                    })()}
                  </div>

                  {/* পোর্টাল, ডকুমেন্টস ও ইউটিলিটি */}
                  <div className="pt-2 border-t border-slate-50 dark:border-slate-700 flex gap-2">
                    <button
                      onClick={() => setSelectedTenant(tenant)}
                      className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold text-[10px] transition-colors bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20"
                    >
                      {tenant.portalEnabled ? (
                        <ShieldCheck size={16} className="text-emerald-500" />
                      ) : (
                        <ShieldOff size={16} className="text-slate-400" />
                      )}
                      পোর্টাল
                    </button>
                    <button
                      onClick={() => setDocumentTenant(tenant)}
                      className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold text-[10px] transition-colors bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/20"
                    >
                      <FileText size={16} className="text-violet-500" /> ডকুমেন্টস
                    </button>
                    <button
                      onClick={() => setUtilityTenant(tenant)}
                      className="flex-1 flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold text-[10px] transition-colors bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20"
                    >
                      <Settings2 size={16} className="text-blue-500" /> ইউটিলিটি
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
      <ReviewNidModal
        isOpen={!!reviewingNidTenant}
        onClose={() => setReviewingNidTenant(null)}
        tenant={reviewingNidTenant}
        onVerify={handleVerifyNid}
        isLoading={verifyNidMutation.isPending}
      />
      <UtilitySettingsModal
        isOpen={!!utilityTenant}
        onClose={() => setUtilityTenant(null)}
        tenant={utilityTenant}
        onSave={handleSaveUtilities}
        isLoading={updateUtilitiesMutation.isPending}
      />
    </div>
  );
};

export default Tenants;
