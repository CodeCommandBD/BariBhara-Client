import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useProperty = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // --- ১. সব প্রপার্টি লড করার জন্য কুয়েরি ---

  const { data: properties, isLoading: isPropertiesLoading } = useQuery({
    queryKey: ["my-properties"], // এটি দিয়ে ডাটা জমা থাকে
    queryFn: async () => {
      //
      const response = await axios.get(
        "http://localhost:4000/api/property/my-property",
        {
          headers: {
            Authorization: token?.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`, // টোকেন চেক করা হচ্ছে
          },
        },
      );
      return response.data.properties; // সার্ভার থেকে পাওয়া প্রপার্টিজ রিটার্ন করছি
    },
    enabled: !!token, // টোকেন থাকলে তবেই ডাটা আসবে
  });

  // Add Property
  const createPropertyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(
        "http://localhost:4000/api/property/add-property",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token?.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "প্রপার্টি সফলভাবে তৈরি করা হয়েছে!");

      // বাড়ি সেভ হওয়ার পর ড্যাশবোর্ডের ডাটা অটোমেটিক রিফ্রেশ করবে
      queryClient.invalidateQueries({ queryKey: ["my-properties"] }); // লিস্ট রিলোড করবে

      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); // ড্যাশবোর্ড আপডেট করবে
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "কিছু একটা ভুল হয়েছে!");
    },
  });

  // আমরা এই ফাংশনটি (useSingleProperty) এমনভাবে লিখছি যাতে আইডি পাঠালে ডাটা নিয়ে আসে
  const useSingleProperty = (id: string | undefined) => {
    return useQuery({
      queryKey: ["property", id], // আইডির ওপর ভিত্তি করে ডাটা আলাদাভাবে জমা থাকবে
      queryFn: async () => {
        const response = await axios.get(
          `http://localhost:4000/api/property/${id}`,
          {
            headers: {
              Authorization: token?.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`,
            },
          },
        );
        return response.data.property; // সার্ভার থেকে একটি নির্দিষ্ট বাড়ির তথ্য রিটার্ন করছি
      },
      enabled: !!token && !!id, // টোকেন এবং আইডি—উভয়ই থাকলে তবেই কল হবে
    });
  };

  // --- ৩. প্রপার্টির তথ্য আপডেট করার মিউটেশন ---
  const updatePropertyMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await axios.put(
        `http://localhost:4000/api/property/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token?.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "প্রপার্টি আপডেট করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["property"] }); // নির্দিষ্ট প্রপার্টির ডাটা রিফ্রেশ করবে
      queryClient.invalidateQueries({ queryKey: ["my-properties"] }); // লিস্ট রিফ্রেশ করবে
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "প্রপার্টি আপডেট করা সম্ভব হয়নি!");
    },
  });

  // --- ৪. প্রপার্টি ডিলিট করার মিউটেশন ---
  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        `http://localhost:4000/api/property/${id}`,
        {
          headers: {
            Authorization: token?.startsWith("Bearer ")
              ? token
              : `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "প্রপার্টি মুছে ফেলা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["my-properties"] }); // লিস্ট রিফ্রেশ করবে
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); // ড্যাশবোর্ড আপডেট করবে
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "প্রপার্টি মুছতে সমস্যা হয়েছে!",
      );
    },
  });

  return {
    createPropertyMutation,
    properties,
    isPropertiesLoading,
    useSingleProperty,
    updatePropertyMutation,
    deletePropertyMutation,
  };
};
