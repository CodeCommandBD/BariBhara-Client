import { create } from "zustand";
import { persist } from "zustand/middleware";
import bn from "@/i18n/bn";
import en from "@/i18n/en";

type Language = "bn" | "en";
type Translations = typeof bn;

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
}

const translations: Record<Language, Translations> = { bn, en };

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "bn",
      setLanguage: (language) => set({ language }),
      t: (key) => {
        const lang = get().language;
        return translations[lang][key] ?? translations["bn"][key] ?? String(key);
      },
    }),
    {
      name: "bari-bhara-language",
    }
  )
);
