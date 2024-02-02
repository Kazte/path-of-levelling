import { create } from 'zustand';

export const useGuideStore = create((set) => ({
  guide: null,
  setGuide: (guide) => set({ guide })
}));
