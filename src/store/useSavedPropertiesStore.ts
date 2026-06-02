import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface PublicProperty {
  _id: string;
  name: string;
  location: string;
  rent?: number;
  minRent?: number;
  maxRent?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  description?: string;
  contactNumber?: string;
  images?: string[];
  // Unit-specific fields (when saving a unit instead of a property)
  propertyId?: string;
  unitName?: string;
  type?: string;
  owner?: {
    fullName: string;
    phoneNumber: string;
    email: string;
    isVerified?: string;
  };
  units?: any[];
  availableUnits?: number;
}

interface SavedPropertiesState {
  savedProperties: PublicProperty[];
  toggleSave: (property: PublicProperty) => void;
  isSaved: (id: string) => boolean;
  clearAll: () => void;
}

export const useSavedPropertiesStore = create<SavedPropertiesState>()(
  persist(
    (set, get) => ({
      savedProperties: [],

      toggleSave: (property) => {
        const currentSaved = get().savedProperties;
        const isAlreadySaved = currentSaved.some((p) => p._id === property._id);

        if (isAlreadySaved) {
          set({
            savedProperties: currentSaved.filter((p) => p._id !== property._id),
          });
          toast.success("পছন্দের তালিকা থেকে রিমুভ করা হয়েছে");
        } else {
          set({
            savedProperties: [...currentSaved, property],
          });
          toast.success("❤️ পছন্দের তালিকায় যোগ করা হয়েছে");
        }
      },

      isSaved: (id) => {
        return get().savedProperties.some((p) => p._id === id);
      },

      clearAll: () => {
        set({ savedProperties: [] });
        toast.success("পছন্দের তালিকা ক্লিয়ার করা হয়েছে");
      },
    }),
    {
      name: "baribhara-saved-properties", // Local storage key name
    }
  )
);
