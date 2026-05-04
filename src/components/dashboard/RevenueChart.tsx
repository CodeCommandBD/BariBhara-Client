import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDashboard } from "@/Hook/useDashboard";

const RevenueChart = () => {
  const { revenueData, isRevenueLoading } = useDashboard();

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[3rem] shadow-sm border border-white/50 h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold font-headline">আয় বিশ্লেষণ (রিভিনিউ)</h3>
          <p className="text-sm text-on-surface-variant font-body">গত ৬ মাসের আয় ও বকেয়ার তুলনা</p>
        </div>
      </div>

      {isRevenueLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#702ae1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#702ae1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f3" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#595c5e", fontSize: 12 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: "1rem", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                formatter={(value: any, name: string) => [
                  `৳${Number(value).toLocaleString()}`,
                  name === "revenue" ? "কালেকশন" : "বকেয়া",
                ]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#702ae1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
              <Area
                type="monotone"
                dataKey="due"
                stroke="#f97316"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorDue)"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* লেজেন্ড */}
          <div className="flex items-center gap-5 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-bold text-slate-500">কালেকশন</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-xs font-bold text-slate-500">বকেয়া</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;