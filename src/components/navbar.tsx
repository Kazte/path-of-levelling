import { Archive, Clipboard, Info, Minus, X } from 'lucide-react';
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

export default function Navbar() {
  const handleOnMinize = () => {
    appWindow.minimize();
  };

  const handleOnClose = () => {
    appWindow.close();
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
            <MenubarItem>
              <Archive size={16} className='mr-2' /> Load from LocalStorage
            </MenubarItem>
            <MenubarItem>
              <Clipboard size={16} className='mr-2' /> Load from Clipboard
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
          <Minus />
        </Button>
        <Button
          variant='destructive'
          className='h-1/2 w-1/2'
          size='icon'
          onClick={handleOnClose}
        >
          <X />
        </Button>
      </div>
    </Menubar>
  );
}
