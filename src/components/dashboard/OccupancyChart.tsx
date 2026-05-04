import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useDashboard } from "@/Hook/useDashboard";

const OccupancyChart = () => {
  const { stats, isLoading } = useDashboard();

  const rentedUnits = stats?.rentedUnits ?? 0;
  const availableUnits = stats?.availableUnits ?? 0;
  const occupancyRate = stats?.occupancyRate ?? 0;

  const data = [
    { name: "ভাড়া হয়েছে", value: rentedUnits || 1, color: "#702ae1" },
    { name: "খালি আছে", value: availableUnits || (rentedUnits === 0 ? 1 : 0), color: "#eef1f3" },
  ];

  return (
    <div className="bg-surface-container-lowest p-8 rounded-[3rem] shadow-sm flex flex-col items-center justify-center text-center border border-white/50 h-full">
      <h3 className="text-xl font-bold mb-2 font-headline">প্রপার্টি অকুপেন্সি</h3>
      <p className="text-sm text-on-surface-variant mb-8 font-body">রিয়েল-টাইম অবস্থা</p>

      {isLoading ? (
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin my-12" />
      ) : (
        <>
          <div className="relative w-48 h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={rentedUnits > 0 && availableUnits > 0 ? 5 : 0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black font-headline">{occupancyRate}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-body">ভর্তি</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="flex items-center gap-2 justify-center">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-bold font-body">ভাড়া হয়েছে ({rentedUnits})</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="text-xs font-bold font-body">খালি আছে ({availableUnits})</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OccupancyChart;
