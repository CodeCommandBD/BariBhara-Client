import axios from "axios";

const BASE_URL = "http://localhost:4000/api/tenant";

const getAuthHeader = (token: string) => ({
  Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
});

// ১. নতুন ভাড়াটিয়া যোগ করা (ছবি সহ FormData)
export const addTenantApi = async (formData: FormData, token: string) => {
  const res = await axios.post(`${BASE_URL}/add`, formData, {
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ২. সকল ভাড়াটিয়ার তালিকা (Pagination সহ)
export const getAllTenantsApi = async (token: string, page = 1, limit = 9) => {
  const res = await axios.get(`${BASE_URL}/all?page=${page}&limit=${limit}`, {
    headers: getAuthHeader(token),
  });
  return res.data; // { tenants, total, page, totalPages }
};

// ৩. নির্দিষ্ট ইউনিটের ভাড়াটিয়া
export const getTenantByUnitApi = async (unitId: string, token: string) => {
  const res = await axios.get(`${BASE_URL}/unit/${unitId}`, {
    headers: getAuthHeader(token),
  });
  return res.data.tenant;
};

// ৪. ভাড়াটিয়ার তথ্য আপডেট
export const updateTenantApi = async (
  id: string,
  formData: FormData,
  token: string
) => {
  const res = await axios.put(`${BASE_URL}/${id}`, formData, {
    headers: {
      ...getAuthHeader(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// ৫. ভাড়াটিয়া সরানো (ইউনিট খালি করা)
export const vacateTenantApi = async (id: string, token: string) => {
  const res = await axios.patch(`${BASE_URL}/vacate/${id}`, {}, {
    headers: getAuthHeader(token),
  });
  return res.data;
};
