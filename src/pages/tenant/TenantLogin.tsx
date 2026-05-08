import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Phone, KeyRound, Building2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useTenantAuthStore } from "../../store/useTenantAuthStore";
import { useThemeStore } from "../../store/useThemeStore";

const TenantLogin = () => {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useTenantAuthStore();
  const { isDark } = useThemeStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/tenant-portal/login", formData);
      if (res.data.success) {
        login(res.data.tenant, res.data.token);
        toast.success(res.data.message);
        navigate("/tenant/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-8 border border-slate-100 dark:border-slate-800">
        
        {/* Logo/Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Building2 size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Bariowla</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">ভাড়াটিয়া পোর্টাল</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase ml-1">ফোন বা ইমেইল</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="আপনার ফোন নম্বর বা ইমেইল"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/30 transition-all dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase ml-1">পাসওয়ার্ড</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="আপনার পাসওয়ার্ড"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/30 transition-all dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn size={20} /> পোর্টালে প্রবেশ করুন
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
           <p className="text-xs text-slate-400 font-bold">লগইন করতে সমস্যা হলে আপনার মালিকের সাথে যোগাযোগ করুন।</p>
        </div>
      </div>
    </div>
  );
};

export default TenantLogin;
