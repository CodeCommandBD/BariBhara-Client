import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  accountStatus: "active" | "blocked";
  createdAt: string;
}

const AdminUsers = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/users`, {
        headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json() as Promise<{ users: User[] }>;
    },
    retry: false,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: "active" | "blocked" }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/users/${id}/status`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update status");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "User status updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 font-headline">User Management</h1>
      
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-sm">Name</th>
                <th className="p-4 font-semibold text-sm">Contact</th>
                <th className="p-4 font-semibold text-sm">Role</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <tr key={user._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                  <td className="p-4">
                    <p className="font-bold">{user.fullName}</p>
                    <p className="text-xs text-slate-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{user.phone}</p>
                    <p className="text-sm">{user.email}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      user.role === 'landlord' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.accountStatus === 'blocked' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {user.accountStatus === 'blocked' ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                      <span className="capitalize">{user.accountStatus || 'active'}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {user.accountStatus === 'blocked' ? (
                      <button 
                        onClick={() => statusMutation.mutate({ id: user._id, status: 'active' })}
                        disabled={statusMutation.isPending}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to block this user?")) {
                            statusMutation.mutate({ id: user._id, status: 'blocked' });
                          }
                        }}
                        disabled={statusMutation.isPending}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {(!data?.users || data.users.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
