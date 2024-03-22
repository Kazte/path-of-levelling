import { BoxSelect, PencilRuler } from 'lucide-react';
import { Button } from './ui/button';
import { invoke } from '@tauri-apps/api';
import { AppState, useAppStore } from '@/store/app.store';

export default function MainScreen() {
  const { setAppState } = useAppStore((state) => state);

  const handleOnTest = () => {
    setAppState(AppState.TEST);

    invoke('open_poe_window').then((response) => {
      console.log(response);
    });
  };

  return (
    <div className='flex-grow p-2 text-center flex flex-col justify-center items-center h-full gap-8'>
      <h2 className='justify-self-stretch underline'>No guide selected</h2>
      <h3>If you haven't selected a place for the display click here:</h3>
      <Button onClick={handleOnTest}>
        <BoxSelect size={20} className='mr-2' /> Set Display
      </Button>

      <Button asChild>
        <a
          href='https://heartofphos.github.io/exile-leveling/'
          target='_blank'
          rel='noreferrer'
        >
          <PencilRuler size={16} className='mr-2' />
          Open Exile Leveling
        </a>
      </Button>
    </div>
  );
}
