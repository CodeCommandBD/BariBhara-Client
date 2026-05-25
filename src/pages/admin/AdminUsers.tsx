import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, XCircle, X } from "lucide-react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  accountStatus: "active" | "blocked";
  createdAt: string;
  isVerified?: "unverified" | "pending" | "verified";
  verificationDetails?: {
    nidNumber: string;
    holdingNumber: string;
    message: string;
    submittedAt: string;
  };
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  confirmStyle?: "danger" | "success" | "warning";
  isPending?: boolean;
}

const ConfirmModal = ({
  isOpen, onClose, onConfirm, title, message, confirmLabel, confirmStyle = "danger", isPending
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const styleMap = {
    danger: {
      icon: <XCircle size={28} className="text-rose-500" />,
      iconBg: "bg-rose-50 dark:bg-rose-950/30",
      btn: "bg-rose-600 hover:bg-rose-700 shadow-rose-200 dark:shadow-rose-950",
    },
    success: {
      icon: <CheckCircle size={28} className="text-emerald-500" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
      btn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-emerald-950",
    },
    warning: {
      icon: <AlertTriangle size={28} className="text-amber-500" />,
      iconBg: "bg-amber-50 dark:bg-amber-950/30",
      btn: "bg-amber-600 hover:bg-amber-700 shadow-amber-200 dark:shadow-amber-950",
    },
  };
  const s = styleMap[confirmStyle];

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-sm w-full p-7 animate-in fade-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className={`w-14 h-14 ${s.iconBg} rounded-2xl flex items-center justify-center mb-5`}>
          {s.icon}
        </div>

        {/* Text */}
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-7">{message}</p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            বাতিল করুন
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white ${s.btn} shadow-lg transition-all disabled:opacity-60 cursor-pointer`}
          >
            {isPending ? "প্রসেস হচ্ছে..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  // Modal state
  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmStyle: "danger" | "success" | "warning";
    onConfirm: () => void;
  }>({
    open: false, title: "", message: "", confirmLabel: "", confirmStyle: "danger", onConfirm: () => {}
  });

  const openModal = (opts: Omit<typeof modal, "open">) =>
    setModal({ open: true, ...opts });
  const closeModal = () => setModal((m) => ({ ...m, open: false }));

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
      closeModal();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const [activeDetailsUserId, setActiveDetailsUserId] = useState<string | null>(null);

  const verifyMutation = useMutation({
    mutationFn: async ({ id, isVerified }: { id: string, isVerified: "verified" | "unverified" }) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/users/${id}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`
        },
        body: JSON.stringify({ isVerified })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update verification status");
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(data.message || "ভেরিফিকেশন স্ট্যাটাস আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setActiveDetailsUserId(null);
      closeModal();
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 font-headline">User Management</h1>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modal.open}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        confirmLabel={modal.confirmLabel}
        confirmStyle={modal.confirmStyle}
        isPending={statusMutation.isPending || verifyMutation.isPending}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-semibold text-sm">Name</th>
                <th className="p-4 font-semibold text-sm">Contact</th>
                <th className="p-4 font-semibold text-sm">Role</th>
                <th className="p-4 font-semibold text-sm">Verification</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.users.map((user) => (
                <React.Fragment key={user._id}>
                  <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
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
                      {user.role === 'landlord' ? (
                        <div className="flex flex-col gap-1 items-start">
                          {user.isVerified === 'verified' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                              🛡️ ভেরিফাইড
                            </span>
                          ) : user.isVerified === 'pending' ? (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900/30 animate-pulse">
                                ⏳ পেন্ডিং
                              </span>
                              <button
                                onClick={() => setActiveDetailsUserId(activeDetailsUserId === user._id ? null : user._id)}
                                className="text-[10px] text-primary hover:underline font-black cursor-pointer"
                              >
                                {activeDetailsUserId === user._id ? "বন্ধ করুন ✕" : "বিস্তারিত দেখুন 📋"}
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1 items-start">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30">
                                🛡️ আনভেরিফাইড
                              </span>
                              <button
                                onClick={() => openModal({
                                  title: "সরাসরি ভেরিফাই করুন",
                                  message: `আপনি কি "${user.fullName}" কে সরাসরি ভেরিফাইড মার্ক করতে চান? কোনো আবেদন ছাড়াই তাকে ভেরিফাইড করা হবে।`,
                                  confirmLabel: "✓ ভেরিফাই করুন",
                                  confirmStyle: "success",
                                  onConfirm: () => verifyMutation.mutate({ id: user._id, isVerified: 'verified' }),
                                })}
                                className="text-[9px] text-emerald-600 hover:underline font-bold cursor-pointer"
                              >
                                ⚡ সরাসরি ভেরিফাই করুন
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold">-</span>
                      )}
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
                          onClick={() => openModal({
                            title: "ইউজার আনব্লক করুন",
                            message: `আপনি কি "${user.fullName}" এর অ্যাকাউন্টটি আনব্লক করতে চান? তিনি পুনরায় লগইন করতে পারবেন।`,
                            confirmLabel: "✓ আনব্লক করুন",
                            confirmStyle: "success",
                            onConfirm: () => statusMutation.mutate({ id: user._id, status: 'active' }),
                          })}
                          disabled={statusMutation.isPending}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Unblock
                        </button>
                      ) : (
                        <button
                          onClick={() => openModal({
                            title: "ইউজার ব্লক করুন",
                            message: `আপনি কি "${user.fullName}" এর অ্যাকাউন্টটি ব্লক করতে চান? ব্লক করলে তিনি লগইন করতে পারবেন না।`,
                            confirmLabel: "🚫 ব্লক করুন",
                            confirmStyle: "danger",
                            onConfirm: () => statusMutation.mutate({ id: user._id, status: 'blocked' }),
                          })}
                          disabled={statusMutation.isPending}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </tr>
                  {activeDetailsUserId === user._id && user.verificationDetails && (
                    <tr className="bg-amber-50/10 dark:bg-amber-950/5 border-b border-slate-100 dark:border-slate-800/50">
                      <td colSpan={6} className="p-5">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/30 space-y-4 max-w-2xl shadow-sm">
                          <h4 className="text-xs font-black text-amber-700 dark:text-amber-550 uppercase tracking-widest flex items-center gap-1.5">
                            🛡️ ভেরিফিকেশন আবেদনপত্র
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                            <div>
                              <p className="text-slate-400 uppercase text-[9px] tracking-wider">এনআইডি (NID) নম্বর</p>
                              <p className="text-slate-800 dark:text-slate-200 mt-0.5 text-sm font-black tracking-widest">{user.verificationDetails.nidNumber}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 uppercase text-[9px] tracking-wider">হোল্ডিং নম্বর / ট্যাক্স আইডি</p>
                              <p className="text-slate-800 dark:text-slate-200 mt-0.5 text-sm font-black">{user.verificationDetails.holdingNumber}</p>
                            </div>
                          </div>
                          {user.verificationDetails.message && (
                            <div className="text-xs font-bold">
                              <p className="text-slate-400 uppercase text-[9px] tracking-wider">আবেদনকারীর বার্তা</p>
                              <p className="text-slate-700 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-850 leading-relaxed font-semibold">{user.verificationDetails.message}</p>
                            </div>
                          )}
                          <div className="flex gap-3 pt-2">
                            <button
                              onClick={() => openModal({
                                title: "ভেরিফিকেশন অনুমোদন করুন",
                                message: `আপনি কি "${user.fullName}" এর ভেরিফিকেশন আবেদনটি অনুমোদন করতে চান? অনুমোদনের পর তিনি মার্কেটপ্লেসে ভেরিফাইড ব্যাজ পাবেন।`,
                                confirmLabel: "✓ অনুমোদন করুন",
                                confirmStyle: "success",
                                onConfirm: () => verifyMutation.mutate({ id: user._id, isVerified: 'verified' }),
                              })}
                              disabled={verifyMutation.isPending}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            >
                              {verifyMutation.isPending ? "যাচাই হচ্ছে..." : "অনুমোদন করুন ✓"}
                            </button>
                            <button
                              onClick={() => openModal({
                                title: "ভেরিফিকেশন প্রত্যাখ্যান করুন",
                                message: `আপনি কি "${user.fullName}" এর ভেরিফিকেশন আবেদনটি প্রত্যাখ্যান করতে চান? প্রত্যাখ্যানের পর তিনি পুনরায় আবেদন করতে পারবেন।`,
                                confirmLabel: "✕ প্রত্যাখ্যান করুন",
                                confirmStyle: "danger",
                                onConfirm: () => verifyMutation.mutate({ id: user._id, isVerified: 'unverified' }),
                              })}
                              disabled={verifyMutation.isPending}
                              className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-450 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              প্রত্যাখ্যান করুন ✕
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {(!data?.users || data.users.length === 0) && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">
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
