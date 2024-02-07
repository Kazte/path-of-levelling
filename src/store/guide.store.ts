import { IGuide } from '@/interfaces/guide.interface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface States {
  guide: IGuide | null;
  currentStep: number | null;
}

interface Actions {
  setGuide: (guide: IGuide) => void;
  setCurrentStep: (step: number) => void;
  setAddCurrentStep: () => void;
  setSubtractCurrentStep: () => void;
}

export const useGuideStore = create<States & Actions>()(
  persist(
    (set) => {
      return {
        guide: null,
        currentStep: null,
        setGuide: (guide) => set({ guide }),
        setCurrentStep: (currentStep) => set({ currentStep }),
        setAddCurrentStep: () =>
          set((state) => ({
            currentStep: state.currentStep ? state.currentStep + 1 : null
          })),
        setSubtractCurrentStep: () =>
          set((state) => ({
            currentStep: state.currentStep ? state.currentStep - 1 : null
          }))
      };
    },
    {
      name: 'guide'
    }
  )
);
