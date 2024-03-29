import { AppScanningState, AppState, useAppStore } from '@/store/app.store';
import {
  getLocalStorage,
  saveLocalStorage
} from '@/utilities/save-localstorage';
import {
  isRegistered,
  register,
  unregister
} from '@tauri-apps/api/globalShortcut';
import { useEffect, useState } from 'react';

import InGameScreen from '@/components/in-game-screen';
import LevellingGuide from '@/components/levelling-guide';
import MainScreen from '@/components/main-screen';
import Navbar from '@/components/navbar';
import { Switch } from 'ktools-r';
import TestScreen from '@/components/test-screen';
import appStates from '@/states/app.state';
import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/api/dialog';
import { useGuideStore } from '@/store/guide.store';
import { useInterval } from '@/hooks/useInterval';
import useMachine from '@/hooks/useMachine';

export default function App() {
  const [areaName, setAreaName] = useState<string>();
  const { transition } = useMachine(appStates, 'normal');

  const {
    guide,
    currentStep,
    setCurrentStep,
    setAddCurrentStep,
    setSubtractCurrentStep
  } = useGuideStore((state) => state);
  const { setAppState, appScanningState, clientTxtPath, setClientTxtPath } =
    useAppStore((state) => state);
  const appState = useAppStore((state) => state.appState);

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

    const clientTxtPath = getLocalStorage('client-txt-path');

    if (clientTxtPath) {
      setClientTxtPath(clientTxtPath);
    } else {
      invoke('check_client_txt', {
        fileLocation: CLIENT_PATH
      }).then(async (response) => {
        if (!response) {
          const selection = await open({
            multiple: false,
            filters: [{ name: 'Text', extensions: ['txt'] }]
          });

          if (selection) {
            setClientTxtPath(selection[0]);
            saveLocalStorage('client-txt-path', selection[0]);
          }
        }
      });
    }

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

    // if (appState === AppState.IN_GAME) {
    if (areaName === guide[currentStep].changeAreaId) {
      setCurrentStep(currentStep + 1);
    }
    // }
  }, [areaName]);

  useEffect(() => {
    if (appState === AppState.NORMAL) {
      // Scroll to current step
      const element = document.getElementById(`step-${currentStep}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [currentStep]);

  useEffect(() => {
    switch (appState) {
      case AppState.NORMAL:
        transition('normal');
        break;
      case AppState.IN_GAME:
        transition('in-game');
        break;
      case AppState.TEST:
        transition('test');

        break;
    }
  }, [appState]);

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
              <LevellingGuide levellingGuide={guide!} />
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
