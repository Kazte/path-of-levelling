import { IState } from '@/hooks/useMachine';
import { useAppStore, AppScanningState } from '@/store/app.store';
import { getLocalStorage } from '@/utilities/save-localstorage';
import { invoke } from '@tauri-apps/api';
import {
  availableMonitors,
  appWindow,
  LogicalPosition,
  LogicalSize
} from '@tauri-apps/api/window';

const appStates: IState[] = [
  {
    name: 'normal',
    on: {
      enter: async () => {
        const monitors = await availableMonitors();
        const monitorSize = monitors[0].size;

        appWindow.setPosition(
          new LogicalPosition(
            monitorSize.width / 2 - 400,
            monitorSize.height / 2 - 300
          )
        );

        appWindow.setSize(new LogicalSize(800, 600));
        appWindow.setAlwaysOnTop(false);
        appWindow.setIgnoreCursorEvents(false);

        useAppStore.setState({
          appScanningState: AppScanningState.NOT_SCANNING
        });
      },
      leave: () => {}
    }
  },
  {
    name: 'in-game',
    on: {
      enter: () => {
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

        useAppStore.setState({
          appScanningState: AppScanningState.SCANNING
        });
        // appWindow.hide();
        invoke('open_poe_window').then((response) => {
          console.log(response);
        });
      },
      leave: () => {
        document.body.classList.remove('bg-background/70');
      }
    }
  },
  {
    name: 'test',
    on: {
      enter: () => {
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

        invoke('open_poe_window').then((response) => {
          console.log(response);
        });
      },
      leave: () => {
        document.body.classList.remove('bg-background/70');
        document.body.classList.remove('border-2');
        document.body.classList.remove('border-primary');
        document.body.classList.remove('border-dashed');
      }
    }
  }
];

export default appStates;
