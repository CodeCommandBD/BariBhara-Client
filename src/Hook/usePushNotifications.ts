import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export const usePushNotifications = () => {
  const { token, user } = useAuthStore();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // 1. Register Service Worker (PWA & Push Support)
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js", { type: "module" }) // VitePWA injects module by default if set
        .then((registration) => {
          setSwRegistration(registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  // 2. Function to request notification permission and subscribe
  const subscribeToPush = async () => {
    if (!swRegistration) {
      toast.error("Service Worker is not registered yet.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("নোটিফিকেশন পারমিশন দেওয়া হয়নি।");
        return;
      }

      const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;
      
      // Get VAPID public key from backend
      const vapidRes = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/push/vapid-key`, {
        headers: { Authorization: authHeader }
      });
      const publicVapidKey = vapidRes.data.publicKey;

      if (!publicVapidKey) throw new Error("VAPID key not found");

      // Subscribe to PushManager
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      });

      // Send subscription to backend
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/push/subscribe`,
        subscription,
        { headers: { Authorization: authHeader } }
      );

      setIsSubscribed(true);
      toast.success("পুশ নোটিফিকেশন চালু হয়েছে! 🎉");

    } catch (error: any) {
      console.error("Failed to subscribe to push notifications", error);
      toast.error("পুশ নোটিফিকেশন চালু করতে সমস্যা হয়েছে।");
    }
  };

  return { isSubscribed, subscribeToPush, isSupported: "serviceWorker" in navigator && "PushManager" in window };
};

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
