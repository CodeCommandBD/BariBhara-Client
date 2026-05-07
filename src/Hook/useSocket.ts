import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import axios from "axios";

const SOCKET_URL = "http://localhost:4000";
const API_URL = "http://localhost:4000/api/notifications";

// notification type → বাংলা icon ম্যাপিং
const typeIcon: Record<string, string> = {
  payment_received: "💰",
  invoice_generated: "🧾",
  maintenance_update: "🔧",
  lease_expiry: "⏰",
  tenant_added: "👤",
  tenant_vacated: "🏠",
  reminder_sent: "📧",
};

export const useSocket = () => {
  const { token, user } = useAuthStore() as any;
  const socketRef = useRef<Socket | null>(null);
  const { addNotification, setNotifications } = useNotificationStore();

  // ============================================
  // ১. Server থেকে পুরনো notifications লোড
  // ============================================
  const loadNotifications = async () => {
    if (!token) return;
    try {
      const authHeader = {
        Authorization: token?.startsWith("Bearer ") ? token : `Bearer ${token}`,
      };
      const res = await axios.get(API_URL, { headers: authHeader });
      if (res.data.success) {
        setNotifications(res.data.notifications, res.data.unreadCount);
      }
    } catch (err) {
      // Silent fail — not critical
    }
  };

  // ============================================
  // ২. Socket Connect + Event Listeners
  // ============================================
  useEffect(() => {
    if (!token || !user?._id) return;

    // Socket তৈরি করা
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
      // নিজের userId দিয়ে register করা
      socket.emit("register", user._id);
      // পুরনো notifications লোড
      loadNotifications();
    });

    // নতুন notification আসলে
    socket.on("new_notification", (notification) => {
      addNotification(notification);

      // Toast দেখানো
      const icon = typeIcon[notification.type] ?? "🔔";
      toast(notification.title, {
        description: notification.message,
        icon,
        duration: 5000,
        action: notification.meta?.url
          ? {
              label: "দেখুন",
              onClick: () => window.location.href = notification.meta.url,
            }
          : undefined,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user?._id]);

  return { socket: socketRef.current };
};
