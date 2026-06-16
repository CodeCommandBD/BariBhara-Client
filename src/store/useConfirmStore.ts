import { create } from "zustand";

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  openConfirm: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }) => void;
  closeConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  confirmText: "নিশ্চিত করুন",
  cancelText: "বাতিল",
  onConfirm: null,
  openConfirm: ({ title, message, confirmText = "নিশ্চিত করুন", cancelText = "বাতিল", onConfirm }) =>
    set({ isOpen: true, title, message, confirmText, cancelText, onConfirm }),
  closeConfirm: () =>
    set({ isOpen: false, onConfirm: null }),
}));
