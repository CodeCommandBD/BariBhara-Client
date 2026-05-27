import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TenantNotification {
  _id: string;
  title: string;
  message: string;
  type: "payment" | "maintenance" | "system" | "invoice" | "reminder";
  isRead: boolean;
  link: string;
  createdAt: string;
}

interface TenantNotificationState {
  notifications: TenantNotification[];
  unreadCount: number;
  setNotifications: (notifications: TenantNotification[]) => void;
  addNotification: (notification: TenantNotification) => void;
  markOneRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useTenantNotificationStore = create<TenantNotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.isRead).length,
        }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),
      markOneRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n._id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          unreadCount: 0,
        })),
      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    { name: "tenant-notification-storage" }
  )
);
