import axios from "axios";

const BASE_URL = "http://localhost:4000/api/expense";

const getAuthHeader = (token: string) => ({
  Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
});

export const addExpenseApi = async (data: any, token: string) => {
  const res = await axios.post(`${BASE_URL}/add`, data, { headers: getAuthHeader(token) });
  return res.data;
};

export const getExpensesApi = async (params: { propertyId?: string; startDate?: string; endDate?: string }, token: string) => {
  const res = await axios.get(`${BASE_URL}/all`, {
    headers: getAuthHeader(token),
    params,
  });
  return res.data;
};

export const deleteExpenseApi = async (id: string, token: string) => {
  const res = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader(token) });
  return res.data;
};
