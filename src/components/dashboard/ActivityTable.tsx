import { ArrowRight } from "lucide-react";

const activities = [
  {
    id: "#BB-9021",
    name: "রকিবুল ইসলাম",
    date: "অক্টো ১২, ২০২৩",
    property: "স্কাইলাইন হাইটস, ৪বি",
    amount: "৳ ৪৫,০০০",
    status: "সফল",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  },
  {
    id: "#BB-4412",
    name: "নুসরাত জাহান",
    date: "অক্টো ১১, ২০২৩",
    property: "রোজ গার্ডেন, জি২",
    amount: "৳ ২৮,৫০০",
    status: "পেন্ডিং",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  },
  {
    id: "#BB-1109",
    name: "ফারুক আহমেদ",
    date: "অক্টো ১০, ২০২৩",
    property: "এলিট ভিলা, ১২এ",
    amount: "৳ ৬২,০০০",
    status: "ব্যর্থ",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  },
];

const ActivityTable = () => {
  return (
    <div className="bg-surface-container-lowest p-10 rounded-[3rem] shadow-sm border border-white/50">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-2xl font-bold font-headline">সাম্প্রতিক লেনদেন এবং অ্যাক্টিভিটি</h3>
        <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline font-body">
          সব ইতিহাস দেখুন <ArrowRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr className="text-on-surface-variant text-sm font-semibold font-headline">
              <th className="pb-4 pl-6">ভাড়াটিয়ার নাম</th>
              <th className="pb-4">তারিখ</th>
              <th className="pb-4">প্রপার্টি</th>
              <th className="pb-4 text-right">পরিমাণ</th>
              <th className="pb-4 pl-10">স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item) => (
              <tr key={item.id} className="bg-surface-container-low/30 hover:bg-white transition-colors group">
                <td className="py-5 pl-6 rounded-l-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-white">
                      <img src={item.image} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-sm font-headline">{item.name}</p>
                      <p className="text-[11px] text-on-surface-variant font-body">আইডি: {item.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 text-sm font-medium font-body">{item.date}</td>
                <td className="py-5 text-sm font-medium font-body">{item.property}</td>
                <td className="py-5 text-right font-bold text-primary font-headline">{item.amount}</td>
                <td className="py-5 pl-10 rounded-r-2xl">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${
                    item.status === "সফল" ? "bg-emerald-100/50 text-emerald-700" :
                    item.status === "পেন্ডিং" ? "bg-amber-100/50 text-amber-700" :
                    "bg-red-100/50 text-red-700"
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityTable;
