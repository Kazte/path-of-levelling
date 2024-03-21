import { create } from 'zustand';

export enum AppState {
  NORMAL = 'NORMAL',
  IN_GAME = 'IN_GAME',
  TEST = 'TEST'
}

export enum AppScanningState {
  SCANNING = 'SCANNING',
  NOT_SCANNING = 'NOT_SCANNING'
}

interface States {
  appState: AppState;
  appScanningState: AppScanningState;
  clientTxtPath: string;
}

interface Actions {
  setAppState: (appState: AppState) => void;
  setAppScanningState: (appScanningState: AppScanningState) => void;
  setClientTxtPath: (clientTxtPath: string) => void;
}

export const useAppStore = create<States & Actions>((set) => ({
  appState: AppState.NORMAL,
  appScanningState: AppScanningState.NOT_SCANNING,
  clientTxtPath:
    'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt',
  setAppState: (appState: AppState) => set({ appState }),
  setAppScanningState: (appScanningState: AppScanningState) =>
    set({ appScanningState }),
  setClientTxtPath: (clientTxtPath: string) => set({ clientTxtPath })
}));
