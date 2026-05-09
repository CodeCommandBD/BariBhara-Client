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

// ৩. সব ইনভয়েস — স্ট্যাটাস / মাস / বছর ফিল্টার সহ Pagination
export const getPendingInvoicesApi = async (
  token: string,
  page = 1,
  limit = 10,
  status = "all",
  month = "",
  year = ""
) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), status });
  if (month) params.append("month", month);
  if (year) params.append("year", year);
  const res = await axios.get(`${BASE_URL}/pending?${params.toString()}`, {
    headers: getAuthHeader(token),
  });
  return res.data; // { invoices, total, page, totalPages, stats }
};

// ৪. ট্রানজেকশন হিস্টোরি
export const getInvoiceTransactionsApi = async (invoiceId: string, token: string) => {
  const res = await axios.get(`${BASE_URL}/transactions/${invoiceId}`, {
    headers: getAuthHeader(token),
  });
  return res.data.transactions;
};

// ৫. ইনভয়েস এডিট করা
export const editInvoiceApi = async (invoiceId: string, data: any, token: string) => {
  const res = await axios.put(`${BASE_URL}/edit/${invoiceId}`, data, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

// ৬. ইনভয়েস ডিলিট করা
export const deleteInvoiceApi = async (invoiceId: string, token: string) => {
  const res = await axios.delete(`${BASE_URL}/delete/${invoiceId}`, {
    headers: getAuthHeader(token),
  });
  return res.data;
};

// ৭. PDF ডাউনলোড URL
export const getInvoicePdfUrl = (invoiceId: string) =>
  `${BASE_URL}/invoice/${invoiceId}/pdf`;
