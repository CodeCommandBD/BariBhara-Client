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

// ৬. Auto Renew টগল করা
export const toggleAutoRenewApi = async (id: string, autoRenew: boolean, token: string) => {
  const res = await axios.patch(`${BASE_URL}/${id}/auto-renew`, { autoRenew }, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

// ৭. ম্যানুয়াল রিনিউ (মেয়াদ বাড়ানো)
export const renewLeaseApi = async (id: string, newEndDate: string, token: string) => {
  const res = await axios.post(`${BASE_URL}/${id}/renew-lease`, { newEndDate }, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

// ৮. ডিজিটাল চুক্তিপত্র জেনারেট করা
export const generateAgreementApi = async (id: string, token: string) => {
  const res = await axios.post(`${BASE_URL}/${id}/generate-agreement`, {}, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

// ৯. চুক্তিপত্রে স্বাক্ষর করা (ভাড়াটিয়া পোর্টাল থেকে)
export const signAgreementApi = async (signatureData: string, token: string) => {
  const res = await axios.post(`${BASE_URL}/sign-agreement`, { signatureData }, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

export const deleteAgreementApi = async (id: string, token: string) => {
  const res = await axios.delete(`${BASE_URL}/${id}/agreement`, {
    headers: getAuthHeader(token),
  });
  return res.data;
};
