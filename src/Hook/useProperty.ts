import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useProperty = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const createPropertyMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await axios.post(
        "http://localhost:4000/api/property/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token, // সিকিউরিটির জন্য টোকেন জরুরি

          },
        },
      );
      return response.data
    },
    onSuccess: (data) =>{
        toast.success(data.message || "প্রপার্টি সফলভাবে তৈরি করা হয়েছে!")

        // বাড়ি সেভ হওয়ার পর ড্যাশবোর্ডের ডাটা অটোমেটিক রিফ্রেশ করবে
        queryClient.invalidateQueries({queryKey: ['my-properties']})
    },
    onError: (error: any) =>{
        toast.error(error.response?.data?.message ||  "কিছু একটা ভুল হয়েছে!")
    }
  });

  return {createPropertyMutation}
};
