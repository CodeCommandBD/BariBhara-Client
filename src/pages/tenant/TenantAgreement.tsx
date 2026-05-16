import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import SignatureCanvas from "react-signature-canvas";
import { FileText, PenTool, CheckCircle2, Download, Trash2, ShieldCheck } from "lucide-react";

const TenantAgreement = () => {
  const { user, token } = useAuthStore() as any;
  const queryClient = useQueryClient();
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  // ভাড়াটিয়ার তথ্য লোড করা (চুক্তি দেখার জন্য)
  const { data: tenantData, isLoading } = useQuery({
    queryKey: ["my-tenant-profile"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:4000/api/tenant-portal/me", { headers: authHeader });
      return res.data.tenant;
    },
    enabled: !!token,
  });

  const signMutation = useMutation({
    mutationFn: async (signatureData: string) => {
      const res = await axios.post("http://localhost:4000/api/tenant/sign-agreement", { signatureData }, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      toast.success("চুক্তিপত্র সফলভাবে স্বাক্ষরিত হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["my-tenant-profile"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "স্বাক্ষর ব্যর্থ!"),
  });

  const handleSign = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("অনুগ্রহ করে স্বাক্ষর করুন!");
      return;
    }
    const signatureData = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (signatureData) {
      signMutation.mutate(signatureData);
    }
  };

  const clear = () => {
    sigCanvas.current?.clear();
    setIsEmpty(true);
  };

  if (isLoading) return <div className="p-10 text-center font-bold">লোড হচ্ছে...</div>;

  const agreement = tenantData?.agreement;

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      {/* হেডার */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileText className="text-primary" size={26} /> ডিজিটাল ভাড়ার চুক্তিপত্র
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">আপনার ভাড়ার শর্তাবলী এবং চুক্তি স্বাক্ষর করুন</p>
      </div>

      {!agreement?.pdfUrl ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-8 rounded-[32px] text-center">
          <FileText size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-200">কোনো চুক্তিপত্র পাওয়া যায়নি</h2>
          <p className="text-amber-600 dark:text-amber-400 mt-2">দয়া করে আপনার বাড়িওয়ালার সাথে যোগাযোগ করুন চুক্তিপত্র জেনারেট করার জন্য।</p>
        </div>
      ) : agreement.isSigned ? (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 p-8 rounded-[32px] text-center">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-200">আপনার চুক্তি স্বাক্ষরিত হয়েছে!</h2>
            <p className="text-emerald-600 dark:text-emerald-400 mt-2">
              আপনি সফলভাবে চুক্তিতে স্বাক্ষর করেছেন {new Date(agreement.signedAt).toLocaleDateString('bn-BD')} তারিখে।
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <a 
                href={agreement.pdfUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-700 text-emerald-600 font-bold rounded-2xl border border-emerald-200 hover:bg-emerald-50 transition-all"
              >
                <Download size={18} /> চুক্তি ডাউনলোড করুন
              </a>
              <div className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl flex items-center gap-2">
                <ShieldCheck size={18} /> স্বাক্ষরিত
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
             <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">আপনার স্বাক্ষর:</h3>
             <div className="w-full max-w-sm h-40 bg-slate-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center p-4 border border-slate-100 dark:border-slate-600">
                <img src={agreement.signatureUrl} alt="Your Signature" className="max-h-full" />
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* চুক্তিপত্র প্রিভিউ */}
          <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700 border-b border-slate-100 dark:border-slate-600 flex justify-between items-center">
               <span className="text-sm font-bold text-slate-600 dark:text-slate-200">Agreement.pdf</span>
               <a href={agreement.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs font-bold">নতুন ট্যাবে দেখুন</a>
            </div>
            <iframe 
              src={agreement.pdfUrl} 
              className="w-full flex-1 border-none"
              title="Rental Agreement"
              key={agreement.pdfUrl}
            />
          </div>

          {/* স্বাক্ষর সেকশন */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <PenTool size={20} className="text-primary" /> ডিজিটাল স্বাক্ষর দিন
              </h3>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-600 overflow-hidden">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="#702ae1"
                  canvasProps={{
                    className: "w-full h-64 cursor-crosshair",
                  }}
                  onBegin={() => setIsEmpty(false)}
                />
              </div>

              <div className="flex justify-between items-center mt-4">
                <button 
                  onClick={clear}
                  className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-500 font-bold text-sm transition-colors"
                >
                  <Trash2 size={16} /> মুছে ফেলুন
                </button>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">বক্সের ভেতর স্বাক্ষর করুন</p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  "আমি নিশ্চিত করছি যে আমি উপরের চুক্তিপত্রের সকল শর্তাবলী পড়েছি এবং এতে সম্মতি প্রদান করছি। এই ডিজিটাল স্বাক্ষরটি একটি আইনী স্বাক্ষর হিসেবে গণ্য হবে।"
                </p>
                
                <button
                  onClick={handleSign}
                  disabled={isEmpty || signMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-headline font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {signMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  চুক্তি স্বাক্ষর করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantAgreement;
