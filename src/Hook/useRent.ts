import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  generateInvoiceApi,
  collectPaymentApi,
  getPendingInvoicesApi,
  getInvoiceTransactionsApi,
} from "@/api/rent.api";

export const useRent = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // --- ১. সব বকেয়া ইনভয়েস লোড করা (Pagination সহ) ---
  const { data, isLoading: isPendingLoading } = useQuery({
    queryKey: ["pending-invoices", page, limit],
    queryFn: () => getPendingInvoicesApi(token!, page, limit),
    enabled: !!token,
    placeholderData: (prev) => prev,
  });

  const pendingInvoices: any[] = data?.invoices ?? [];
  const total: number = data?.total ?? 0;
  const totalPages: number = data?.totalPages ?? 1;

  // --- ২. বিল জেনারেট মিউটেশন ---
  const generateInvoiceMutation = useMutation({
    mutationFn: (data: any) => generateInvoiceApi(data, token!),
    onSuccess: (res) => {
      toast.success(res.message || "বিল তৈরি হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["pending-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "বিল তৈরি করতে সমস্যা হয়েছে!");
    },
  });

  // --- ৩. পেমেন্ট কালেক্ট মিউটেশন ---
  const collectPaymentMutation = useMutation({
    mutationFn: (data: any) => collectPaymentApi(data, token!),
    onSuccess: (res) => {
      toast.success(res.message || "পেমেন্ট সম্পন্ন হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["pending-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "পেমেন্ট নিতে সমস্যা হয়েছে!");
    },
  });

  // --- ৪. ট্রানজেকশন হিস্টোরি (ফাংশন হিসেবে) ---
  const useGetInvoiceTransactions = (invoiceId: string | undefined) =>
    useQuery({
      queryKey: ["transactions", invoiceId],
      queryFn: () => getInvoiceTransactionsApi(invoiceId!, token!),
      enabled: !!token && !!invoiceId,
    });

  return {
    pendingInvoices,
    total,
    totalPages,
    isPendingLoading,
    generateInvoiceMutation,
    collectPaymentMutation,
    useGetInvoiceTransactions,
  };
};
