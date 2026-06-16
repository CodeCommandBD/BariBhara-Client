import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Package, Plus, Edit, Trash2, CheckCircle2, X, Loader2 } from "lucide-react";
import { useConfirmStore } from "@/store/useConfirmStore";

interface Plan {
  _id: string;
  name: string;
  title: string;
  price: number;
  billingCycle: string;
  features: string[];
  limits: {
    maxProperties: number;
    maxTenants: number;
  };
}

const AdminPlans = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const { openConfirm } = useConfirmStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    price: 0,
    billingCycle: "monthly",
    maxProperties: 1,
    maxTenants: 2,
    features: "", // Comma-separated temporarily
  });

  // --- API Calls ---
  const fetchPlans = async (): Promise<Plan[]> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/plans`, {
      headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch plans");
    const data = await res.json();
    return data.plans;
  };

  const createPlan = async (planData: any) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/plans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`
      },
      body: JSON.stringify(planData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create plan");
    return data;
  };

  const updatePlan = async (dataPayload: { id: string, planData: any }) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/plans/${dataPayload.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`
      },
      body: JSON.stringify(dataPayload.planData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update plan");
    return data;
  };

  const deletePlan = async (id: string) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin/plans/${id}`, {
      method: "DELETE",
      headers: { Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete plan");
    return data;
  };

  // --- Queries & Mutations ---
  const { data: plans, isLoading } = useQuery({
    queryKey: ["adminPlans"],
    queryFn: fetchPlans
  });

  const createMutation = useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      toast.success("প্ল্যান সফলভাবে তৈরি হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
      closeModal();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      toast.success("প্ল্যান সফলভাবে আপডেট হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
      closeModal();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      toast.success("প্ল্যান মুছে ফেলা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["adminPlans"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  // --- Handlers ---
  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        title: plan.title,
        price: plan.price,
        billingCycle: plan.billingCycle,
        maxProperties: plan.limits.maxProperties,
        maxTenants: plan.limits.maxTenants,
        features: plan.features.join(", "),
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: "",
        title: "",
        price: 0,
        billingCycle: "monthly",
        maxProperties: 1,
        maxTenants: 2,
        features: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      title: formData.title,
      price: Number(formData.price),
      billingCycle: formData.billingCycle,
      features: formData.features.split(",").map(f => f.trim()).filter(Boolean),
      limits: {
        maxProperties: Number(formData.maxProperties),
        maxTenants: Number(formData.maxTenants),
      }
    };

    if (editingPlan) {
      updateMutation.mutate({ id: editingPlan._id, planData: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    openConfirm({
      title: "প্ল্যান মুছে ফেলা",
      message: "আপনি কি নিশ্চিত যে এই প্ল্যানটি মুছে ফেলতে চান?",
      confirmText: "মুছে ফেলুন",
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="p-4 lg:p-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Package className="text-primary" size={28} />
            Subscription Plans
          </h1>
          <p className="text-slate-500 mt-1">প্ল্যাটফর্মের সাবস্ক্রিপশন প্যাকেজ ম্যানেজ করুন</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} /> নতুন প্ল্যান তৈরি করুন
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <div key={plan._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {plan.name}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(plan)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(plan._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{plan.title}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900 dark:text-white">৳{plan.price}</span>
                <span className="text-slate-500 font-medium mb-1">/{plan.billingCycle === 'yearly' ? 'বছর' : 'মাস'}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">সর্বোচ্চ প্রপার্টি</span>
                  <span className="font-bold">{plan.limits.maxProperties === -1 ? 'আনলিমিটেড' : plan.limits.maxProperties}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">সর্বোচ্চ ভাড়াটিয়া</span>
                  <span className="font-bold">{plan.limits.maxTenants === -1 ? 'আনলিমিটেড' : plan.limits.maxTenants}</span>
                </div>
                
                <ul className="space-y-3 pt-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold flex items-center gap-2">
                {editingPlan ? <Edit className="text-primary" /> : <Plus className="text-primary" />}
                {editingPlan ? "প্ল্যান এডিট করুন" : "নতুন প্ল্যান তৈরি করুন"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category Name (e.g. basic, pro)</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 transition-all outline-none"
                    placeholder="premium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Title (e.g. প্রিমিয়াম প্ল্যান)</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 transition-all outline-none"
                    placeholder="প্রিমিয়াম প্ল্যান"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price (BDT)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 transition-all outline-none"
                  >
                    <option value="monthly">Monthly (মাসিক)</option>
                    <option value="yearly">Yearly (বাৎসরিক)</option>
                    <option value="forever">Forever (এককালীন)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Properties (-1 for unlimited)</label>
                  <input
                    type="number"
                    required
                    value={formData.maxProperties}
                    onChange={(e) => setFormData({ ...formData, maxProperties: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Tenants (-1 for unlimited)</label>
                  <input
                    type="number"
                    required
                    value={formData.maxTenants}
                    onChange={(e) => setFormData({ ...formData, maxTenants: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Features (Comma separated)</label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 transition-all outline-none resize-none"
                  placeholder="১০টি বিল্ডিং, আনলিমিটেড ভাড়াটিয়া, অটোমেটিক ইনভয়েস..."
                />
                <p className="text-xs text-slate-500 mt-2">Example: Feature 1, Feature 2, Feature 3</p>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  ক্যান্সেল
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 rounded-xl font-medium text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? "সেভ হচ্ছে..." : "সেভ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
