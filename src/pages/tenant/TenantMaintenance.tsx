import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useTenantAuthStore } from "../../store/useTenantAuthStore";
import { toast } from "sonner";

const API_URL = "http://localhost:4000/api/tenant-portal";

const TenantMaintenance = () => {
  const { token } = useTenantAuthStore();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", priority: "Medium" });

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  const { data: response, isLoading } = useQuery({
    queryKey: ["tenant-maintenance"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/maintenance`, { headers: authHeader });
      return res.data;
    },
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await axios.post(`${API_URL}/maintenance`, data, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      toast.success("মেইনটেন্যান্স অনুরোধ সফলভাবে পাঠানো হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenant-maintenance"] });
      setIsModalOpen(false);
      setFormData({ title: "", description: "", priority: "Medium" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "অনুরোধ পাঠাতে সমস্যা হয়েছে!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.error("শিরোনাম আবশ্যক!");
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const requests = response?.requests || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500">
            <Wrench size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">মেইনটেন্যান্স</h1>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">আপনার অভিযোগ ও অনুরোধসমূহ পরিচালনা করুন</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-5 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> নতুন অনুরোধ
        </button>
      </div>

      {/* Requests List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800">
            <CheckCircle2 size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">কোনো অনুরোধ নেই</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">আপনার কোনো মেইনটেন্যান্স অনুরোধ করা হয়নি।</p>
          </div>
        ) : (
          requests.map((req: any) => (
            <div key={req._id} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black ${
                  req.status === "Resolved" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30" :
                  req.status === "In Progress" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30" :
                  "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                }`}>
                  {req.status === "Resolved" && <CheckCircle2 size={14} />}
                  {req.status === "Pending" && <Clock size={14} />}
                  {req.status === "In Progress" && <Wrench size={14} />}
                  {req.status}
                </span>
                <span className={`px-2 py-1 rounded border text-[10px] font-black uppercase ${
                  req.priority === "High" ? "border-red-200 text-red-500 bg-red-50 dark:bg-red-900/10" :
                  req.priority === "Medium" ? "border-amber-200 text-amber-500 bg-amber-50 dark:bg-amber-900/10" :
                  "border-emerald-200 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
                }`}>
                  {req.priority}
                </span>
              </div>
              
              <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg mb-2 line-clamp-1">{req.title}</h3>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 flex-grow line-clamp-3 mb-4">
                {req.description || "কোনো বিবরণ দেওয়া হয়নি"}
              </p>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto flex items-center justify-between text-xs font-bold text-slate-400">
                <span>রিপোর্ট: {new Date(req.reportedDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6">নতুন মেইনটেন্যান্স অনুরোধ</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-1 ml-1">শিরোনাম</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="সমস্যার নাম (যেমন: পানির কল নষ্ট)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/30 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-1 ml-1">বিবরণ</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="সমস্যার বিস্তারিত বিবরণ দিন..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/30 min-h-[100px] resize-none dark:text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase mb-1 ml-1">গুরুত্ব</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-primary/30 appearance-none dark:text-white"
                >
                  <option value="Low">Low (সাধারণ)</option>
                  <option value="Medium">Medium (জরুরি)</option>
                  <option value="High">High (অতি জরুরি)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-70 flex justify-center items-center"
                >
                  {createMutation.isPending ? "পাঠানো হচ্ছে..." : "অনুরোধ পাঠান"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantMaintenance;
