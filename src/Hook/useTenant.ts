import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  addTenantApi,
  getAllTenantsApi,
  getTenantByUnitApi,
  updateTenantApi,
  vacateTenantApi,
  toggleAutoRenewApi,
  renewLeaseApi,
  generateAgreementApi,
  deleteAgreementApi,
  verifyNidApi,
  updateUtilitiesApi,
  rateTenantApi,
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
    mutationFn: (formData: FormData) => {
      // Enforce Free Plan limit of 2 tenants
      const user = useAuthStore.getState().user;
      if (user?.subscriptionPlan === "free") {
        const currentCount = total || 0;
        if (currentCount >= 2) {
          throw new Error("আপনার ফ্রি প্ল্যানের লিমিট শেষ! আরও ভাড়াটিয়া যোগ করতে দয়া করে প্রো প্ল্যানে সাবস্ক্রাইব করুন।");
        }
      }
      return addTenantApi(formData, token!);
    },
    onSuccess: (data) => {
      toast.success(data.message || "ভাড়াটিয়া সফলভাবে যোগ করা হয়েছে!");
      // সব সম্পর্কিত কুয়েরি রিফ্রেশ করা
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.message || error.response?.data?.message || "ভাড়াটিয়া যোগ করতে সমস্যা হয়েছে!");
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
  // --- ৬. Auto Renew টগল করা ---
  const toggleAutoRenewMutation = useMutation({
    mutationFn: ({ id, autoRenew }: { id: string; autoRenew: boolean }) =>
      toggleAutoRenewApi(id, autoRenew, token!),
    onSuccess: (data) => {
      toast.success(data.message || "অটো-রিনিউয়াল আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে!");
    },
  });

  // --- ৭. ম্যানুয়াল রিনিউ ---
  const renewLeaseMutation = useMutation({
    mutationFn: ({ id, newEndDate }: { id: string; newEndDate: string }) =>
      renewLeaseApi(id, newEndDate, token!),
    onSuccess: (data) => {
      toast.success(data.message || "লিজ সফলভাবে রিনিউ করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "রিনিউ করতে সমস্যা হয়েছে!");
    },
  });

  // --- ৮. ডিজিটাল চুক্তিপত্র জেনারেট করা ---
  const generateAgreementMutation = useMutation({
    mutationFn: (id: string) => generateAgreementApi(id, token!),
    onSuccess: (data) => {
      toast.success(data.message || "চুক্তিপত্র সফলভাবে জেনারেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "চুক্তিপত্র জেনারেট করতে সমস্যা হয়েছে!");
    },
  });

  const deleteAgreementMutation = useMutation({
    mutationFn: (id: string) => deleteAgreementApi(id, token!),
    onSuccess: (data) => {
      toast.success(data.message || "চুক্তিপত্র মুছে ফেলা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "মুছে ফেলতে সমস্যা হয়েছে!");
    },
  });

  const verifyNidMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason: string }) => 
      verifyNidApi(id, status, rejectionReason, token!),
    onSuccess: (data) => {
      toast.success(data.message || "NID স্ট্যাটাস আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে!");
    },
  });

  const updateUtilitiesMutation = useMutation({
    mutationFn: ({ id, utilityConfig }: { id: string; utilityConfig: any }) => 
      updateUtilitiesApi(id, utilityConfig, token!),
    onSuccess: (data) => {
      toast.success(data.message || "ইউটিলিটি সেটিংস আপডেট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "আপডেট করতে সমস্যা হয়েছে!");
    },
  });

  const rateTenantMutation = useMutation({
    mutationFn: ({ id, ratingData }: { id: string; ratingData: any }) => 
      rateTenantApi(id, ratingData, token!),
    onSuccess: (data) => {
      toast.success(data.message || "ভাড়াটিয়াকে সফলভাবে রেটিং দেওয়া হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "রেটিং দিতে সমস্যা হয়েছে!");
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
    toggleAutoRenewMutation,
    renewLeaseMutation,
    generateAgreementMutation,
    deleteAgreementMutation,
    verifyNidMutation,
    updateUtilitiesMutation,
    rateTenantMutation,
  };
};
