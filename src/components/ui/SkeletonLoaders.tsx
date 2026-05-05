// রিউজেবল Skeleton Loader কম্পোনেন্টস

// বেস শিমার এনিমেশন
const shimmer = "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]";

// সাধারণ রেক্টাঙ্গেল স্কেলিটন
export const SkeletonBox = ({ className = "" }: { className?: string }) => (
  <div className={`${shimmer} rounded-xl ${className}`} />
);

// স্ট্যাট কার্ড স্কেলিটন (Dashboard এর জন্য)
export const StatCardSkeleton = () => (
  <div className="bg-white rounded-[28px] p-6 border border-slate-100 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2 flex-1">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-8 w-32" />
        <SkeletonBox className="h-3 w-28" />
      </div>
      <SkeletonBox className="w-12 h-12 rounded-2xl" />
    </div>
  </div>
);

// চার্ট স্কেলিটন
export const ChartSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`bg-white rounded-[32px] p-8 border border-slate-100 space-y-4`}>
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <SkeletonBox className="h-5 w-40" />
        <SkeletonBox className="h-3 w-28" />
      </div>
      <SkeletonBox className="h-8 w-24 rounded-xl" />
    </div>
    <div className={`${shimmer} rounded-2xl ${height} w-full`} />
  </div>
);

// টেবিল রো স্কেলিটন
export const TableRowSkeleton = ({ cols = 5 }: { cols?: number }) => (
  <tr className="border-b border-slate-50">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="p-5">
        <SkeletonBox className={`h-4 ${i === 0 ? "w-32" : i === cols - 1 ? "w-16" : "w-24"}`} />
      </td>
    ))}
  </tr>
);

// পেজ হেডার স্কেলিটন
export const PageHeaderSkeleton = () => (
  <div className="flex justify-between items-center">
    <div className="space-y-2">
      <SkeletonBox className="h-8 w-48" />
      <SkeletonBox className="h-4 w-64" />
    </div>
    <SkeletonBox className="h-12 w-36 rounded-2xl" />
  </div>
);

// কার্ড লিস্ট স্কেলিটন (Tenant, Property এর জন্য)
export const CardSkeleton = () => (
  <div className="bg-white rounded-[24px] p-5 border border-slate-100 space-y-4">
    <div className="flex items-center gap-3">
      <SkeletonBox className="w-12 h-12 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <SkeletonBox className="h-4 w-32" />
        <SkeletonBox className="h-3 w-24" />
      </div>
      <SkeletonBox className="h-6 w-16 rounded-full" />
    </div>
    <SkeletonBox className="h-px w-full" />
    <div className="grid grid-cols-3 gap-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="space-y-1">
          <SkeletonBox className="h-3 w-12" />
          <SkeletonBox className="h-4 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// ড্যাশবোর্ড ফুল পেজ স্কেলিটন
export const DashboardSkeleton = () => (
  <div className="space-y-8">
    <PageHeaderSkeleton />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {[0, 1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ChartSkeleton height="h-64" />
      </div>
      <ChartSkeleton height="h-48" />
    </div>
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 space-y-4">
      <SkeletonBox className="h-6 w-48" />
      {[0, 1, 2, 3, 4].map(i => <TableRowSkeleton key={i} />)}
    </div>
  </div>
);

// রেন্ট ম্যানেজমেন্ট টেবিল স্কেলিটন
export const RentTableSkeleton = () => (
  <div className="bg-white rounded-[32px] border border-slate-100">
    <div className="p-6 border-b border-slate-50 flex justify-between">
      <SkeletonBox className="h-6 w-40" />
      <SkeletonBox className="h-6 w-24 rounded-xl" />
    </div>
    <table className="w-full">
      <tbody>
        {[0, 1, 2, 3, 4].map(i => <TableRowSkeleton key={i} cols={6} />)}
      </tbody>
    </table>
  </div>
);
