import { AppScanningState, AppState, useAppStore } from '@/store/app.store';
import {
  isRegistered,
  register,
  unregister
} from '@tauri-apps/api/globalShortcut';
import { useEffect, useState } from 'react';

import InGameScreen from '@/components/in-game-screen';
import LevellingGuideMain from '@/components/levelling-guide-main';
import MainScreen from '@/components/main-screen';
import Navbar from '@/components/navbar';
import { Switch } from 'ktools-r';
import TestScreen from '@/components/test-screen';
import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { useGuideStore } from '@/store/guide.store';
import { useInterval } from '@/hooks/useInterval';
import { useSettingsStore } from '@/store/settings.store';

export default function MainPage() {
  const [areaName, setAreaName] = useState<string>();

  const {
    guide,
    currentStep,
    setCurrentStep,
    setAddCurrentStep,
    setSubtractCurrentStep,
    setCurrentArea
  } = useGuideStore((state) => state);
  const { setAppState, appScanningState } = useAppStore((state) => state);
  const appState = useAppStore((state) => state.appState);
  const { clientTxtPath } = useSettingsStore((state) => state);

  const CLIENT_PATH = clientTxtPath;

  useInterval(async () => {
    if (appScanningState === AppScanningState.NOT_SCANNING) return;

    try {
      const response: any = await invoke('get_area_name', {
        fileLocation: CLIENT_PATH
      });
      setAreaName(response);
    } catch (e: any) {
      setAreaName('');
    }
  }, 1000);

  //#region Shortcuts
  useEffect(() => {
    registerShortcuts();

    return () => {
      unregister('CmdOrCtrl+Shift+Alt+F12');
      unregister('CmdOrCtrl+Shift+Alt+PageUp');
      unregister('CmdOrCtrl+Shift+Alt+PageDown');
    };
  }, []);

  const registerShortcuts = async () => {
    let ir: boolean = await isRegistered('CmdOrCtrl+Shift+Alt+F12');

    console.log('CmdOrCtrl+Shift+Alt+F12', ir);
    if (!ir) {
      await register('CmdOrCtrl+Shift+Alt+F12', () => {
        setAppState(AppState.NORMAL);
      });
    }

    ir = await isRegistered('CmdOrCtrl+Shift+Alt+ArrowRight');
    console.log('CmdOrCtrl+Shift+Alt+ArrowRight', ir);
    if (!ir) {
      await register('CmdOrCtrl+Shift+Alt+ArrowRight  ', () => {
        if (currentStep === null) return;
        setAddCurrentStep();
      });
    }

    ir = await isRegistered('CmdOrCtrl+Shift+Alt+ArrowLeft');
    console.log('CmdOrCtrl+Shift+Alt+ArrowLeft', ir);
    if (!ir) {
      // TODO: Change to arrows
      await register('CmdOrCtrl+Shift+Alt+ArrowLeft', () => {
        if (currentStep === null) return;
        setSubtractCurrentStep();
      });
    }
  };
  //#endregion

  useEffect(() => {
    listen('showWindow', (event) => {
      console.log('showWindow', event);
      setAppState(AppState.NORMAL);
    });
  }, []);

  useEffect(() => {
    if (guide === null || currentStep === null) return;

    setCurrentArea(areaName || '');

    // if (appState === AppState.IN_GAME) {
    if (areaName === guide[currentStep].changeAreaId) {
      setCurrentStep(currentStep + 1);
    }
    // }
  }, [areaName]);

  useEffect(() => {
    if (appState === AppState.NORMAL && currentStep !== null) {
      // Scroll to current step
      const element = document.getElementById(`step-${currentStep}`);

      if (element) {
        element.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
          inline: 'center'
        });
      }
    }
  }, [currentStep]);

  return (
    <Switch>
      <Switch.Case condition={appState === AppState.TEST}>
        <TestScreen />
      </Switch.Case>
      <Switch.Case condition={appState === AppState.IN_GAME}>
        <InGameScreen />
      </Switch.Case>
      <Switch.Default>
        <Navbar />
        <main className='flex-grow p-2 overflow-y-auto'>
          <Switch>
            <Switch.Case condition={!!guide}>
              <LevellingGuideMain levellingGuide={guide!} />
            </Switch.Case>
            <Switch.Default>
              <MainScreen />
            </Switch.Default>
          </Switch>
        </main>
      </Switch.Default>
    </Switch>
  );
}
