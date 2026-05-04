import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  generateInvoiceApi,
  collectPaymentApi,
  getPendingInvoicesApi,
  getInvoiceTransactionsApi,
} from "@/api/rent.api";

export const useRent = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // --- ১. সব বকেয়া ইনভয়েস লোড করা ---
  const { data: pendingInvoices = [], isLoading: isPendingLoading } = useQuery({
    queryKey: ["pending-invoices"],
    queryFn: () => getPendingInvoicesApi(token!),
    enabled: !!token,
  });

  // --- ২. বিল জেনারেট মিউটেশন ---
  const generateInvoiceMutation = useMutation({
    mutationFn: (data: any) => generateInvoiceApi(data, token!),
    onSuccess: (res) => {
      toast.success(res.message || "বিল তৈরি হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["pending-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "বিল তৈরি করতে সমস্যা হয়েছে!");
    },
  });

  // --- ৩. পেমেন্ট কালেক্ট মিউটেশন ---
  const collectPaymentMutation = useMutation({
    mutationFn: (data: any) => collectPaymentApi(data, token!),
    onSuccess: (res) => {
      toast.success(res.message || "পেমেন্ট সম্পন্ন হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["pending-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "পেমেন্ট নিতে সমস্যা হয়েছে!");
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
    isPendingLoading,
    generateInvoiceMutation,
    collectPaymentMutation,
    useGetInvoiceTransactions,
  };
};
