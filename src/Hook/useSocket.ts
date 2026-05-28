import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useTenantAuthStore } from "@/store/useTenantAuthStore";
import { useTenantNotificationStore } from "@/store/useTenantNotificationStore";
import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`;

const notificationIcons: Record<string, string> = {
  payment: "💰",
  invoice: "🧾",
  maintenance: "🛠️",
  system: "🔔",
  reminder: "⏰",
};

export const useSocket = () => {
  // ল্যান্ডলর্ড অথ স্টোর
  const { token: landlordToken, user } = useAuthStore() as any;
  // ভাড়াটিয়া অথ স্টোর
  const { token: tenantToken, tenant } = useTenantAuthStore() as any;

  const socketRef = useRef<Socket | null>(null);
  const { addNotification, setNotifications } = useNotificationStore();
  const { addNotification: addTenantNotif, setNotifications: setTenantNotifs } =
    useTenantNotificationStore();

  // =====================================================
  // ল্যান্ডলর্ড সকেট কানেকশন (landlord dashboard)
  // =====================================================
  useEffect(() => {
    if (!landlordToken || !user?._id) return;

    const authHeader = {
      Authorization: landlordToken?.startsWith("Bearer ")
        ? landlordToken
        : `Bearer ${landlordToken}`,
    };

    // পুরনো নোটিফিকেশন লোড
    axios
      .get(`${API_URL}/notifications`, { headers: authHeader })
      .then((res) => { if (res.data.success) setNotifications(res.data.notifications); })
      .catch(() => {});

    const socket = io(SOCKET_URL, {
      query: { userId: user._id },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => console.log("🔌 Landlord Socket connected:", socket.id));

    socket.on("new_notification", (notification) => {
      addNotification(notification);
      const icon = notificationIcons[notification.type] ?? "🔔";
      toast(notification.title, {
        description: notification.message,
        icon,
        duration: 5000,
        action: notification.link
          ? { label: "দেখুন", onClick: () => (window.location.href = notification.link) }
          : undefined,
      });
    });

    socket.on("subscription_status_updated", ({ status, plan }) => {
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setAuth(
          { ...currentUser, subscriptionStatus: status, subscriptionPlan: plan },
          landlordToken
        );
      }
    });

    socket.on("disconnect", () => console.log("❌ Landlord socket disconnected"));
    socket.on("connect_error", (err) => console.warn("Socket error:", err.message));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [landlordToken, user?._id]);

  // =====================================================
  // ভাড়াটিয়া সকেট কানেকশন (tenant portal)
  // =====================================================
  useEffect(() => {
    if (!tenantToken || !tenant?._id) return;

    const authHeader = {
      Authorization: tenantToken?.startsWith("Bearer ")
        ? tenantToken
        : `Bearer ${tenantToken}`,
    };

    // পুরনো টেন্যান্ট নোটিফিকেশন লোড
    axios
      .get(`${API_URL}/tenant-portal/notifications`, { headers: authHeader })
      .then((res) => { if (res.data.success) setTenantNotifs(res.data.notifications); })
      .catch(() => {});

    const socket = io(SOCKET_URL, {
      query: { tenantId: tenant._id },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => console.log("🔌 Tenant Socket connected:", socket.id));

    socket.on("new_tenant_notification", (notification) => {
      addTenantNotif(notification);
      const icon = notificationIcons[notification.type] ?? "🔔";
      toast(notification.title, {
        description: notification.message,
        icon,
        duration: 6000,
        action: notification.link
          ? { label: "দেখুন", onClick: () => (window.location.href = notification.link) }
          : undefined,
      });
    });

    socket.on("disconnect", () => console.log("❌ Tenant socket disconnected"));

    return () => {
      socket.disconnect();
    };
  }, [tenantToken, tenant?._id]);

  return { socket: socketRef.current };
};

