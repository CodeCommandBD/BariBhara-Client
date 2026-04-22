import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useUnit = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // --- ১. নির্দিষ্ট একটি বাড়ির সব ইউনিট লোড করার কুয়েরি ---
  const useGetUnits = (propertyId: string | undefined) => {
    return useQuery({
      queryKey: ["units", propertyId],
      queryFn: async () => {
        const response = await axios.get(`http://localhost:4000/api/unit/${propertyId}`, {
          headers: {
            Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
          },
        });
        return response.data.units;
      },
      enabled: !!token && !!propertyId, // টোকেন এবং প্রপার্টি আইডি থাকলে তবেই চলবে
    });
  };

  // --- ২. নতুন ইউনিট যোগ করার মিউটেশন ---
  const createUnitMutation = useMutation({
    mutationFn: async (unitData: any) => {
      const response = await axios.post("http://localhost:4000/api/unit/add-unit", unitData, {
        headers: {
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "ইউনিট সফলভাবে যোগ করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["units"] }); // লিস্ট রিলোড করবে
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); // ড্যাশবোর্ড আপডেট করবে
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "ইউনিট যোগ করতে সমস্যা হয়েছে!");
    },
  });

  // --- ৩. ইউনিটের তথ্য (ভাড়া/স্ট্যাটাস) আপডেট করার মিউটেশন ---
  const updateUnitMutation = useMutation({
    mutationFn: async ({ unitId, data }: { unitId: string; data: any }) => {
      const response = await axios.put(`http://localhost:4000/api/unit/${unitId}`, data, {
        headers: {
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "ইউনিট আপডেট করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["units"] });
    },
  });

  // --- ৪. ইউনিট ডিলিট করার মিউটেশন ---
  const deleteUnitMutation = useMutation({
    mutationFn: async (unitId: string) => {
      const response = await axios.delete(`http://localhost:4000/api/unit/${unitId}`, {
        headers: {
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "ইউনিট মুছে ফেলা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["units"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  return {
    useGetUnits,
    createUnitMutation,
    updateUnitMutation,
    deleteUnitMutation,
  };
};
