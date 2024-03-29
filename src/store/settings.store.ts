import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface States {
  clientTxtPath: string;
}

interface Actions {
  setClientTxtPath: (clientTxtPath: string) => void;
}

export const useSettingsStore = create<States & Actions>()(
  persist(
    (set) => {
      return {
        clientTxtPath:
          'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt',
        setClientTxtPath: (clientTxtPath) => set({ clientTxtPath })
      };
    },
    {
      name: 'settings'
    }
  )
);
