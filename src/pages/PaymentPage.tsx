import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const PaymentPage = () => {
  const { plan } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    senderNumber: "",
    trxId: "",
    paymentMethod: "bkash",
  });

  const plans: Record<string, { name: string; price: number }> = {
    basic: { name: "বেসিক প্ল্যান", price: 499 },
    pro: { name: "প্রো প্ল্যান", price: 999 },
  };

  const selectedPlan = plans[plan || "basic"];

  if (!selectedPlan) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("আপনাকে আগে লগইন করতে হবে।");
      navigate("/login");
      return;
    }

    if (!formData.trxId.trim() && !screenshotFile) {
      toast.error("দয়া করে Transaction ID অথবা পেমেন্ট স্ক্রিনশট যেকোনো একটি অবশ্যই প্রদান করুন!");
      return;
    }

    setLoading(true);
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("plan", plan || "basic");
      bodyFormData.append("amount", selectedPlan.price.toString());
      bodyFormData.append("senderNumber", formData.senderNumber);
      bodyFormData.append("trxId", formData.trxId);
      bodyFormData.append("paymentMethod", formData.paymentMethod);
      if (screenshotFile) {
        bodyFormData.append("screenshot", screenshotFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/subscription/create`, {
        method: "POST",
        headers: {
          Authorization: useAuthStore.getState().token?.startsWith("Bearer ") 
            ? useAuthStore.getState().token! 
            : `Bearer ${useAuthStore.getState().token}`,
        },
        body: bodyFormData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("পেমেন্ট রিকোয়েস্ট সফলভাবে পাঠানো হয়েছে! এডমিন খুব শীঘ্রই অ্যাপ্রুভ করবে।");
        // Update local user state
        const updatedUser = { ...user, subscriptionStatus: "pending" as const, subscriptionPlan: plan as any };
        useAuthStore.getState().setAuth(updatedUser, useAuthStore.getState().token!);
        navigate("/");
      } else {
        toast.error(data.message || "পেমেন্ট রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে।");
      }
    } catch (error) {
      toast.error("সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center py-20 px-4 relative">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold bg-surface-container px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
      >
        <ArrowLeft size={18} />
        ফিরে যান
      </button>

      <div className="bg-surface-container-lowest max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="bg-primary p-6 text-white text-center">
          <h1 className="font-headline text-3xl font-bold mb-2">পেমেন্ট ভেরিফিকেশন</h1>
          <p className="text-white/80">আপনি {selectedPlan.name} (৳ {selectedPlan.price}) নির্বাচন করেছেন</p>
        </div>
        
        <div className="p-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-lg mb-8 text-sm">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span> পেমেন্ট করার নিয়ম:
            </h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>নিচের বিকাশ বা নগদ নম্বরে <strong>৳ {selectedPlan.price}</strong> সেন্ড মানি করুন।</li>
              <li>পেমেন্ট সম্পন্ন হলে আপনার পেমেন্ট নম্বর এবং Transaction ID (TrxID) নিচের ফর্মে দিন।</li>
              <li>এডমিন ভেরিফাই করার পর আপনার ড্যাশবোর্ড চালু হয়ে যাবে।</li>
            </ol>
          </div>

          <div className="flex justify-around items-center mb-8 p-4 bg-surface-container rounded-xl">
            <div className="text-center">
              <img src="https://download.logo.wine/logo/BKash/BKash-Icon-Logo.wine.png" alt="bKash" className="w-16 h-16 object-contain mx-auto mb-2" />
              <p className="font-bold">০১৭XX-XXXXXX</p>
              <p className="text-xs text-on-surface-variant">পার্সোনাল</p>
            </div>
            <div className="w-px h-16 bg-outline-variant/30"></div>
            <div className="text-center">
              <img src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" alt="Nagad" className="w-20 h-16 object-contain mx-auto mb-2" />
              <p className="font-bold">০১৭XX-XXXXXX</p>
              <p className="text-xs text-on-surface-variant">পার্সোনাল</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">পেমেন্ট মেথড</label>
              <select
                required
                className="w-full bg-surface-container border-none rounded-lg p-4 focus:ring-2 focus:ring-primary outline-none"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="rocket">রকেট (Rocket)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">যে নম্বর থেকে টাকা পাঠিয়েছেন</label>
              <input
                required
                type="text"
                placeholder="01XXXXXXXXX"
                className="w-full bg-surface-container border-none rounded-lg p-4 focus:ring-2 focus:ring-primary outline-none"
                value={formData.senderNumber}
                onChange={(e) => setFormData({ ...formData, senderNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Transaction ID (TrxID) (যদি থাকে)</label>
              <input
                type="text"
                placeholder="EX12345678"
                className="w-full bg-surface-container border-none rounded-lg p-4 focus:ring-2 focus:ring-primary outline-none"
                value={formData.trxId}
                onChange={(e) => setFormData({ ...formData, trxId: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">পেমেন্টের স্ক্রিনশট (ঐচ্ছিক / Optional)</label>
              <input
                type="file"
                accept="image/*"
                className="w-full bg-surface-container border-none rounded-lg p-4 focus:ring-2 focus:ring-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setScreenshotFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? "প্রসেসিং..." : "সাবমিট করুন"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
