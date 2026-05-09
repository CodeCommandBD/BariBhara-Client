import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import {
  generateInvoiceApi,
  collectPaymentApi,
  getPendingInvoicesApi,
  getInvoiceTransactionsApi,
  editInvoiceApi,
  deleteInvoiceApi,
} from "@/api/rent.api";

export const useRent = (page = 1, limit = 10, status = "all", month = "", year = "") => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // --- ১. সব ইনভয়েস লোড করা (Status ফিল্টার + Pagination) ---
  const { data, isLoading: isPendingLoading } = useQuery({
    queryKey: ["pending-invoices", page, limit, status, month, year],
    queryFn: () => getPendingInvoicesApi(token!, page, limit, status, month, year),
    enabled: !!token,
    placeholderData: (prev) => prev,
  });

  const pendingInvoices: any[] = data?.invoices ?? [];
  const total: number = data?.total ?? 0;
  const totalPages: number = data?.totalPages ?? 1;
  const invoiceStats: any = data?.stats ?? { Unpaid: { count: 0, totalDue: 0 }, Partial: { count: 0, totalDue: 0 }, Paid: { count: 0, totalDue: 0 } };

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

  // --- ৫. ইনভয়েস এডিট মিউটেশন ---
  const editInvoiceMutation = useMutation({
    mutationFn: ({ invoiceId, data }: { invoiceId: string; data: any }) => editInvoiceApi(invoiceId, data, token!),
    onSuccess: (res) => {
      toast.success(res.message || "বিল এডিট হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["pending-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "বিল এডিট করতে সমস্যা হয়েছে!");
    },
  });

  // --- ৬. ইনভয়েস ডিলিট মিউটেশন ---
  const deleteInvoiceMutation = useMutation({
    mutationFn: (invoiceId: string) => deleteInvoiceApi(invoiceId, token!),
    onSuccess: (res) => {
      toast.success(res.message || "বিল বাতিল করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["pending-invoices"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "বিল ডিলিট করতে সমস্যা হয়েছে!");
    },
  });

  return {
    pendingInvoices,
    total,
    totalPages,
    isPendingLoading,
    invoiceStats,
    generateInvoiceMutation,
    collectPaymentMutation,
    editInvoiceMutation,
    deleteInvoiceMutation,
    useGetInvoiceTransactions,
  };
};
