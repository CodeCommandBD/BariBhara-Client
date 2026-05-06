import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const BASE_URL = "http://localhost:4000/api/maintenance";

export const useMaintenance = (filters?: { status?: string; priority?: string }) => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  const authHeader = {
    Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
  };

  // সব মেইনটেন্যান্স রিকোয়েস্ট লোড করা
  const { data, isLoading } = useQuery({
    queryKey: ["maintenance", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.priority) params.append("priority", filters.priority);
      const res = await axios.get(`${BASE_URL}?${params}`, { headers: authHeader });
      return res.data;
    },
    enabled: !!token,
  });

  // নতুন রিকোয়েস্ট তৈরি
  const addMutation = useMutation({
    mutationFn: async (form: any) => {
      const res = await axios.post(BASE_URL, form, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      toast.success("মেইনটেন্যান্স রিকোয়েস্ট তৈরি হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "ব্যর্থ হয়েছে!"),
  });

  // স্ট্যাটাস আপডেট
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, cost }: { id: string; status: string; cost?: number }) => {
      const res = await axios.patch(`${BASE_URL}/${id}/status`, { status, cost }, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      toast.success("স্ট্যাটাস আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "আপডেট ব্যর্থ!"),
  });

  // ডিলিট
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${BASE_URL}/${id}`, { headers: authHeader });
      return res.data;
    },
    onSuccess: () => {
      toast.success("রিকোয়েস্ট ডিলিট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "ডিলিট ব্যর্থ!"),
  });

  return {
    items: data?.items ?? [],
    summary: data?.summary ?? { total: 0, pending: 0, inProgress: 0, resolved: 0, totalCost: 0 },
    isLoading,
    addMutation,
    updateStatusMutation,
    deleteMutation,
  };
};
