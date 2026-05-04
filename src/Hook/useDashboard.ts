import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const BASE_URL = "http://localhost:4000/api/dashboard";

const getAuthHeader = (token: string) => ({
  Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
});

export const useDashboard = () => {
  const { token } = useAuthStore();

  // ১. মূল স্ট্যাটস (মোট প্রপার্টি, ইউনিট, আয়, বকেয়া, অকুপেন্সি)
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/stats`, { headers: getAuthHeader(token!) });
      return res.data;
    },
    enabled: !!token,
  });

  // ২. গত ৬ মাসের আয়ের ট্রেন্ড
  const { data: revenueData, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["revenue-analytics"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/revenue-analytics`, { headers: getAuthHeader(token!) });
      return res.data.revenueData;
    },
    enabled: !!token,
  });

  // ৩. সাম্প্রতিক ট্রানজেকশন
  const { data: recentTransactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["recent-transactions"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/recent-transactions`, { headers: getAuthHeader(token!) });
      return res.data.transactions;
    },
    enabled: !!token,
  });

  // ৪. লিজ এক্সপায়ারি অ্যালার্ট
  const { data: leaseAlerts, isLoading: isAlertsLoading } = useQuery({
    queryKey: ["lease-alerts"],
    queryFn: async () => {
      const res = await axios.get(`${BASE_URL}/lease-alerts`, { headers: getAuthHeader(token!) });
      return res.data.expiringTenants;
    },
    enabled: !!token,
  });

  return {
    stats: statsData?.stats,
    isLoading,
    error,
    revenueData: revenueData ?? [],
    isRevenueLoading,
    recentTransactions: recentTransactions ?? [],
    isTransactionsLoading,
    leaseAlerts: leaseAlerts ?? [],
    isAlertsLoading,
  };
};
