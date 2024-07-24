import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

export type GrowDirection = 'up' | 'down';

interface States {
  clientTxtPath: string;
  displayPosition: Position;
  showLayout: boolean;
  growDirection: GrowDirection;
}

interface Actions {
  setClientTxtPath: (clientTxtPath: string) => void;
  setDisplayPosition: (displayPosition: Position) => void;
  setShowLayout: (showLayout: boolean) => void;
  setGrowDirection: (growDirection: GrowDirection) => void;
}

export const useSettingsStore = create<States & Actions>()(
  persist(
    (set) => {
      return {
        clientTxtPath:
          'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt',
        displayPosition: { x: 100, y: 100 },
        showLayout: true,
        growDirection: 'up',
        setClientTxtPath: (clientTxtPath) => set({ clientTxtPath }),
        setDisplayPosition: (displayPosition) => set({ displayPosition }),
        setShowLayout: (showLayout) => set({ showLayout }),
        setGrowDirection: (growDirection) => set({ growDirection })
      };
    },
    {
      name: 'settings'
    }
  )
);
