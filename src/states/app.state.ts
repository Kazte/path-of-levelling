import { AppScanningState, useAppStore } from '@/store/app.store';
import {
  LogicalPosition,
  LogicalSize,
  WebviewWindow,
  appWindow,
  availableMonitors
} from '@tauri-apps/api/window';

import { IState } from '@/hooks/useMachine';
import { invoke } from '@tauri-apps/api';
import { useSettingsStore } from '@/store/settings.store';

const appStates: IState[] = [
  {
    name: 'normal',
    on: {
      enter: async () => {
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
      enter: async () => {
        const { displayPosition } = useSettingsStore.getState();
        const monitors = await availableMonitors();
        const monitorSize = monitors[0].size;

        await appWindow.setPosition(
          new LogicalPosition(displayPosition.x, displayPosition.y)
        );
        await appWindow.setSize(new LogicalSize(480, 120));
        await appWindow.setAlwaysOnTop(true);
        await appWindow.setIgnoreCursorEvents(true);
        await appWindow.setSkipTaskbar(true);
        document.body.classList.add('bg-background/70');

        useAppStore.setState({
          appScanningState: AppScanningState.SCANNING
        });

        invoke('open_poe_window');

        if (useSettingsStore.getState().showLayout) {
          const layoutmapWindow = new WebviewWindow('layoutmap', {
            url: 'index.html/#/layoutmap',
            alwaysOnTop: true,
            resizable: false,
            transparent: true,
            decorations: false
          });

          layoutmapWindow.once('tauri://created', () => {
            layoutmapWindow.setSize(new LogicalSize(424 / 3, 230 / 3));
            layoutmapWindow.setPosition(
              new LogicalPosition(
                0,
                monitorSize.height / 2 - monitorSize.height / 5
              )
            );
          });

          layoutmapWindow.once('tauri://error', function (e) {
            console.log('error creating layoutmap window', e);
          });
        }

        // const isCreatedLayoutWindow = await invoke('open_layout_window');

        // if (isCreatedLayoutWindow) {
        //   const layoutWindow = WebviewWindow.getByLabel('layout-map');

        //   layoutWindow?.setSize(new LogicalSize(424 / 3, 230 / 3));
        //   layoutWindow?.setPosition(
        //     new LogicalPosition(0, monitorSize.height / 2)
        //   );
        // }
      },
      leave: async () => {
        document.body.classList.remove('bg-background/70');
        await appWindow.setSkipTaskbar(false);

        // await invoke('close_layout_window');

        const layoutmapWindow = WebviewWindow.getByLabel('layoutmap');

        if (layoutmapWindow) {
          layoutmapWindow.close();
        }

        const monitors = await availableMonitors();
        const monitorSize = monitors[0].size;

        appWindow.setPosition(
          new LogicalPosition(
            monitorSize.width / 2 - 400,
            monitorSize.height / 2 - 300
          )
        );

        await appWindow.setFocus();
      }
    }
  },
  {
    name: 'test',
    on: {
      enter: async () => {
        const { displayPosition } = useSettingsStore.getState();

        await appWindow.setPosition(
          new LogicalPosition(displayPosition.x, displayPosition.y)
        );

        await appWindow.setSize(new LogicalSize(480, 120));
        await appWindow.setAlwaysOnTop(true);
        await appWindow.setIgnoreCursorEvents(false);
        await appWindow.setSkipTaskbar(true);
        document.body.classList.add('bg-background/70');
        document.body.classList.add('border-2');
        document.body.classList.add('border-primary');
        document.body.classList.add('border-dashed');

        invoke('open_poe_window').then((response) => {
          console.log(response);
        });
      },
      leave: async () => {
        document.body.classList.remove('bg-background/70');
        document.body.classList.remove('border-2');
        document.body.classList.remove('border-primary');
        document.body.classList.remove('border-dashed');
        await appWindow.setSkipTaskbar(false);
        await appWindow.setFocus();

        const monitors = await availableMonitors();
        const monitorSize = monitors[0].size;

        appWindow.setPosition(
          new LogicalPosition(
            monitorSize.width / 2 - 400,
            monitorSize.height / 2 - 300
          )
        );
      }
    }
  }
];

export default appStates;
