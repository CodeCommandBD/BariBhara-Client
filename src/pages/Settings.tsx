import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  User, Camera, Lock, Moon, Sun, Save, Eye, EyeOff,
  Shield, Phone, Mail, FileText, CheckCircle2, ShieldAlert, ShieldOff, ShieldCheck,
  MessageSquare, QrCode, LogOut as LogOutIcon, RefreshCw, PenTool
} from "lucide-react";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:4000/api/profile";

const Settings = () => {
  const { user, token, setAuth } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  // লোকাল প্রিভিউ — আপলোড হওয়ার আগেই দেখানোর জন্য
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  // ইউজার প্রোফাইল লোড করা
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/me`, { headers: authHeader });
      return res.data.user;
    },
    enabled: !!token,
  });

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    bio: "",
    agreementTemplate: "",
  });

  // পাসওয়ার্ড ফর্ম স্টেট
  const [passForm, setPassForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // ২FA স্টেট
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [pending2FAState, setPending2FAState] = useState<boolean | null>(null);

  // 2FA Toggle Mutation
  const toggle2FAMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await axios.patch(`http://localhost:4000/api/2fa/toggle`, { enabled }, { headers: authHeader });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      setOtpModalOpen(false);
      setOtpValue("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "2FA টগল ব্যর্থ!"),
  });

  const sendOtpMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post(`http://localhost:4000/api/2fa/send-otp`, { email: profileData?.email || user?.email }, { headers: authHeader });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setOtpModalOpen(true);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "OTP পাঠাতে সমস্যা হয়েছে!"),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otp: string) => {
      const res = await axios.post(`http://localhost:4000/api/2fa/verify-otp`, { otp }, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      if (pending2FAState !== null) {
        toggle2FAMutation.mutate(pending2FAState);
      }
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "OTP সঠিক নয়!"),
  });

  const handle2FAToggleClick = (currentEnabled: boolean) => {
    setPending2FAState(!currentEnabled);
    sendOtpMutation.mutate();
  };

  // প্রোফাইল আপডেট
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.patch(`${BASE_URL}/update`, data, { headers: authHeader });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("প্রোফাইল আপডেট হয়েছে!");
      if (data.user && token) {
        setAuth({ ...user!, fullName: data.user.fullName, phone: data.user.phone }, token);
      }
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "আপডেট ব্যর্থ হয়েছে!"),
  });

  // ছবি আপলোড
  const photoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await axios.patch(`${BASE_URL}/photo`, formData, {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("প্রোফাইল ছবি আপডেট হয়েছে!");
      // React Query cache invalidate করা — পেজ রিফ্রেশ ছাড়াই নতুন ছবি লোড হবে
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      // লোকাল প্রিভিউ সরিয়ে দেওয়া (এখন সার্ভারের ছবি দেখাবে)
      setLocalPhotoPreview(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "ছবি আপলোড ব্যর্থ!");
      setLocalPhotoPreview(null);
    },
  });

  // পাসওয়ার্ড পরিবর্তন
  const changePassMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.patch(`${BASE_URL}/password`, data, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      toast.success("পাসওয়ার্ড পরিবর্তন হয়েছে!");
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ!"),
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error("নতুন পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }
    changePassMutation.mutate({
      currentPassword: passForm.currentPassword,
      newPassword: passForm.newPassword,
    });
  };

  // WhatsApp স্টেট
  const [waStatus, setWaStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [waQr, setWaQr] = useState<string | null>(null);

  // WhatsApp Status Load
  useQuery({
    queryKey: ["whatsapp-status"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/api/whatsapp/status", { headers: authHeader });
      setWaStatus(res.data.status);
      setWaQr(res.data.qr);
      return res.data;
    },
    enabled: !!token,
  });

  // Sync profileForm with profileData
  useEffect(() => {
    if (profileData) {
      setProfileForm({
        fullName: profileData.fullName || "",
        phone: profileData.phone || "",
        bio: profileData.bio || "",
        agreementTemplate: profileData.agreementTemplate || `১. ভাড়াটিয়া প্রতি মাসের ৫ তারিখের মধ্যে ভাড়া পরিশোধ করিতে বাধ্য থাকিবেন।
২. প্রপার্টির কোনো ক্ষতি হইলে ভাড়াটিয়া তাহা মেরামত করিয়া দিতে বাধ্য থাকিবেন।
৩. অগ্রিম বাবদ জমাকৃত টাকা চুক্তি শেষে সমন্বয় করা হইবে।
৪. বাসা ছাড়ার ১ মাস পূর্বে নোটিশ প্রদান করিতে হইবে।`,
      });
    }
  }, [profileData]);

  // Socket Listeners for WhatsApp
  useEffect(() => {
    if (!token) return;
    const socket = io("http://localhost:4000");

    socket.on("whatsapp_qr", (data) => {
      setWaQr(data.qr);
      setWaStatus("connecting");
    });

    socket.on("whatsapp_status", (data) => {
      setWaStatus(data.status);
      if (data.status === "connected") setWaQr(null);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const logoutWhatsAppMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("http://localhost:4000/api/whatsapp/logout", {}, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      setWaStatus("disconnected");
      setWaQr(null);
      toast.success("WhatsApp ডিসকানেক্ট হয়েছে!");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "ডিসকানেক্ট ব্যর্থ!"),
  });

  // Avatar initials
  const initials = (profileData?.fullName || user?.fullName || "B")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* হেডার */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <User className="text-primary" size={26} /> প্রোফাইল ও সেটিংস
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">আপনার অ্যাকাউন্টের তথ্য ব্যবস্থাপনা করুন</p>
      </div>

      {/* প্রোফাইল ছবি সেকশন */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary/30 overflow-hidden">
              {/* লোকাল প্রিভিউ > সার্ভারের ছবি > Initials */}
              {localPhotoPreview ? (
                <img src={localPhotoPreview} alt="preview" className="w-full h-full object-cover" />
              ) : profileData?.photo ? (
                <img src={profileData.photo} alt="profile" className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={photoMutation.isPending}
              className="absolute -bottom-2 -right-2 w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all"
            >
              {photoMutation.isPending
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Camera size={16} />
              }
            </button>
            <input
              ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                // অপটিমিস্টিক লোকাল প্রিভিউ — আপলোড শেষ হওয়ার আগেই দেখাবে
                const localUrl = URL.createObjectURL(file);
                setLocalPhotoPreview(localUrl);
                photoMutation.mutate(file);
              }}
            />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">{profileData?.fullName || user?.fullName}</h2>
            <p className="text-slate-400 text-sm">{profileData?.email || user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full capitalize">
              {profileData?.role || user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* প্রোফাইল তথ্য সম্পাদনা */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <FileText size={20} className="text-primary" /> ব্যক্তিগত তথ্য
        </h3>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">পূর্ণ নাম</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase ml-1">ফোন নম্বর</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">ইমেইল (শুধু দেখার জন্য)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input value={profileData?.email || user?.email} readOnly
                className="w-full pl-10 pr-3 py-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-sm font-bold outline-none text-slate-400 cursor-not-allowed" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">বায়ো</label>
            <textarea
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              rows={3} placeholder="আপনার সম্পর্কে সংক্ষিপ্ত পরিচয়..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200 resize-none"
            />
          </div>
          <button type="submit" disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50">
            {updateProfileMutation.isPending
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save size={17} />}
            পরিবর্তন সেভ করুন
          </button>
        </form>
      </div>

      {/* পাসওয়ার্ড পরিবর্তন */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <Lock size={20} className="text-primary" /> পাসওয়ার্ড পরিবর্তন
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => {
            const labels: Record<string, string> = {
              currentPassword: "বর্তমান পাসওয়ার্ড",
              newPassword: "নতুন পাসওয়ার্ড",
              confirmPassword: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
            };
            const visible = showPass[field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm"];
            const toggleKey = field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm";
            return (
              <div key={field} className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">{labels[field]}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type={visible ? "text" : "password"}
                    value={passForm[field]}
                    required
                    onChange={(e) => setPassForm({ ...passForm, [field]: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-700 rounded-xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200"
                  />
                  <button type="button" onClick={() => setShowPass({ ...showPass, [toggleKey]: !visible })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {visible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            );
          })}
          <button type="submit" disabled={changePassMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:scale-105 transition-all disabled:opacity-50">
            {changePassMutation.isPending
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Shield size={17} />}
            পাসওয়ার্ড পরিবর্তন করুন
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <ShieldAlert size={20} className="text-primary" /> ২-ধাপ যাচাইকরণ (2FA)
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${profileData?.twoFactorEnabled ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-400"}`}>
              {profileData?.twoFactorEnabled ? <ShieldCheck size={20} /> : <ShieldOff size={20} />}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">2FA স্ট্যাটাস: {profileData?.twoFactorEnabled ? "সক্রিয়" : "নিষ্ক্রিয়"}</p>
              <p className="text-xs text-slate-400 mt-0.5">লগইনের সময় ইমেইলে ওটিপি পাঠানো হবে।</p>
            </div>
          </div>
          <button
            onClick={() => handle2FAToggleClick(!!profileData?.twoFactorEnabled)}
            disabled={sendOtpMutation.isPending}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${profileData?.twoFactorEnabled ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40" : "bg-primary text-white hover:bg-primary/90"}`}
          >
            {sendOtpMutation.isPending ? "অপেক্ষা করুন..." : profileData?.twoFactorEnabled ? "নিষ্ক্রিয় করুন" : "সক্রিয় করুন"}
          </button>
        </div>

        {/* OTP Input UI (Inline Modal) */}
        {otpModalOpen && (
          <div className="mt-4 p-5 bg-primary/5 border border-primary/20 rounded-2xl animate-in slide-in-from-top-4">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">ইমেইলে পাঠানো ৬-ডিজিটের কোডটি লিখুন:</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-center tracking-[10px] font-black text-xl outline-none focus:border-primary/50 text-slate-800 dark:text-slate-100"
              />
              <button
                onClick={() => verifyOtpMutation.mutate(otpValue)}
                disabled={otpValue.length !== 6 || verifyOtpMutation.isPending || toggle2FAMutation.isPending}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 disabled:opacity-50 transition-colors h-[54px]"
              >
                {verifyOtpMutation.isPending || toggle2FAMutation.isPending ? "যাচাই হচ্ছে..." : "যাচাই করুন"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Integration */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" /> WhatsApp ইন্টিগ্রেশন
        </h3>
        
        <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-slate-50 dark:bg-slate-700/50 rounded-3xl border border-slate-100 dark:border-slate-700">
          {/* QR Code / Status Icon */}
          <div className="relative">
            <div className="w-48 h-48 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden">
              {waStatus === "connected" ? (
                <div className="flex flex-col items-center gap-3 text-emerald-500">
                  <CheckCircle2 size={64} strokeWidth={1.5} />
                  <span className="font-black text-sm uppercase tracking-widest">Connected</span>
                </div>
              ) : waQr ? (
                <img src={waQr} alt="WhatsApp QR" className="w-full h-full object-contain p-2" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <QrCode size={64} strokeWidth={1.5} />
                  <span className="font-black text-xs uppercase tracking-widest">Generating QR...</span>
                </div>
              )}
            </div>
          </div>

          {/* Info & Controls */}
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                WhatsApp Bot 
                <span className={`w-3 h-3 rounded-full animate-pulse ${waStatus === "connected" ? "bg-emerald-500" : "bg-amber-500"}`} />
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                আপনার WhatsApp লিংক করুন স্বয়ংক্রিয় মেসেজ পাঠানোর জন্য।
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className={waStatus === "connected" ? "text-emerald-500" : "text-slate-300"} />
                <span className={waStatus === "connected" ? "text-slate-700 dark:text-slate-200 font-bold" : "text-slate-400"}>অটোমেটিক ইনভয়েস মেসেজ</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className={waStatus === "connected" ? "text-emerald-500" : "text-slate-300"} />
                <span className={waStatus === "connected" ? "text-slate-700 dark:text-slate-200 font-bold" : "text-slate-400"}>পেমেন্ট কনফার্মেশন অ্যালার্ট</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {waStatus === "connected" ? (
                <button 
                  onClick={() => logoutWhatsAppMutation.mutate()}
                  disabled={logoutWhatsAppMutation.isPending}
                  className="px-6 py-3 bg-red-50 text-red-600 font-black rounded-2xl border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <LogOutIcon size={18} />
                  ডিসকানেক্ট করুন
                </button>
              ) : (
                <button 
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["whatsapp-status"] })}
                  className="px-6 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  QR রিফ্রেশ করুন
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* চুক্তিপত্রের শর্তাবলী (Agreement Template) */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <PenTool size={20} className="text-primary" /> ডিজিটাল চুক্তিপত্র টেমপ্লেট
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
            <p className="text-xs text-amber-700 dark:text-amber-400 font-bold leading-relaxed">
              * এখানে আপনার চুক্তির প্রধান শর্তগুলো লিখুন। নতুন কোনো ভাড়াটিয়ার জন্য চুক্তিপত্র জেনারেট করার সময় এই শর্তগুলোই ব্যবহৃত হবে। প্রতি লাইনের জন্য আলাদা নম্বর ব্যবহার করুন।
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">চুক্তির শর্তাবলী (Terms & Conditions)</label>
            <textarea
              value={profileForm.agreementTemplate}
              onChange={(e) => setProfileForm({ ...profileForm, agreementTemplate: e.target.value })}
              rows={8}
              placeholder="১. ভাড়াটিয়া প্রতি মাসের ৫ তারিখের মধ্যে ভাড়া পরিশোধ করিবেন..."
              className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-700 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-primary/30 dark:text-slate-200 resize-none leading-relaxed"
            />
          </div>
          <button 
            onClick={handleProfileSubmit}
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? <RefreshCw size={17} className="animate-spin" /> : <Save size={17} />}
            টেমপ্লেট সেভ করুন
          </button>
        </div>
      </div>

      {/* Dark Mode & Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
          <Sun size={20} className="text-primary" /> অ্যাপিয়ারেন্স
        </h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white dark:bg-slate-600 rounded-xl flex items-center justify-center shadow-sm">
              {isDark ? <Moon className="text-primary" size={20} /> : <Sun className="text-amber-500" size={20} />}
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{isDark ? "ডার্ক মোড" : "লাইট মোড"}</p>
              <p className="text-xs text-slate-400">থিম পরিবর্তন করুন</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1"
            style={{ background: isDark ? "#702ae1" : "#e2e8f0" }}
          >
            <span
              className="w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
              style={{ transform: isDark ? "translateX(28px)" : "translateX(0)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
