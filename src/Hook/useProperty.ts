import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";


export const useProperty = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // --- ১. সব প্রপার্টি লড করার জন্য কুয়েরি ---

  const {data: properties, isLoading: isPropertiesLoading} = useQuery({
    queryKey: ['my-properties'], // এটি দিয়ে ডাটা জমা থাকে
    queryFn: async () => {
      // 
      const response = await axios.get("http://localhost:4000/api/property/my-property", {
        headers: {
          Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`, // টোকেন চেক করা হচ্ছে
        },

      });
      return response.data.properties; // সার্ভার থেকে পাওয়া প্রপার্টিজ রিটার্ন করছি
    },
    enabled: !!token, // টোকেন থাকলে তবেই ডাটা আসবে
  })

// Add Property
  const createPropertyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(
        "http://localhost:4000/api/property/add-property",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`, 

          },
        },
      );
      return response.data
    },
    onSuccess: (data) =>{
        toast.success(data.message || "প্রপার্টি সফলভাবে তৈরি করা হয়েছে!")

        // বাড়ি সেভ হওয়ার পর ড্যাশবোর্ডের ডাটা অটোমেটিক রিফ্রেশ করবে
        queryClient.invalidateQueries({queryKey: ['my-properties']})  // লিস্ট রিলোড করবে

        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] }); // ড্যাশবোর্ড আপডেট করবে
    },
    onError: (error: any) =>{
        toast.error(error.response?.data?.message ||  "কিছু একটা ভুল হয়েছে!")
    }
  });

  return {createPropertyMutation, properties, isPropertiesLoading}
};
