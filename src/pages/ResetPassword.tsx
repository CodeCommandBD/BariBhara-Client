import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("সঠিক ৬-ডিজিটের ওটিপি দিন");
    
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/auth/reset-password", {
        email,
        otp,
        newPassword
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "পাসওয়ার্ড রিসেট করতে সমস্যা হয়েছে!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-4">ভুল রিকোয়েস্ট! আবার ইমেইল দিন।</p>
          <Link to="/forgot-password" title="আবার চেষ্টা করুন" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">refresh</span>
            আবার চেষ্টা করুন
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-2xl shadow-primary/5 border border-outline/10">
        <div className="text-center space-y-3 mb-10">
          <h1 className="font-headline text-3xl font-bold text-on-surface">নতুন পাসওয়ার্ড সেট করুন</h1>
          <p className="text-on-surface-variant font-medium">আপনার ইমেইলে পাঠানো ওটিপি এবং নতুন পাসওয়ার্ড দিন।</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant ml-1 italic">ওটিপি কোড (OTP)</label>
            <input
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-4 bg-surface rounded-2xl border border-outline/10 focus:ring-4 focus:ring-primary/10 transition-all outline-none text-center text-2xl font-black tracking-[0.5em]"
              placeholder="000000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant ml-1 italic">নতুন পাসওয়ার্ড</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
              <input
                required
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-surface rounded-2xl border border-outline/10 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant"
              >
                <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 italic leading-tight">কমপক্ষে ৮ ক্যারেক্টার, ১টি বড় হাত, ১টি ছোট হাত এবং ১টি সংখ্যা থাকতে হবে।</p>
          </div>

          <button
            disabled={isLoading}
            className="w-full py-5 bg-primary text-on-primary rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড সেভ করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
