import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Camera, User, Phone, Mail, Home, Building2, Calendar, Key, Save, Loader2, Shield, IdCard, CheckCircle, AlertCircle, Clock, Upload } from "lucide-react";
import { useTenantAuthStore } from "../../store/useTenantAuthStore";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/tenant-portal`;

const TenantProfile = () => {
  const { token, tenant, login } = useTenantAuthStore() as any;
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nidInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [uploading, setUploading] = useState(false);
  const [nidUploading, setNidUploading] = useState(false);

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  // প্রোফাইল ডাটা লোড করা
  const { data, isLoading } = useQuery({
    queryKey: ["tenant-profile"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/profile`, { headers: authHeader });
      return res.data.tenant;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({ name: data.name || "", email: data.email || "" });
    }
  }, [data]);

  // প্রোফাইল আপডেট মিউটেশন
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.patch(`${API_URL}/profile`, payload, { headers: authHeader });
      return res.data;
    },
    onSuccess: (data: any) => {
      toast.success("প্রোফাইল আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenant-profile"] });
      // Tenant store আপডেট করা
      if (tenant) login({ ...tenant, ...data.tenant }, token);
      setEditMode(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "আপডেট ব্যর্থ হয়েছে!");
    },
  });

  // পাসওয়ার্ড পরিবর্তন মিউটেশন
  const pwMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await axios.patch(`${API_URL}/change-password`, payload, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ!");
    },
  });

  // NID আপলোড মিউটেশন
  const nidMutation = useMutation({
    mutationFn: async (payload: { nidBase64: string }) => {
      const res = await axios.post(`${API_URL}/nid/upload`, payload, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      toast.success("NID সফলভাবে আপলোড হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenant-profile"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "NID আপলোড ব্যর্থ হয়েছে!");
    },
  });

  // ছবি আপলোড (Cloudinary via base64)
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("ছবির সাইজ ৩ MB-এর বেশি হওয়া যাবে না!");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await updateMutation.mutateAsync({ photoBase64: reader.result as string });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // NID আপলোড (Cloudinary via base64)
  const handleNidChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ফাইলের সাইজ ৫ MB-এর বেশি হওয়া যাবে না!");
      return;
    }

    setNidUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await nidMutation.mutateAsync({ nidBase64: reader.result as string });
      } finally {
        setNidUploading(false);
        if (nidInputRef.current) nidInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim()) return toast.error("নাম খালি রাখা যাবে না!");
    updateMutation.mutate({ name: form.name, email: form.email });
  };

  const handlePasswordChange = () => {
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      return toast.error("সব ফিল্ড পূরণ করুন!");
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error("নতুন পাসওয়ার্ড দুটি মিলছে না!");
    }
    if (pwForm.newPassword.length < 6) {
      return toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!");
    }
    pwMutation.mutate({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="font-bold">প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  const profile = data;
  const initials = profile?.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) || "T";

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-on-surface">আমার প্রোফাইল</h1>
        <p className="text-sm text-on-surface-variant mt-1">আপনার ব্যক্তিগত তথ্য এবং সেটিংস পরিচালনা করুন</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        {/* Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-primary/80 via-violet-500/70 to-purple-500/60 relative" />

        <div className="px-6 pb-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 mb-6">
            <div className="relative w-24 h-24 rounded-3xl border-4 border-white dark:border-slate-800 bg-surface-container overflow-hidden shadow-xl shrink-0">
              {uploading ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                  <Loader2 size={24} className="animate-spin text-primary" />
                </div>
              ) : profile?.photo ? (
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-black">
                  {initials}
                </div>
              )}
              {/* Photo Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all"
                title="ছবি পরিবর্তন"
              >
                <Camera size={14} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
            <div className="mt-2 sm:mb-2">
              <h2 className="text-xl font-black text-on-surface">{profile?.name}</h2>
              <p className="text-sm text-on-surface-variant">{profile?.phone}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black px-3 py-1 rounded-full">
                  <Shield size={11} /> সক্রিয় ভাড়াটিয়া
                </span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: Building2, label: "প্রপার্টি", value: (profile?.property as any)?.name || "N/A" },
              { icon: Home, label: "ইউনিট", value: (profile?.unit as any)?.unitName || "N/A" },
              { icon: Calendar, label: "লিজ শুরু", value: profile?.leaseStart ? new Date(profile.leaseStart).toLocaleDateString("bn-BD") : "N/A" },
              { icon: Calendar, label: "লিজ শেষ", value: profile?.leaseEnd ? new Date(profile.leaseEnd).toLocaleDateString("bn-BD") : "N/A" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant">{label}</p>
                  <p className="text-sm font-black text-on-surface">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-on-surface-variant mb-1.5 block">নাম *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 text-on-surface text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-on-surface-variant mb-1.5 block">ইমেইল</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 text-on-surface text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={updateMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                >
                  {updateMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  সেভ করুন
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 text-on-surface-variant font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  বাতিল
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="text-sm text-on-surface font-bold">{profile?.email || "ইমেইল যোগ করা হয়নি"}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span className="text-sm text-on-surface font-bold">{profile?.phone}</span>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <User size={15} /> প্রোফাইল এডিট করুন
              </button>
            </div>
          )}
        </div>
      </div>

      {/* NID Identity Verification Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <IdCard size={18} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="font-black text-on-surface">পরিচয়পত্র ভেরিফিকেশন (NID)</h3>
              <p className="text-xs text-on-surface-variant">আপনার জাতীয় পরিচয়পত্রের স্ক্যান কপি আপলোড করুন</p>
            </div>
          </div>
          {/* Status Badge */}
          {(() => {
            const status = profile?.nidVerification?.status || "unsubmitted";
            if (status === "verified") return <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black rounded-full uppercase"><CheckCircle size={14} /> ভেরিফাইড</span>;
            if (status === "pending") return <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black rounded-full uppercase"><Clock size={14} /> পেন্ডিং</span>;
            if (status === "rejected") return <span className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-black rounded-full uppercase"><AlertCircle size={14} /> বাতিল</span>;
            return <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-black rounded-full uppercase">আপলোড করা হয়নি</span>;
          })()}
        </div>

        {profile?.nidVerification?.status === "rejected" && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
            <div className="flex gap-2">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-red-700 dark:text-red-400">আপনার NID বাতিল করা হয়েছে!</p>
                <p className="text-[11px] text-red-600/80 dark:text-red-400/80 mt-0.5">{profile?.nidVerification?.rejectionReason || "কোনো কারণ উল্লেখ করা হয়নি।"}</p>
              </div>
            </div>
          </div>
        )}

        {(profile?.nidVerification?.status === "unsubmitted" || profile?.nidVerification?.status === "rejected") && (
          <div>
            <input ref={nidInputRef} type="file" accept="image/*,application/pdf" onChange={handleNidChange} className="hidden" />
            <button
              onClick={() => nidInputRef.current?.click()}
              disabled={nidUploading || nidMutation.isPending}
              className="w-full flex flex-col items-center justify-center gap-3 py-8 px-4 rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                {nidUploading || nidMutation.isPending ? (
                  <Loader2 size={24} className="text-indigo-500 animate-spin" />
                ) : (
                  <Upload size={24} className="text-indigo-500" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-indigo-700 dark:text-indigo-400">
                  {nidUploading || nidMutation.isPending ? "আপলোড হচ্ছে..." : "NID স্ক্যান আপলোড করুন"}
                </p>
                <p className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 mt-1">JPG, PNG, WEBP বা PDF (Max 5MB)</p>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Key size={18} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-black text-on-surface">পাসওয়ার্ড পরিবর্তন</h3>
            <p className="text-xs text-on-surface-variant">পোর্টাল লগইন পাসওয়ার্ড পরিবর্তন করুন</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: "বর্তমান পাসওয়ার্ড", key: "currentPassword" },
            { label: "নতুন পাসওয়ার্ড", key: "newPassword" },
            { label: "নতুন পাসওয়ার্ড নিশ্চিত করুন", key: "confirmPassword" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="text-xs font-black text-on-surface-variant mb-1.5 block">{label}</label>
              <input
                type="password"
                value={(pwForm as any)[key]}
                onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder="••••••"
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 text-on-surface text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          ))}
          <button
            onClick={handlePasswordChange}
            disabled={pwMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-2xl font-black text-sm hover:bg-amber-600 disabled:opacity-50 transition-all shadow-lg shadow-amber-200"
          >
            {pwMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Key size={15} />}
            পাসওয়ার্ড পরিবর্তন করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenantProfile;
