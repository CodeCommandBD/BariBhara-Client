import { X, Phone, IdCard, Calendar, CreditCard, LogOut, User } from "lucide-react";
import { useTenant } from "@/Hook/useTenant";

interface TenantDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId: string | undefined;
}

const TenantDetailModal = ({ isOpen, onClose, unitId }: TenantDetailModalProps) => {
  const { useGetTenantByUnit, vacateTenantMutation } = useTenant();
  const { data: tenant, isLoading } = useGetTenantByUnit(isOpen ? unitId : undefined);

  if (!isOpen) return null;

  const handleVacate = () => {
    if (!tenant) return;
    if (window.confirm(`আপনি কি নিশ্চিত যে "${tenant.name}" ইউনিট ছেড়ে গেছেন? এই অপারেশন ইউনিটটিকে খালি করে দেবে।`)) {
      vacateTenantMutation.mutate(tenant._id, { onSuccess: onClose });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "নির্ধারিত নয়";
    return new Date(dateStr).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* হেডার */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
          <h2 className="text-lg font-bold text-slate-800">ভাড়াটিয়ার তথ্য</h2>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="text-slate-500 text-sm font-bold">লোড হচ্ছে...</p>
            </div>
          ) : !tenant ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="text-slate-400" size={28} />
              </div>
              <p className="text-slate-500 font-bold">এই ইউনিটে কোনো ভাড়াটিয়া নেই</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* প্রোফাইল সেকশন */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-violet-100 flex items-center justify-center shadow-md flex-shrink-0">
                  {tenant.photo ? (
                    <img
                      src={tenant.photo.startsWith("http") ? tenant.photo : `http://localhost:4000/${tenant.photo}`}
                      className="w-full h-full object-cover"
                      alt={tenant.name}
                    />
                  ) : (
                    <User className="text-primary" size={32} />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{tenant.name}</h3>
                  <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase ${tenant.status === "সক্রিয়" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                    {tenant.status}
                  </span>
                </div>
              </div>

              {/* তথ্যের গ্রিড */}
              <div className="grid grid-cols-1 gap-3">
                <InfoRow icon={<Phone size={15} />} label="ফোন নম্বর" value={tenant.phone} />
                {tenant.nid && <InfoRow icon={<IdCard size={15} />} label="NID নম্বর" value={tenant.nid} />}
                <InfoRow icon={<CreditCard size={15} />} label="মাসিক ভাড়া" value={`৳ ${tenant.rentAmount?.toLocaleString()}`} highlight />
                {tenant.advanceAmount > 0 && (
                  <InfoRow icon={<CreditCard size={15} />} label="অগ্রিম প্রদত্ত" value={`৳ ${tenant.advanceAmount?.toLocaleString()}`} />
                )}
                <InfoRow icon={<Calendar size={15} />} label="ভাড়া শুরু" value={formatDate(tenant.leaseStart)} />
                {tenant.leaseEnd && (
                  <InfoRow icon={<Calendar size={15} />} label="লিজ শেষ" value={formatDate(tenant.leaseEnd)} />
                )}
              </div>

              {/* ভাড়াটিয়া সরানোর বাটন */}
              <button
                onClick={handleVacate}
                disabled={vacateTenantMutation.isPending}
                className="w-full py-3 flex items-center justify-center gap-2 bg-red-50 text-red-500 font-bold rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
              >
                {vacateTenantMutation.isPending ? (
                  <><div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" /> সরানো হচ্ছে...</>
                ) : (
                  <><LogOut size={16} /> ইউনিট ছেড়ে গেছেন (Vacate)</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// তথ্য সারির ছোট কম্পোনেন্ট
const InfoRow = ({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
    <div className={`p-2 rounded-xl ${highlight ? "bg-primary/10 text-primary" : "bg-white text-slate-400"}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
      <p className={`text-sm font-bold ${highlight ? "text-primary" : "text-slate-700"}`}>{value}</p>
    </div>
  </div>
);

export default TenantDetailModal;
