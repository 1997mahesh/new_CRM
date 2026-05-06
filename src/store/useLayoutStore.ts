import { create } from "zustand";

interface LayoutState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  activeSection: null,
  setActiveSection: (section) => set({ activeSection: section }),
}));
