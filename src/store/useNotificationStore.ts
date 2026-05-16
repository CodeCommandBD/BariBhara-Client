import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  type: "payment" | "maintenance" | "system" | "invoice";
  isRead: boolean;
  link: string;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  setNotifications: (notifications: AppNotification[]) => void;
  addNotification: (notification: AppNotification) => void;
  markOneRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      setNotifications: (notifications) => 
        set({ 
          notifications, 
          unreadCount: notifications.filter(n => !n.isRead).length 
        }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        })),
      markOneRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map(n => 
            n._id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0
        })),
      clearAll: () =>
        set({ notifications: [], unreadCount: 0 }),
    }),
    { name: "notification-storage" }
  )
);
