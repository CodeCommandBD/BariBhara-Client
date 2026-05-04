import axios from "axios";

const BASE_URL = "http://localhost:4000/api/reports";

const getAuthHeader = (token: string) => ({
  Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
});

export const getFinancialReportApi = async (
  params: { startDate?: string; endDate?: string; propertyId?: string },
  token: string
) => {
  const res = await axios.get(`${BASE_URL}/financial`, {
    headers: getAuthHeader(token),
    params,
  });
  return res.data.report;
};

export const getPropertiesForFilterApi = async (token: string) => {
  const res = await axios.get(`${BASE_URL}/properties`, { headers: getAuthHeader(token) });
  return res.data.properties;
};
