import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  addTenantApi,
  getAllTenantsApi,
  getTenantByUnitApi,
  updateTenantApi,
  vacateTenantApi,
} from "@/api/tenant.api";

export const useTenant = (page = 1, limit = 9) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // --- ১. সকল ভাড়াটিয়া লোড করার কুয়েরি ---
  const { data, isLoading: isTenantsLoading } = useQuery({
    queryKey: ["tenants", page, limit],
    queryFn: () => getAllTenantsApi(token!, page, limit),
    enabled: !!token,
    placeholderData: (prev) => prev, // smooth page transitions
  });

  const tenants: any[] = data?.tenants ?? [];
  const total: number = data?.total ?? 0;
  const totalPages: number = data?.totalPages ?? 1;

  // --- ২. একটি নির্দিষ্ট ইউনিটের ভাড়াটিয়া ---
  const useGetTenantByUnit = (unitId: string | undefined) =>
    useQuery({
      queryKey: ["tenant", unitId],
      queryFn: () => getTenantByUnitApi(unitId!, token!),
      enabled: !!token && !!unitId,
      retry: false, // ভাড়াটিয়া না থাকলে বারবার ট্রাই করবে না
    });

  // --- ৩. নতুন ভাড়াটিয়া যোগ করা ---
  const addTenantMutation = useMutation({
    mutationFn: (formData: FormData) => addTenantApi(formData, token!),
    onSuccess: (data) => {
      toast.success(data.message || "ভাড়াটিয়া সফলভাবে যোগ করা হয়েছে!");
      // সব সম্পর্কিত কুয়েরি রিফ্রেশ করা
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "ভাড়াটিয়া যোগ করতে সমস্যা হয়েছে!");
    },
  });

  // --- ৪. ভাড়াটিয়ার তথ্য আপডেট ---
  const updateTenantMutation = useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateTenantApi(id, formData, token!),
    onSuccess: (data) => {
      toast.success(data.message || "তথ্য আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে!");
    },
  });

  // --- ৫. ভাড়াটিয়া সরানো (ইউনিট খালি করা) ---
  const vacateTenantMutation = useMutation({
    mutationFn: (id: string) => vacateTenantApi(id, token!),
    onSuccess: (data) => {
      toast.success(data.message || "ভাড়াটিয়া সরানো হয়েছে। ইউনিট এখন খালি।");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "ভাড়াটিয়া সরাতে সমস্যা হয়েছে!");
    },
  });

  return {
    // ডাটা
    tenants,
    total,
    totalPages,
    isTenantsLoading,
    // কুয়েরি (ফাংশন হিসেবে)
    useGetTenantByUnit,
    // মিউটেশন
    addTenantMutation,
    updateTenantMutation,
    vacateTenantMutation,
  };
};
