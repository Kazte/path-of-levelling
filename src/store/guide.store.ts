import { IGuide } from '@/interfaces/guide.interface';
import { create } from 'zustand';

interface States {
  guide: IGuide | null;
}

interface Actions {
  setGuide: (guide: IGuide) => void;
}

export const useGuideStore = create<States & Actions>((set) => ({
  guide: null,
  setGuide: (guide) => set({ guide })
}));
