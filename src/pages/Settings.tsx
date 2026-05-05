import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  User, Camera, Lock, Moon, Sun, Save, Eye, EyeOff,
  Shield, Phone, Mail, FileText, CheckCircle2
} from "lucide-react";

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

  // প্রোফাইল ফর্ম স্টেট
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    bio: "",
  });

  // পাসওয়ার্ড ফর্ম স্টেট
  const [passForm, setPassForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

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
