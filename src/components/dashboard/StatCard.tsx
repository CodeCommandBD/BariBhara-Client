import type { LucideIcon  } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendIcon?: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendIcon: TrendIcon,
  iconBg,
  iconColor,
}: StatCardProps) => {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 group border border-white/50">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform`}
        >
          <Icon size={24} />
        </div>
      </div>
      <p className="text-on-surface-variant text-sm font-medium font-headline">
        {title}
      </p>
      <h3 className="text-3xl font-black mt-1 font-headline">{value}</h3>
      {trend && (
        <div
          className={`mt-4 flex items-center text-xs font-bold ${trend.includes("+") || trend.includes("new") || trend.includes("নতুন") ? "text-emerald-600" : "text-slate-400"}`}
        >
          {TrendIcon && <TrendIcon size={14} className="mr-1" />}
          {trend}
        </div>
      )}
    </div>
  );
};

export default StatCard;
