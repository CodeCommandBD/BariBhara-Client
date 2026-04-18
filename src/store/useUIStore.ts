import { create } from "zustand";

interface UIStore {
  isAddPropertyModalOpen: boolean;
  openAddPropertyModal: () => void;
  closeAddPropertyModal: () => void;
}
export const useUIStore = create<UIStore>((set) => ({
  isAddPropertyModalOpen: false, // ডিফল্টভাবে মডালটি বন্ধ থাকবে
  openAddPropertyModal: () => set({ isAddPropertyModalOpen: true }), // মডাল ওপেন করার ফাংশন
  closeAddPropertyModal: () => set({ isAddPropertyModalOpen: false }), // মডাল বন্ধ করার ফাংশন
}));