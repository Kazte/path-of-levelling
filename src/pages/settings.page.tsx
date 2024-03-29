import { AppState, useAppStore } from '@/store/app.store';
import { BoxSelect, Check, File } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Menubar } from '@/components/ui/menubar';
import { open } from '@tauri-apps/api/dialog';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '@/store/settings.store';
import { useState } from 'react';

export default function SettingsPage() {
  const navigator = useNavigate();
  const { setAppState } = useAppStore((state) => state);
  const { clientTxtPath, setClientTxtPath } = useSettingsStore(
    (state) => state
  );

  const [clientTxtPathValue, setClientTxtPathValue] = useState(clientTxtPath);

  const handleOnClose = () => {
    navigator('/');
  };

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

  const handleOnTest = () => {
    setAppState(AppState.TEST);
  };

  return (
    <>
      <Menubar
        className='rounded-none border-0 border-b-[2px] px-2 lg:px-4 justify-between h-[35px]'
        data-tauri-drag-region
      >
        <h4 className='select-none' data-tauri-drag-region>
          Settings
        </h4>
        <div className='flex flex-row gap-2 justify-center items-center'>
          <Button className='h-6' size='sm' onClick={handleOnClose}>
            <Check size={20} /> Apply
          </Button>
        </div>
      </Menubar>
      <main className='flex-grow p-2 overflow-y-auto'>
        <section className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <Label>Client.txt Path</Label>
            <div className='flex w-full max-w-sm items-center space-x-2'>
              <Input
                type='text'
                placeholder='Client.txt path'
                value={clientTxtPathValue}
                onChange={(e) => setClientTxtPathValue(e.target.value)}
                onBlur={() => setClientTxtPath(clientTxtPathValue)}
              />
              <Button type='button' onClick={handleSetClientTxt}>
                <File /> Find File
              </Button>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <Label>Display Postiion</Label>
            <div className='flex w-full max-w-sm items-center space-x-2'>
              <Button type='button' onClick={handleOnTest}>
                <BoxSelect /> Set Position
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
