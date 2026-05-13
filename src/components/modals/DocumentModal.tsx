import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { X, UploadCloud, FileText, Trash2, FileOutput, Loader2, Image as ImageIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  tenantName: string;
}

const BASE_URL = "http://localhost:4000/api/documents";

const DocumentModal = ({ isOpen, onClose, tenantId, tenantName }: DocumentModalProps) => {
  const [docType, setDocType] = useState("nid");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const authHeader = { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` };

  // Fetch Documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", tenantId],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/${tenantId}`, { headers: authHeader });
      return res.data.documents;
    },
    enabled: isOpen && !!tenantId,
  });

  // Upload Document
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("docType", docType);
      const res = await axios.post(`${BASE_URL}/${tenantId}/upload`, formData, {
        headers: { ...authHeader, "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "ডকুমেন্ট আপলোড হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["documents", tenantId] });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "আপলোড ব্যর্থ!"),
  });

  // Delete Document
  const deleteMutation = useMutation({
    mutationFn: async (publicId: string) => {
      const res = await axios.delete(`${BASE_URL}/${tenantId}/${encodeURIComponent(publicId)}`, { headers: authHeader });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "ডকুমেন্ট মুছে ফেলা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["documents", tenantId] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "মুছে ফেলা ব্যর্থ!"),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ফাইলের সাইজ ১০MB এর বেশি হতে পারবে না");
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleDownloadLease = () => {
    fetch(`${BASE_URL}/${tenantId}/lease-pdf`, { headers: authHeader })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `lease-${tenantName.replace(/\s/g, "_")}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("লিজ চুক্তি ডাউনলোড শুরু হয়েছে");
      })
      .catch(() => toast.error("ডাউনলোড ব্যর্থ হয়েছে"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">ডকুমেন্ট ম্যানেজমেন্ট</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">ভাড়াটিয়া: {tenantName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-8">
          
          {/* Upload Section */}
          <div className="p-5 bg-slate-50 border border-dashed border-slate-300 rounded-[24px] text-center">
            <h3 className="text-sm font-bold text-slate-700 mb-4">নতুন ডকুমেন্ট আপলোড করুন</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:border-primary font-bold text-sm min-w-[150px]"
              >
                <option value="nid">NID / আইডি</option>
                <option value="contract">চুক্তিপত্র</option>
                <option value="photo">ছবি</option>
                <option value="other">অন্যান্য</option>
              </select>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50"
              >
                {uploadMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                ফাইল নির্বাচন করুন
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">সর্বোচ্চ ১০MB (PDF, JPG, PNG)</p>
          </div>

          {/* Lease Generator */}
          <div className="p-5 bg-violet-50 rounded-[24px] flex items-center justify-between border border-violet-100">
            <div>
              <h3 className="font-bold text-violet-900">স্মার্ট লিজ চুক্তি</h3>
              <p className="text-xs text-violet-600/70 mt-0.5">অটো-জেনারেটেড ডাইনামিক PDF এগ্রিমেন্ট</p>
            </div>
            <button
              onClick={handleDownloadLease}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors text-sm shadow-md"
            >
              <FileOutput size={16} /> PDF ডাউনলোড
            </button>
          </div>

          {/* Document List */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-primary" /> বিদ্যমান ডকুমেন্টসমূহ
            </h3>
            
            {isLoading ? (
              <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : documents.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <ImageIcon className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-slate-500 font-medium">কোনো ডকুমেন্ট পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {documents.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                        {doc.url.endsWith(".pdf") ? <FileText size={20} className="text-red-500" /> : <ImageIcon size={20} className="text-blue-500" />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 capitalize text-sm">{doc.type}</p>
                        <p className="text-[10px] text-slate-400">{new Date(doc.uploadedAt).toLocaleDateString("en-BD")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-200"
                      >
                        দেখুন
                      </a>
                      <button
                        onClick={() => {
                          if(confirm("সত্যিই কি ডকুমেন্টটি মুছতে চান?")) {
                            deleteMutation.mutate(doc.publicId);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
