import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { addExpenseApi, getExpensesApi, deleteExpenseApi } from "@/api/expense.api";

export const useExpense = (filters?: { propertyId?: string; startDate?: string; endDate?: string }) => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // সব খরচের তালিকা
  const { data, isLoading } = useQuery({
    queryKey: ["expenses", filters],
    queryFn: () => getExpensesApi(filters ?? {}, token!),
    enabled: !!token,
  });

  // খরচ যোগ করা
  const addExpenseMutation = useMutation({
    mutationFn: (data: any) => addExpenseApi(data, token!),
    onSuccess: (res) => {
      toast.success(res.message || "খরচ যোগ হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["financial-report"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "খরচ যোগ করতে সমস্যা হয়েছে!");
    },
  });

  // খরচ ডিলিট করা
  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => deleteExpenseApi(id, token!),
    onSuccess: (res) => {
      toast.success(res.message || "মুছে ফেলা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["financial-report"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "মুছতে সমস্যা হয়েছে!");
    },
  });

  return {
    expenses: data?.expenses ?? [],
    totalExpense: data?.totalExpense ?? 0,
    isLoading,
    addExpenseMutation,
    deleteExpenseMutation,
  };
};
