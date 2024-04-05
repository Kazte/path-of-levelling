import { IGuide } from '@/interfaces/guide.interface';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface States {
  guide: IGuide | null;
  currentStep: number;
  currentArea: string;
}

interface Actions {
  setGuide: (guide: IGuide) => void;
  setCurrentStep: (step: number) => void;
  setAddCurrentStep: () => void;
  setSubtractCurrentStep: () => void;
  setCurrentArea: (area: string) => void;
}

export const useGuideStore = create<States & Actions>()(
  persist(
    (set) => {
      return {
        guide: null,
        currentStep: 0,
        currentArea: '',
        setGuide: (guide) => set({ guide }),
        setCurrentStep: (currentStep) =>
          set((state) => {
            if (currentStep < 0) {
              return {
                currentStep: 0
              };
            }

            if (currentStep >= state.guide?.length!) {
              return {
                currentStep: state.guide?.length! - 1
              };
            }

            return {
              currentStep
            };
          }),
        setAddCurrentStep: () =>
          set((state) => ({
            currentStep:
              state.currentStep === state.guide?.length! - 1
                ? state.guide?.length! - 1
                : state.currentStep + 1
          })),
        setSubtractCurrentStep: () =>
          set((state) => ({
            currentStep: state.currentStep === 0 ? 0 : state.currentStep - 1
          })),
        setCurrentArea: (currentArea) => set({ currentArea })
      };
    },
    {
      name: 'guide'
    }
  )
);
