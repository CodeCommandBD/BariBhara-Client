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

  // Landlord Auth
  const { loginUser, isLoading: isLandlordLoading, error } = useAuth();
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

  // Submit Handlers
  const onLandlordSubmit = (data: LoginFormData) => {
    loginUser(data);
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
              <>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-surface-container-high"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-on-surface-variant font-medium">
                      অথবা সোশ্যাল মিডিয়া ব্যবহার করুন
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-low rounded-xl font-semibold hover:bg-surface-container-high transition-colors active:scale-95">
                    <img
                      alt="Google Logo"
                      className="w-6 h-6"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDL7cI2ExAGoA7ZxsfnIpuFzEVQxDbqZK3U-QTo2F5r3p_INaIgWsV3FyJSXKaNwLQgLw7NwwIypm8UhUWlZltqkdwzozuGOEiDvCJt8RLBll2KLeGMnOJwulz8rPJmOhLVuy8JNepTzAFpsSgqxA33c89tLclUhhz7Uef6zTiDNP17yuFtc3_pP11bs9tp_5Z2HBw_raCRqgUknESUScVjNDyNkY0tlVz9L_sqcjnw-ZaFRen2fKhQDJlEsiq-1mEP3UbwRAIITCF"
                    />
                    <span className="font-headline">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 py-4 bg-surface-container-low rounded-xl font-semibold hover:bg-surface-container-high transition-colors active:scale-95">
                    <img
                      alt="Facebook Logo"
                      className="w-6 h-6"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG0rcoCIfmV0Mjv54TVLxqh6jGerOp_3yQ7wFcBFbYZarqIVwZOwj93RGfrZ0b8R16TwPjnf_MaVfFOFA4sDNLGcfk4p31Jrc6j9wwjAtrgct7q9MNbJl87DSmYmzWRnsOy10tLMAt39k3vHdGzSHruPCokDkEr4R0_Q4we7SasEzBPQovpx0riKOIMq9al4yoxSk9B7DgZre_-ojXhzXJHGVLdTWgdt_2FRaXxRaNrHJ-DFoYvpHwfCB10g49mQz84Qo-7rf4ueCv"
                    />
                    <span className="font-headline">Facebook</span>
                  </button>
                </div>
              </>
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
