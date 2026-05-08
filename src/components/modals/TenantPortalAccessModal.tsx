import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { X, Key, ShieldCheck, ShieldOff } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tenant: any;
}

const TenantPortalAccessModal = ({ isOpen, onClose, tenant }: Props) => {
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore() as any;

  useEffect(() => {
    if (tenant) {
      setEnabled(tenant.portalEnabled || false);
      setPassword("");
    }
  }, [tenant, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authHeader = {
        Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
      };

      const res = await axios.patch(
        `http://localhost:4000/api/tenant-portal/access/${tenant._id}`,
        { enabled, password: password || undefined },
        { headers: authHeader }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        queryClient.invalidateQueries({ queryKey: ["tenants"] });
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "অ্যাক্সেস পরিবর্তন করা যায়নি!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative border border-slate-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100">পোর্টাল অ্যাক্সেস</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-bold text-primary">
              {tenant.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100">{tenant.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{tenant.phone}</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  {enabled ? <ShieldCheck size={18} className="text-emerald-500" /> : <ShieldOff size={18} className="text-red-500" />}
                  পোর্টাল এনাবল করুন
                </p>
                <p className="text-xs text-slate-500 mt-1">ভাড়াটিয়া পোর্টালে লগইন করতে পারবে</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {enabled && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 opacity-100 duration-300">
              <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase ml-1">
                পাসওয়ার্ড সেট করুন (ঐচ্ছিক)
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড (যদি পরিবর্তন করতে চান)"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/30 transition-all dark:text-white"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold ml-1">
                পাসওয়ার্ড না দিলে আগের পাসওয়ার্ড কাজ করবে। প্রথমবার এনাবল করলে পাসওয়ার্ড দিতে হবে।
              </p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "সেভ করুন"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantPortalAccessModal;
