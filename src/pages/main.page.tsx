import { AppScanningState, AppState, useAppStore } from '@/store/app.store';
import {
  LogicalPosition,
  LogicalSize,
  appWindow
} from '@tauri-apps/api/window';
import {
  isRegistered,
  register,
  unregister
} from '@tauri-apps/api/globalShortcut';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { IN_GAME_WINDOW_SIZE } from '@/utilities/constants';
import InGameScreen from '@/components/in-game-screen';
import LevellingGuideMain from '@/components/levelling-guide-main';
import MainScreen from '@/components/main-screen';
import Navbar from '@/components/navbar';
import { Switch } from 'ktools-r';
import TestScreen from '@/components/test-screen';
import { invoke } from '@tauri-apps/api';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/api/dialog';
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
  const { clientTxtPath, setClientTxtPath, displayPosition, growDirection } =
    useSettingsStore((state) => state);

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

    ir = await isRegistered('CmdOrCtrl+Shift+Alt+ArrowUp');
    console.log('CmdOrCtrl+Shift+Alt+ArrowUp', ir);
    if (!ir) {
      await register('CmdOrCtrl+Shift+Alt+ArrowUp', () => {
        if (appState === AppState.IN_GAME) {
          window.scrollBy({
            top: -10,
            behavior: 'smooth'
          });
        }
      });
    }

    ir = await isRegistered('CmdOrCtrl+Shift+Alt+ArrowDown');
    console.log('CmdOrCtrl+Shift+Alt+ArrowDown', ir);
    if (!ir) {
      await register('CmdOrCtrl+Shift+Alt+ArrowDown', () => {
        if (appState === AppState.IN_GAME) {
          window.scrollBy({
            top: 10,
            behavior: 'smooth'
          });
        }
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

    const adjustWindow = async () => {
      if (appState === AppState.IN_GAME) {
        // adjust window size to fit the whole text height of the current step
        const element = document.getElementById(`step-${currentStep}`);

        if (element) {
          const rect = element.getBoundingClientRect();
          const height = rect.top + rect.height + 30;
          const currentPosition = displayPosition;
          const gw = growDirection;
          if (height >= IN_GAME_WINDOW_SIZE.height) {
            await appWindow.setSize(new LogicalSize(480, height));

            // move position to always have the bottom in the same place

            if (gw === 'up') {
              await appWindow.setPosition(
                new LogicalPosition(
                  currentPosition.x,
                  currentPosition.y - (height - IN_GAME_WINDOW_SIZE.height)
                )
              );
            } else if (gw === 'down') {
              await appWindow.setPosition(
                new LogicalPosition(currentPosition.x, currentPosition.y)
              );
            }
          } else {
            await appWindow.setSize(
              new LogicalSize(
                IN_GAME_WINDOW_SIZE.width,
                IN_GAME_WINDOW_SIZE.height
              )
            );
            await appWindow.setPosition(
              new LogicalPosition(currentPosition.x, currentPosition.y)
            );
          }
        }
      }
    };

    adjustWindow();
  }, [currentStep]);

  const [_clientTxtPathValue, setClientTxtPathValue] = useState(clientTxtPath);

  const handleSetClientTxt = async () => {
    const selection = await open({
      multiple: false,
      filters: [{ name: 'Text', extensions: ['txt'] }]
    });

    if (selection) {
      setClientTxtPath(selection as string);
      setClientTxtPathValue(selection as string);
    }
  };

  return (
    <Switch>
      <Switch.Case condition={clientTxtPath === ''}>
        <Navbar />

        <div className='flex-grow p-2 text-center flex flex-col justify-center items-center h-full gap-8'>
          <h2 className='justify-self-stretch underline'>No client.txt path</h2>
          <h3>Set client.txt path before starting</h3>
          <div className='flex flex-col'>
            <em>Usually located in </em>
            <em>
              C:/Program Files (x86)/Grinding Gear Games/Path of
              Exile/logs/Client.txt
            </em>
          </div>
          <Button onClick={handleSetClientTxt}>Set Client Path</Button>
        </div>
      </Switch.Case>
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
