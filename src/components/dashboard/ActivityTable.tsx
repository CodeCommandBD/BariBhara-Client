import { ArrowRight, Banknote, Clock } from "lucide-react";
import { useDashboard } from "@/Hook/useDashboard";
import { Link } from "react-router-dom";

const ActivityTable = () => {
  const { recentTransactions, isTransactionsLoading } = useDashboard();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("bn-BD", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "Bkash": return "bg-pink-100 text-pink-700";
      case "Nagad": return "bg-orange-100 text-orange-700";
      case "Bank": return "bg-blue-100 text-blue-700";
      default: return "bg-emerald-100 text-emerald-700";
    }
  };

  return (
    <div className="bg-surface-container-lowest p-10 rounded-[3rem] shadow-sm border border-white/50">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-bold font-headline">সাম্প্রতিক লেনদেন</h3>
        <Link
          to="/payments"
          className="text-primary font-bold text-sm flex items-center gap-1 hover:underline font-body"
        >
          সব দেখুন <ArrowRight size={16} />
        </Link>
      </div>

      {isTransactionsLoading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="font-bold text-slate-400">লোড হচ্ছে...</span>
        </div>
      ) : recentTransactions.length === 0 ? (
        <div className="py-16 text-center text-slate-400">
          <Banknote className="mx-auto mb-3 opacity-30" size={40} />
          <p className="font-bold">এখনো কোনো লেনদেন হয়নি</p>
          <p className="text-sm mt-1">পেমেন্ট সংগ্রহ করলে এখানে দেখা যাবে</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-on-surface-variant text-xs font-black uppercase font-headline">
                <th className="pb-3 pl-4">ভাড়াটিয়া</th>
                <th className="pb-3">তারিখ</th>
                <th className="pb-3">প্রপার্টি / ইউনিট</th>
                <th className="pb-3 text-right">পরিমাণ</th>
                <th className="pb-3 pl-4">মেথড</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn: any) => (
                <tr
                  key={txn._id}
                  className="bg-surface-container-low/30 hover:bg-white transition-colors"
                >
                  <td className="py-4 pl-4 rounded-l-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                        {txn.tenant?.name?.charAt(0) ?? "?"}
                      </div>
                      <p className="font-bold text-sm">{txn.tenant?.name ?? "অজানা"}</p>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Clock size={12} />
                      {formatDate(txn.paymentDate)}
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600 font-medium">
                    {txn.invoice?.property?.name ?? "—"}
                    {txn.invoice?.unit?.unitName ? ` / ${txn.invoice.unit.unitName}` : ""}
                  </td>
                  <td className="py-4 text-right font-black text-primary">
                    ৳{txn.amount?.toLocaleString()}
                  </td>
                  <td className="py-4 pl-4 rounded-r-2xl">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getMethodColor(txn.paymentMethod)}`}>
                      {txn.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityTable;
