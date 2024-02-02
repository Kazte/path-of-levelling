import { useEffect, useState } from 'react';
import { useInterval } from './hooks/useInterval';
import { invoke } from '@tauri-apps/api';
import LevellingGuide from './components/levelling-guide';
import { sanitizeGuide } from './utilities/guide.utilities';
import Navbar from './components/navbar';
import { useGuideStore } from './store/guide.store';
import { Switch } from 'ktools-r';
import { AppScanningState, AppState, useAppStore } from './store/app.store';
import {
  LogicalPosition,
  LogicalSize,
  appWindow
} from '@tauri-apps/api/window';
import { Button } from './components/ui/button';
import {
  getLocalStorage,
  saveLocalStorage
} from './utilities/save-localstorage';
import {
  isRegistered,
  register,
  unregister
} from '@tauri-apps/api/globalShortcut';

function App() {
  const [areaName, setAreaName] = useState<string>();

  const { guide } = useGuideStore((state) => state);
  const { setAppState, appScanningState, setAppScanningState } = useAppStore(
    (state) => state
  );
  const appState = useAppStore((state) => state.appState);

  const CLIENT_PATH =
    'C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt';

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

  const _setAppState = () => {
    if (appState === AppState.NORMAL) {
      setAppState(AppState.IN_GAME);
    } else if (appState === AppState.IN_GAME) {
      setAppState(AppState.NORMAL);
    }
  };

  useEffect(() => {
    if (appState === AppState.TEST) {
      // Save last position of the window
      appWindow.innerPosition().then(({ x, y }) => {
        saveLocalStorage('last-window-position', JSON.stringify({ x, y }));

        const { x: displayPositionX, y: displayPositionY } = JSON.parse(
          getLocalStorage('display-position') || '{"x": 0, "y": 0}'
        );

        appWindow.setPosition(
          new LogicalPosition(displayPositionX, displayPositionY)
        );
        appWindow.setSize(new LogicalSize(480, 120));
        appWindow.setAlwaysOnTop(true);
        appWindow.setIgnoreCursorEvents(false);
        document.body.classList.add('bg-background/70');
        document.body.classList.add('border-2');
        document.body.classList.add('border-primary');
        document.body.classList.add('border-dashed');
      });
    } else if (appState === AppState.NORMAL) {
      const lastPosition = JSON.parse(
        getLocalStorage('last-window-position') || '{"x": 100, "y": 100}'
      );

      appWindow.setPosition(
        new LogicalPosition(lastPosition.x, lastPosition.y)
      );
      appWindow.setSize(new LogicalSize(800, 600));
      appWindow.setAlwaysOnTop(false);
      appWindow.setIgnoreCursorEvents(false);
      document.body.classList.remove('bg-background/70');
      document.body.classList.remove('border-2');
      document.body.classList.remove('border-primary');
      document.body.classList.remove('border-dashed');

      setAppScanningState(AppScanningState.NOT_SCANNING);
    } else if (appState === AppState.IN_GAME) {
      appWindow.innerPosition().then(({ x, y }) => {
        saveLocalStorage('last-window-position', JSON.stringify({ x, y }));

        const { x: displayPositionX, y: displayPositionY } = JSON.parse(
          getLocalStorage('display-position') || '{"x": 0, "y": 0}'
        );

        appWindow.setPosition(
          new LogicalPosition(displayPositionX, displayPositionY)
        );
        appWindow.setSize(new LogicalSize(480, 120));
        appWindow.setAlwaysOnTop(true);
        appWindow.setIgnoreCursorEvents(true);
        document.body.classList.add('bg-background/70');

        setAppScanningState(AppScanningState.SCANNING);
      });
    }
    // Binding
    isRegistered('CmdOrCtrl+Shift+Alt+F12').then((isRegistered) => {
      if (!isRegistered) {
        register('CmdOrCtrl+Shift+Alt+F12', () => {
          _setAppState();
        });
      }
    });
    return () => {
      unregister('CmdOrCtrl+Shift+Alt+F12');
    };
  }, [appState]);

  const handleOnSetPlace = async () => {
    const { x, y } = await appWindow.innerPosition();

    saveLocalStorage('display-position', JSON.stringify({ x, y }));

    setAppState(AppState.NORMAL);
  };

  const handleOnSetPlaceCancel = async () => {
    setAppState(AppState.NORMAL);
  };

  return (
    <Switch>
      <Switch.Case condition={appState === AppState.TEST}>
        <section
          data-tauri-drag-region
          className='w-full h-full text-center flex flex-col gap-2 justify-center items-center cursor-move'
        >
          <p className='select-none' data-tauri-drag-region>
            Drag to set Positon
          </p>
          <div className='flex flex-row gap-2'>
            <Button size='sm' onClick={handleOnSetPlace}>
              Set Place
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={handleOnSetPlaceCancel}
            >
              Cancel
            </Button>
          </div>
        </section>
      </Switch.Case>
      <Switch.Case condition={appState === AppState.IN_GAME}>
        <section className='w-full h-full text-center flex flex-col gap-2 justify-center items-center select-none'>
          {areaName && <h2>{areaName}</h2>}
        </section>
      </Switch.Case>
      <Switch.Default>
        <Navbar />
        <main className='flex-grow p-2 overflow-y-auto'>
          <Switch>
            <Switch.Case condition={!!guide}>
              <LevellingGuide levellingGuide={guide} />
            </Switch.Case>
            <Switch.Default>
              <div className='flex-grow p-2'>
                <h2>No guide selected</h2>
              </div>
            </Switch.Default>
          </Switch>
        </main>
      </Switch.Default>
    </Switch>
  );
}

export default App;
