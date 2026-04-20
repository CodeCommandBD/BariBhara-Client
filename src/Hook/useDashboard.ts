import { useQuery } from "@tanstack/react-query"; // ডাটা ফেচিং এবং ক্যাশিং ম্যানেজ করার জন্য
import axios from "axios"; // HTTP request পাঠানোর জন্য
import { useAuthStore } from "../store/useAuthStore"; // আমাদের বানানো অথেন্টিকেশন স্টোর থেকে টোকেন নিতে

// এটি আমাদের কাস্টম হুক যা ড্যাশবোর্ডের সব তথ্য এনে দেবে
export const useDashboard = () => {
  // ১. লগইন করা ইউজারের সিকিউরিটি টোকেনটি স্টোর থেকে নিচ্ছি
  const { token } = useAuthStore();

  //২. TanStack Query ব্যবহার করে ডাটা ফেচিং করছি
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-stats"], // এই কী (key) ব্যবহার করে React Query ডাটা ক্যাশ করবে
    queryFn: async () => {
      // এই ফাংশনটি আসলে ডাটা নিয়ে আসবে
      const response = await axios.get("http://localhost:4000/api/dashboard/stats", {
        // 3. মাস্ট বি Bearer টোকেন পাঠাতে হবে, অন্যথায় ব্যাকএন্ড ৪০১ এরর দেবে
        headers: {
          // আমরা চেক করে নিচ্ছি টোকেনের শুরুতে Bearer আছে কি না
          Authorization: token?.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      });
      return response.data; // API থেকে পাওয়া ডাটা রিটার্ন করছি
    },
    enabled: !!token, // টোকেন থাকলেই কেবল এই কোয়েরি চলবে
    // ৭. যদি এপিআই ফেইল করে তবে ৩ বার চেষ্টা করবে (এটি রিঅ্যাক্ট কোয়েরির ডিফল্ট বিহেভিয়ার)
    retry: 3,
  });

  // ৩. ডাটা লোডিং, এরর এবং মূল ডাটা রিটার্ন করছি
  return { stats, isLoading, error };
};
