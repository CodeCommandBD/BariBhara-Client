import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/auth/forgot-password", { email });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/reset-password", { state: { email } });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "ওটিপি পাঠাতে সমস্যা হয়েছে!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-2xl shadow-primary/5 border border-outline/10">
        <div className="text-center space-y-3 mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl">lock_reset</span>
          </div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">পাসওয়ার্ড ভুলে গেছেন?</h1>
          <p className="text-on-surface-variant font-medium">আপনার ইমেইল দিন, আমরা একটি ৬-ডিজিটের ওটিপি পাঠাবো।</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant ml-1 italic">ইমেইল ঠিকানা</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface rounded-2xl border border-outline/10 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            className="w-full py-5 bg-primary text-on-primary rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? "ওটিপি পাঠানো হচ্ছে..." : "ওটিপি পাঠান"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
