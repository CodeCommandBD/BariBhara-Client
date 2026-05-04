import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { getFinancialReportApi, getPropertiesForFilterApi } from "@/api/reports.api";

export const useReports = (filters?: { startDate?: string; endDate?: string; propertyId?: string }) => {
  const { token } = useAuthStore();

  // ফিনান্সিয়াল রিপোর্ট
  const { data: report, isLoading: isReportLoading, refetch } = useQuery({
    queryKey: ["financial-report", filters],
    queryFn: () => getFinancialReportApi(filters ?? {}, token!),
    enabled: !!token,
  });

  // প্রপার্টি ফিল্টার লিস্ট
  const { data: properties = [] } = useQuery({
    queryKey: ["properties-filter"],
    queryFn: () => getPropertiesForFilterApi(token!),
    enabled: !!token,
  });

  return {
    report,
    isReportLoading,
    refetch,
    properties,
  };
};
