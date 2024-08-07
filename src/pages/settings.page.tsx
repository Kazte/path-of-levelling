import { AppState, useAppStore } from '@/store/app.store';
import { BoxSelect, Check, File } from 'lucide-react';
import { GrowDirection, useSettingsStore } from '@/store/settings.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Menubar } from '@/components/ui/menubar';
import { Switch } from '@/components/ui/switch';
import { open } from '@tauri-apps/api/dialog';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SettingsPage() {
  const navigator = useNavigate();
  const { setAppState } = useAppStore((state) => state);
  const settingStore = useSettingsStore((state) => state);

  const [clientTxtPathValue, setClientTxtPathValue] = useState(
    settingStore.clientTxtPath
  );

  const handleOnClose = () => {
    navigator('/');
  };

  const handleSetClientTxt = async () => {
    const selection = await open({
      multiple: false,
      filters: [{ name: 'Text', extensions: ['txt'] }]
    });

    if (selection) {
      settingStore.setClientTxtPath(selection as string);
      setClientTxtPathValue(selection as string);
    }
  };

  const handleOnTest = () => {
    navigator('/');
    setAppState(AppState.TEST);
  };

  const handleSetGrowDirection = (value: GrowDirection) => {
    console.log(value);

    settingStore.setGrowDirection(value);
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
                onBlur={() => settingStore.setClientTxtPath(clientTxtPathValue)}
              />
              <Button type='button' onClick={handleSetClientTxt}>
                <File /> Find File
              </Button>
            </div>
          </div>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col gap-1'>
              <Label>Display Position</Label>
              <div className='flex w-full max-w-sm items-center space-x-2'>
                <Button type='button' onClick={handleOnTest}>
                  <BoxSelect /> Set Position
                </Button>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <Label>Grow Direction</Label>
              <Select
                onValueChange={handleSetGrowDirection}
                value={settingStore.growDirection}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Grow Direction' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='up'>Up</SelectItem>
                  <SelectItem value='down'>Down</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <Label>Show Map Layout</Label>
            <div className='flex w-full max-w-sm items-center space-x-2'>
              <Switch
                title='Show Map Layout'
                defaultChecked={settingStore.showLayout}
                onCheckedChange={(set) => {
                  settingStore.setShowLayout(set);
                }}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
