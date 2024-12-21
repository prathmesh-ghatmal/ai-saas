import { create } from "zustand";

interface useProcessingModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProcessingModal = create<useProcessingModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
