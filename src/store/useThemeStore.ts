import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggleTheme: () => {
        const newDark = !get().isDark;
        set({ isDark: newDark });
        // DOM-এ class প্রয়োগ
        document.documentElement.classList.toggle("dark", newDark);
      },
      setTheme: (dark: boolean) => {
        set({ isDark: dark });
        document.documentElement.classList.toggle("dark", dark);
      },
    }),
    {
      name: "theme-storage",
      // Hydration এর পর DOM sync করা
      onRehydrateStorage: () => (state) => {
        if (state?.isDark) {
          document.documentElement.classList.add("dark");
        }
      },
    }
  )
);
