import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: 'জানু', revenue: 400000 },
  { month: 'ফেব্রু', revenue: 300000 },
  { month: 'মার্চ', revenue: 500000 },
  { month: 'এপ্রিল', revenue: 1000000 },
  { month: 'মে', revenue: 600000 },
  { month: 'জুন', revenue: 842000 },
];


const RevenueChart = () => {
  return (
     <div className="bg-surface-container-lowest p-8 rounded-[3rem] shadow-sm border border-white/50 h-full">
         <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold font-headline">আয় বিশ্লেষণ (রিভিনিউ)</h3>
          <p className="text-sm text-on-surface-variant font-body">বার্ষিক ক্যাশফ্লো প্রজেকশনস</p>
        </div>
        <select className="bg-surface-container-low border-none rounded-xl text-sm font-semibold px-4 py-2 focus:ring-primary font-headline cursor-pointer">
          <option>গত ৬ মাস</option>
          <option>২০২৪ সাল</option>
        </select>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#702ae1" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#702ae1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef1f3" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#595c5e', fontSize: 12}}
              dy={10}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value) => [`৳${value.toLocaleString()}`, 'আয়']}
            />
            <Area
              type="monotone" 
              dataKey="revenue" 
              stroke="#702ae1" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorRev)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
     </div>
  )
}

export default RevenueChart