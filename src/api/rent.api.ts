import axios from "axios";

const BASE_URL = "http://localhost:4000/api/rent";

const getAuthHeader = (token: string) => ({
  Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
});

// ১. বিল জেনারেট করা
export const generateInvoiceApi = async (data: any, token: string) => {
  const res = await axios.post(`${BASE_URL}/generate`, data, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

// ২. পেমেন্ট কালেক্ট করা
export const collectPaymentApi = async (data: any, token: string) => {
  const res = await axios.post(`${BASE_URL}/collect`, data, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

// ৩. সব বকেয়া ইনভয়েস — Pagination সহ
export const getPendingInvoicesApi = async (token: string, page = 1, limit = 10) => {
  const res = await axios.get(`${BASE_URL}/pending?page=${page}&limit=${limit}`, {
    headers: getAuthHeader(token),
  });
  return res.data; // { invoices, total, page, totalPages }
};

// ৪. ট্রানজেকশন হিস্টোরি
export const getInvoiceTransactionsApi = async (invoiceId: string, token: string) => {
  const res = await axios.get(`${BASE_URL}/transactions/${invoiceId}`, {
    headers: getAuthHeader(token),
  });
  return res.data.transactions;
};
