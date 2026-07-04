import { create } from 'zustand';

interface UIState {
  mobileMenuOpen: boolean;
  searchModalOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  mobileMenuOpen: false,
  searchModalOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  setSearchModalOpen: (open) => set({ searchModalOpen: open }),
}));
