import { create } from 'zustand';

const useAuthModal = create((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));

export default useAuthModal; 