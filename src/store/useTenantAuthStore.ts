import { create } from "zustand";

interface Tenant {
  _id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  property: string | any;
  unit: string | any;
}

interface TenantAuthStore {
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (tenant: Tenant, token: string) => void;
  logout: () => void;
}

export const useTenantAuthStore = create<TenantAuthStore>((set) => ({
  tenant: JSON.parse(localStorage.getItem("tenantData") || "null"),
  token: localStorage.getItem("tenantToken") || null,
  isAuthenticated: !!localStorage.getItem("tenantToken"),

  login: (tenant, token) => {
    localStorage.setItem("tenantData", JSON.stringify(tenant));
    localStorage.setItem("tenantToken", token);
    set({ tenant, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("tenantData");
    localStorage.removeItem("tenantToken");
    set({ tenant: null, token: null, isAuthenticated: false });
  },
}));
