import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface Subscription {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  plan: string;
  amount: number;
  senderNumber: string;
  paymentMethod: string;
  trxId: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  screenshot?: string;
  createdAt: string;
}

const AdminSubscriptions = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/subscription/all`, {
        headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      return res.json() as Promise<{ subscriptions: Subscription[] }>;
    },
    retry: false,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/subscription/${id}/approve`, {
        method: "POST",
        headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Subscription approved!");
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
    },
    onError: () => toast.error("Error approving subscription"),
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/subscription/${id}/reject`, {
        method: "POST",
        headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Subscription rejected!");
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
    },
    onError: () => toast.error("Error rejecting subscription"),
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 font-headline">Admin Subscriptions</h1>
      
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 font-semibold text-sm">User</th>
              <th className="p-4 font-semibold text-sm">Plan</th>
              <th className="p-4 font-semibold text-sm">Payment Info</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.subscriptions.map((sub) => (
              <tr key={sub._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                <td className="p-4">
                  <p className="font-bold">{sub.userId?.fullName}</p>
                  <p className="text-xs text-slate-500">{sub.userId?.phone}</p>
                </td>
                <td className="p-4">
                  <span className="capitalize font-semibold">{sub.plan}</span>
                  <p className="text-xs text-slate-500">৳ {sub.amount}</p>
                </td>
                <td className="p-4">
                  <p className="text-sm"><span className="uppercase">{sub.paymentMethod}</span> - {sub.senderNumber}</p>
                  <p className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded inline-block mt-1">TrxID: {sub.trxId}</p>
                  {sub.screenshot && (
                    <div className="mt-1">
                      <a 
                        href={sub.screenshot} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-bold"
                      >
                        🖼️ স্ক্রিনশট দেখুন
                      </a>
                    </div>
                  )}
                  {sub.rejectionReason && (
                    <div className="text-[11px] text-red-500 font-semibold mt-1 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded max-w-xs border border-red-100 dark:border-red-900/30">
                      {sub.rejectionReason}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    sub.status === "approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    sub.status === "rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}>
                    {sub.status === "approved" && <CheckCircle size={12} />}
                    {sub.status === "rejected" && <XCircle size={12} />}
                    {sub.status === "pending" && <Clock size={12} />}
                    <span className="capitalize">{sub.status}</span>
                  </span>
                </td>
                <td className="p-4 text-right">
                  {sub.status === "pending" && (
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => approveMutation.mutate(sub._id)}
                        disabled={approveMutation.isPending}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => rejectMutation.mutate(sub._id)}
                        disabled={rejectMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {(!data?.subscriptions || data.subscriptions.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
