import { AlignCenterHorizontal, AlignCenterVertical } from 'lucide-react';
import { Button } from './ui/button';
import { AppState, useAppStore } from '@/store/app.store';
import { saveLocalStorage } from '@/utilities/save-localstorage';
import {
  appWindow,
  availableMonitors,
  LogicalPosition
} from '@tauri-apps/api/window';

export default function TestScreen() {
  const { setAppState } = useAppStore((state) => state);

  const handleOnSetPlace = async () => {
    const { x, y } = await appWindow.innerPosition();

    saveLocalStorage('display-position', JSON.stringify({ x, y }));

    setAppState(AppState.NORMAL);
  };

  const handleOnSetPlaceCancel = async () => {
    setAppState(AppState.NORMAL);
  };

  const handleAlignHorizontal = async () => {
    const { y } = await appWindow.innerPosition();
    const { width } = await appWindow.innerSize();

    const monitors = await availableMonitors();
    const monitorSize = monitors[0].size;

    appWindow.setPosition(
      new LogicalPosition(monitorSize.width / 2 - width / 2, y)
    );
  };

  const handleAlignVertical = async () => {
    const { x } = await appWindow.innerPosition();
    const { height } = await appWindow.innerSize();
    const monitors = await availableMonitors();
    const monitorSize = monitors[0].size;

    appWindow.setPosition(
      new LogicalPosition(x, monitorSize.height / 2 - height / 2)
    );
  };

  return (
    <section
      data-tauri-drag-region
      className='w-full h-full text-center flex flex-col gap-2 justify-center items-center cursor-move'
    >
      <p className='select-none text-lg' data-tauri-drag-region>
        Drag to set Positon
      </p>
      <div className='flex flex-row gap-2'>
        <Button size='icon' className='size-7' onClick={handleAlignVertical}>
          <AlignCenterHorizontal size={16} />
        </Button>
        <Button size='icon' className='size-7' onClick={handleAlignHorizontal}>
          <AlignCenterVertical size={16} />
        </Button>
      </div>
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
  );
}
