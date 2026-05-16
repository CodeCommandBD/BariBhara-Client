import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/Hook/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas/authSchema";
import axios from "axios";
import { toast } from "sonner";
import { useTenantAuthStore } from "@/store/useTenantAuthStore";

const Login = () => {
  const [role, setRole] = useState<"landlord" | "tenant">("landlord");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [show2FA, setShow2FA] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [userId, setUserId] = useState("");

  // Landlord Auth
  const { loginUserAsync, isLoading: isLandlordLoading, error } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  // Tenant Auth
  const { login: tenantLoginStore } = useTenantAuthStore();
  const [tenantFormData, setTenantFormData] = useState({
    identifier: "",
    password: "",
  });
  const [isTenantLoading, setIsTenantLoading] = useState(false);

  // Device ID জেনারেট বা রিট্রিভ করা (2FA বাইপাস করার জন্য)
  const getDeviceId = () => {
    let id = localStorage.getItem("unique_device_id");
    if (!id) {
      id = "dev_" + Math.random().toString(36).substring(2, 15) + Date.now();
      localStorage.setItem("unique_device_id", id);
    }
    return id;
  };

  // Submit Handlers
  const onLandlordSubmit = async (data: LoginFormData) => {
    try {
      const res = await loginUserAsync({ ...data, deviceId: getDeviceId() });
      if (res.requires2FA) {
        setShow2FA(true);
        setUserId(res.userId);
        toast.info(res.message);
        await axios.post("http://localhost:4000/api/2fa/send-login-otp", { email: res.email });
      }
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/2fa/verify-login-otp", { 
        userId, 
        otp: otpValue,
        deviceId: getDeviceId() // ভেরিফিকেশনের সময় ডিভাইসটিকে ট্রাস্টেড মার্ক করা
      });
      if (res.data.success) {
        const { useAuthStore } = await import("@/store/useAuthStore");
        useAuthStore.getState().setAuth(res.data.user, res.data.token);
        toast.success(res.data.message || "লগইন সফল হয়েছে!");
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "OTP যাচাই ব্যর্থ!");
    }
  };

  const onTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTenantLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/tenant-portal/login",
        tenantFormData,
      );
      if (res.data.success) {
        tenantLoginStore(res.data.tenant, res.data.token);
        toast.success(res.data.message);
        navigate("/tenant/dashboard");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "লগইন ব্যর্থ হয়েছে!");
    } finally {
      setIsTenantLoading(false);
    }
  };
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex h-screen overflow-hidden">
        {/* Left Side: Visual/Branding (Sync with Register) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 z-0 select-none">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img
              className="w-full h-full object-cover"
              alt="Modern luxury apartment"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX8DO4CmKUl6knEnt0Yq_uvZVNqOR9hnE6tQCYNuT389zdcApGExYw430J3mPAJp0GMQgaBqK1piURZLWYK-dqjoDijoLxZDIwbccmsS4_eYiDAezHlzZLXHSBZcP5Sg-idRvYurADeTe0Gs6A3Cf6XU-oIp-7hvMOdzZm7extxAJSaqZJIWnOJNmk2gTGQFaIjbQivA2IP4ZHvE9j4GOzOdse0CC63qn4zVNIcgVpEsbQqIaWnEoM6O1OZ0YHFqynNldCzY7Y4M8p"
            />
          </div>
          {/* Glass Overlay Content */}
          <div className="relative z-20 max-w-lg space-y-8 p-12 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <h1 className="font-headline text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md text-center">
              আবারও স্বাগতম <br />
              <span className="text-primary-fixed drop-shadow-sm italic">
                Bari Bhara-এ
              </span>
            </h1>
            <p className="text-white text-lg leading-relaxed font-medium drop-shadow-sm text-center">
              আপনার সঠিক ঠিকানা খুঁজে পেতে এবং পরিচালনা করতে লগইন করুন।
              বাংলাদেশের সবচেয়ে নিরাপদ রেন্টাল কমিউনিটিতে প্রবেশ করুন।
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-white drop-shadow-sm">
                <span className="material-symbols-outlined bg-primary/40 p-2 rounded-full">
                  key
                </span>
                <span className="font-semibold font-headline">
                  নিরাপদ এবং এনক্রিপ্টেড লগইন
                </span>
              </div>
              <div className="flex items-center gap-4 text-white drop-shadow-sm">
                <span className="material-symbols-outlined bg-primary/40 p-2 rounded-full">
                  bolt
                </span>
                <span className="font-semibold font-headline">
                  দ্রুত এবং নিরবিচ্ছিন্ন এক্সেস
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 bg-surface-container-high flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-md space-y-10">
            <div className="space-y-3">
              <h2 className="font-headline text-4xl font-bold text-on-surface">
                লগইন করুন
              </h2>
              <p className="text-on-surface-variant font-medium">
                আপনার সঠিক তথ্য দিয়ে পোর্টালে প্রবেশ করুন।
              </p>
            </div>

            {/* Role Switcher */}
            <div className="p-1.5 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex border border-gray-300/50 shadow-inner overflow-hidden">
              <button
                type="button"
                onClick={() => setRole("landlord")}
                className={`flex-1 py-3.5 text-center rounded-xl font-bold transition-all duration-300 ${
                  role === "landlord"
                    ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                বাড়িওয়ালা (Landlord)
              </button>
              <button
                type="button"
                onClick={() => setRole("tenant")}
                className={`flex-1 py-3.5 text-center rounded-xl font-bold transition-all duration-300 ${
                  role === "tenant"
                    ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                ভাড়াটিয়া (Tenant)
              </button>
            </div>

            {role === "landlord" ? (
              show2FA ? (
                <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-3">
                    <p className="text-on-surface-variant font-medium text-sm mb-4">
                      আপনার ইমেইলে একটি ৬-ডিজিটের কোড পাঠানো হয়েছে। কোডটি নিচে লিখুন:
                    </p>
                    <div className="flex gap-2 justify-center">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center px-4 py-4 rounded-2xl bg-surface border border-outline focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-300 text-on-surface text-3xl font-black tracking-[1em]"
                        placeholder="000000"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={otpValue.length !== 6}
                    className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    যাচাই করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShow2FA(false)}
                    className="w-full py-2 text-primary font-bold text-sm hover:underline flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    আবার চেষ্টা করুন
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleSubmit(onLandlordSubmit)}
                  className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                <div className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                      {error.message}
                    </div>
                  )}
                  <div className="group">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">
                      ইমেইল
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                        mail
                      </span>
                      <input
                        {...register("email")}
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm"
                        placeholder="example@mail.com"
                        type="email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="group">
                    <div className="flex justify-between items-center mb-2 px-1">
                      <label className="text-sm font-semibold text-on-surface-variant italic">
                        পাসওয়ার্ড
                      </label>
                      <Link
                        className="text-xs font-bold text-primary hover:underline"
                        to="/forgot-password"
                      >
                        পাসওয়ার্ড ভুলে গেছেন?
                      </Link>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                        lock
                      </span>
                      <input
                        {...register("password")}
                        className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant cursor-pointer"
                      >
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded-sm border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-on-surface-variant select-none cursor-pointer"
                  >
                    আমাকে মনে রাখুন
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLandlordLoading}
                  className="w-full py-5 btn-brand rounded-xl font-bold text-lg"
                >
                  {isLandlordLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </button>
              </form>
              )
            ) : (
              <form
                onSubmit={onTenantSubmit}
                className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="space-y-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">
                      ফোন নম্বর বা ইমেইল
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                        phone_iphone
                      </span>
                      <input
                        required
                        value={tenantFormData.identifier}
                        onChange={(e) =>
                          setTenantFormData({
                            ...tenantFormData,
                            identifier: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm"
                        placeholder="01XXXXXXXXX বা ইমেইল"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-on-surface-variant mb-2 ml-1 italic">
                      পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                        lock
                      </span>
                      <input
                        required
                        value={tenantFormData.password}
                        onChange={(e) =>
                          setTenantFormData({
                            ...tenantFormData,
                            password: e.target.value,
                          })
                        }
                        className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border border-outline/10 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/50 font-body shadow-sm"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant cursor-pointer"
                      >
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isTenantLoading}
                  className="w-full py-5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-lg transition-all"
                >
                  {isTenantLoading
                    ? "লগইন হচ্ছে..."
                    : "ভাড়াটিয়া হিসেবে লগইন করুন"}
                </button>
                <p className="text-center text-xs text-gray-500 font-bold mt-4">
                  লগইন করতে সমস্যা হলে আপনার মালিকের সাথে যোগাযোগ করুন।
                </p>
              </form>
            )}

            {role === "landlord" && (
              <div className="flex flex-col items-center gap-4 mt-8">
                <p className="text-center text-on-surface-variant font-headline">
                  অ্যাকাউন্ট নেই?{" "}
                  <Link
                    className="text-primary font-bold hover:underline"
                    to="/register"
                  >
                    নতুন অ্যাকাউন্ট খুলুন
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
