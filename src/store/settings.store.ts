import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface States {
  clientTxtPath: string;
  displayPosition: Position;
  showLayout: boolean;
}

interface Actions {
  setClientTxtPath: (clientTxtPath: string) => void;
  setDisplayPosition: (displayPosition: Position) => void;
  setShowLayout: (showLayout: boolean) => void;
}

export const useSettingsStore = create<States & Actions>()(
  persist(
    (set) => {
      return {
        clientTxtPath:
          'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt',
        displayPosition: { x: 100, y: 100 },
        showLayout: true,
        setClientTxtPath: (clientTxtPath) => set({ clientTxtPath }),
        setDisplayPosition: (displayPosition) => set({ displayPosition }),
        setShowLayout: (showLayout) => set({ showLayout })
      };
    },
    {
      name: 'settings'
    }
  )
);
