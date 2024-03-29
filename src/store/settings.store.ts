import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface States {
  clientTxtPath: string;
  displayPosition: Position;
}

interface Actions {
  setClientTxtPath: (clientTxtPath: string) => void;
  setDisplayPosition: (displayPosition: Position) => void;
}

export const useSettingsStore = create<States & Actions>()(
  persist(
    (set) => {
      return {
        clientTxtPath:
          'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt',
        displayPosition: { x: 100, y: 100 },
        setClientTxtPath: (clientTxtPath) => set({ clientTxtPath }),
        setDisplayPosition: (displayPosition) => set({ displayPosition })
      };
    },
    {
      name: 'settings'
    }
  )
);
