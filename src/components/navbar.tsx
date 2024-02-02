import {
  Archive,
  Clipboard,
  Info,
  Minus,
  PencilRuler,
  Trash,
  X
} from 'lucide-react';
import { appWindow } from '@tauri-apps/api/window';

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator
} from './ui/menubar';
import { Button } from './ui/button';
import { readText } from '@tauri-apps/api/clipboard';
import { clearGuide, setNewGuide } from '@/utilities/guide.utilities';
import { getGuide } from '@/utilities/save-guide';

export default function Navbar() {
  const handleOnMinize = () => {
    appWindow.minimize();
  };

  const handleOnClose = () => {
    appWindow.close();
  };

  const handleOnCopyFromClipboard = async () => {
    const clipboardText = await readText();

    if (!clipboardText) return;

    setNewGuide(clipboardText);
  };

  const handleOnCopyFromLocalStorage = () => {
    const localStorageGuideText = getGuide();

    if (!localStorageGuideText) return;

    setNewGuide(localStorageGuideText);
  };

  const handleOnClearGuide = () => {
    clearGuide();
  };

  return (
    <Menubar
      className='rounded-none border-b border-divider px-2 lg:px-4 justify-between h-[35px]'
      data-tauri-drag-region
    >
      <div className='flex flex-row gap-4'>
        <MenubarMenu>
          <MenubarTrigger className='text-sm h-1/2 hover:bg-accent transition-opacity data-[state=open]:bg-transparent data-[highlighted]:bg-transparent'>
            PoE Guides
          </MenubarTrigger>

          <MenubarContent>
            <MenubarItem asChild>
              <a
                href='https://github.com/Kazte/poe-guides'
                target='_blank'
                rel='noreferrer'
              >
                <Info size={16} className='mr-2' />
                About PoE Guides
              </a>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleOnCopyFromLocalStorage}>
              <Archive size={16} className='mr-2' /> Load from LocalStorage
            </MenubarItem>
            <MenubarItem onClick={handleOnCopyFromClipboard}>
              <Clipboard size={16} className='mr-2' /> Load from Clipboard
            </MenubarItem>
            <MenubarItem onClick={handleOnClearGuide}>
              <Trash size={16} className='mr-2' /> Clear Guide
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem asChild>
              <a
                href='https://heartofphos.github.io/exile-leveling/'
                target='_blank'
                rel='noreferrer'
              >
                <PencilRuler size={16} className='mr-2' />
                Open Exile Leveling
              </a>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleOnClose}>
              <X size={16} className='mr-2' />
              Quit
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
      <div className='flex flex-row gap-2 '>
        <Button
          variant='secondary'
          className='h-1/2 w-1/2'
          size='icon'
          onClick={handleOnMinize}
        >
          <Minus size={20} />
        </Button>
        <Button
          variant='destructive'
          className='h-1/2 w-1/2'
          size='icon'
          onClick={handleOnClose}
        >
          <X size={20} />
        </Button>
      </div>
    </Menubar>
  );
}
