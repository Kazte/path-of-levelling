import { IGuideImport } from '@/interfaces/guide-import.interface';
import { create } from 'zustand';

interface States {
  guide: IGuideImport | null;
}

interface Actions {
  setGuide: (guide: IGuideImport) => void;
}

export const useGuideStore = create<States & Actions>((set) => ({
  guide: null,
  setGuide: (guide) => set({ guide })
}));
