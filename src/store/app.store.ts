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
}

interface Actions {
  setAppState: (appState: AppState) => void;
  setAppScanningState: (appScanningState: AppScanningState) => void;
}

export const useAppStore = create<States & Actions>((set) => ({
  appState: AppState.NORMAL,
  appScanningState: AppScanningState.NOT_SCANNING,
  setAppState: (appState: AppState) => set({ appState }),
  setAppScanningState: (appScanningState: AppScanningState) =>
    set({ appScanningState })
}));
