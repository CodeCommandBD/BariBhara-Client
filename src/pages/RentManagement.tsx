import { useState } from "react";
import { useRent } from "@/Hook/useRent";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Home, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Banknote,
  ChevronRight
} from "lucide-react";
import CollectPaymentModal from "@/components/modals/CollectPaymentModal";

const RentManagement = () => {
  const { pendingInvoices, isPendingLoading } = useRent();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isCollectModalOpen, setCollectModalOpen] = useState(false);

  // ফিল্টারিং লজিক (ভাড়াটিয়ার নাম বা প্রপার্টি দিয়ে সার্চ)
  const filteredInvoices = pendingInvoices.filter((inv: any) => 
    inv.tenant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.property?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.unit?.unitName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isPendingLoading) {
    return (
      <div className="p-10 flex items-center justify-center gap-3">
        <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="font-bold text-slate-500">লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* হেডার ও স্ট্যাটাস কার্ডস */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CreditCard className="text-primary" size={26} /> ভাড়া ও পেমেন্ট
          </h1>
          <p className="text-slate-500 text-sm mt-1">সব বকেয়া এবং পেন্ডিং বিল ম্যানেজ করুন</p>
        </div>
      </div>

      {/* কুইক স্ট্যাটাস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard 
          icon={<Banknote className="text-orange-500" />} 
          label="মোট বকেয়া বিল" 
          value={pendingInvoices.length} 
          bg="bg-orange-50"
        />
        <StatusCard 
          icon={<AlertCircle className="text-red-500" />} 
          label="সর্বমোট বকেয়া টাকা" 
          value={`৳ ${pendingInvoices.reduce((acc: number, inv: any) => acc + inv.dueAmount, 0).toLocaleString()}`} 
          bg="bg-red-50"
        />
        <StatusCard 
          icon={<Clock className="text-blue-500" />} 
          label="চলতি মাস" 
          value={new Date().toLocaleString('bn-BD', { month: 'long', year: 'numeric' })} 
          bg="bg-blue-50"
        />
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ভাড়াটিয়া, প্রপার্টি বা ইউনিট দিয়ে সার্চ করুন..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">
          <Filter size={18} /> ফিল্টার
        </button>
      </div>

      {/* বিল টেবিল */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">ভাড়াটিয়া ও ইউনিট</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">মাস / বছর</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">মোট বিল</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">বকেয়া (Due)</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">স্ট্যাটাস</th>
                <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-slate-400 font-bold">
                    কোনো বকেয়া বিল পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv: any) => (
                  <tr key={inv._id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                          {inv.tenant?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{inv.tenant?.name}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                            <Home size={10} /> {inv.property?.name} • {inv.unit?.unitName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                       <div className="flex items-center gap-1.5 text-slate-600 font-bold text-sm">
                          <Calendar size={14} className="text-slate-400" />
                          {inv.month}, {inv.year}
                       </div>
                    </td>
                    <td className="p-5">
                       <p className="text-sm font-black text-slate-700">৳ {inv.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="p-5">
                       <p className="text-sm font-black text-orange-600">৳ {inv.dueAmount?.toLocaleString()}</p>
                    </td>
                    <td className="p-5">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                         inv.status === "Partial" ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                       }`}>
                         {inv.status === "Partial" ? "আংশিক পেইড" : "বকেয়া"}
                       </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => { setSelectedInvoice(inv); setCollectModalOpen(true); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-100 hover:scale-105 active:scale-95 transition-all"
                      >
                        <Banknote size={14} /> টাকা গ্রহণ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* মডাল কানেকশন */}
      <CollectPaymentModal 
        isOpen={isCollectModalOpen} 
        onClose={() => setCollectModalOpen(false)} 
        invoice={selectedInvoice} 
      />
    </div>
  );
};

// স্ট্যাটাস কার্ড ছোট কম্পোনেন্ট
const StatusCard = ({ icon, label, value, bg }: any) => (
  <div className={`${bg} p-6 rounded-[32px] flex items-center gap-5 border border-white/50 shadow-sm`}>
    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xl font-black text-slate-800">{value}</p>
    </div>
  </div>
);

export default RentManagement;
