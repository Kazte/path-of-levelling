import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';
import { AppState, useAppStore } from '@/store/app.store';
import {
  Bug,
  Clipboard,
  Info,
  Minus,
  PencilRuler,
  Play,
  Settings,
  Trash,
  X
} from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from './ui/menubar';
import { clearGuide, setNewGuide } from '@/utilities/guide.utilities';
import { useEffect, useState } from 'react';

import { Button } from './ui/button';
import { appWindow } from '@tauri-apps/api/window';
import { cn } from '@/lib/utils';
import { getVersion } from '@tauri-apps/api/app';
import { installUpdate } from '@tauri-apps/api/updater';
import logo from '@/assets/icon.ico';
import { open } from '@tauri-apps/api/shell';
import { readText } from '@tauri-apps/api/clipboard';
import { relaunch } from '@tauri-apps/api/process';
import { useGuideStore } from '@/store/guide.store';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ui/use-toast';

export default function Navbar() {
  const navigator = useNavigate();
  const { setAppState, newUpdateAvailable } = useAppStore((state) => state);
  const { guide } = useGuideStore((state) => state);

  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [openOverrideDialog, setOpenOverrideDialog] = useState(false);
  const [appVersion, setAppVersion] = useState<string | null>();

  const { toast } = useToast();

  const startInstall = () => {
    toast({
      title: 'Installing update...',
      description:
        'Please wait...\nThis program will restart automatically after the update is installed.'
    });
    installUpdate().then(relaunch);
  };

  useEffect(() => {
    getVersion().then((version) => {
      setAppVersion(version);
    });
  }, []);

  const handleOnMinize = () => {
    appWindow.minimize();
  };

  const handleOnClose = () => {
    appWindow.close();
  };

  const handleOnCopyFromClipboard = async () => {
    if (!guide) {
      const clipboardText = await readText();

      if (!clipboardText) return;

      setNewGuide(clipboardText);
    } else {
      setOpenOverrideDialog(true);
    }
  };

  const handleOnClearGuide = () => {
    clearGuide();
  };

  const handleOnOverrideGuide = async () => {
    clearGuide();

    const clipboardText = await readText();

    if (!clipboardText) return;

    setNewGuide(clipboardText);
  };

  const handleOnStart = () => {
    setAppState(AppState.IN_GAME);
  };

  return (
    <>
      <AlertDialog open={openClearDialog} onOpenChange={setOpenClearDialog}>
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogTitle>
            Are you sure you want to clear the guide?
          </AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleOnClearGuide}>
              Yes
            </AlertDialogAction>
            <AlertDialogCancel>No</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={openOverrideDialog}
        onOpenChange={setOpenOverrideDialog}
      >
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogTitle>
            Are you sure you want to override the current guide?
          </AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleOnOverrideGuide}>
              Yes
            </AlertDialogAction>
            <AlertDialogCancel>No</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Menubar
        className='rounded-none border-0 border-b-[2px] px-2 lg:px-4 justify-between h-[35px]'
        data-tauri-drag-region
      >
        <div className='flex flex-row gap-4 justify-center items-center'>
          <MenubarMenu>
            <MenubarTrigger className='text-sm h-1/2 hover:bg-accent transition-opacity data-[state=open]:bg-transparent data-[highlighted]:bg-transparent gap-1'>
              <img
                src={logo}
                className='select-none w-5 h-5'
                data-tauri-drag-region
              />
              Path of Levelling
            </MenubarTrigger>

            <MenubarContent>
              <MenubarItem asChild>
                <a
                  href='https://github.com/Kazte/path-of-levelling'
                  target='_blank'
                  rel='noreferrer'
                >
                  <Info size={16} className='mr-2' />
                  About Path of Levelling
                </a>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleOnCopyFromClipboard}>
                <Clipboard size={16} className='mr-2' /> Load from Clipboard
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onClick={() => setOpenClearDialog(true)}
                disabled={guide === null}
                className='data-[highlighted]:bg-destructive'
              >
                <Trash size={16} className='mr-2' /> Clear Guide
              </MenubarItem>
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
              <MenubarItem
                onClick={() => {
                  navigator('/settings');
                }}
              >
                <Settings size={16} className='mr-2' />
                Settings
              </MenubarItem>
              <MenubarItem
                onClick={async () => {
                  await open(
                    'https://github.com/kazte/path-of-levelling/issues/new?title=[BUG]%20&labels=bug&body=**Describe%20the%20bug**%0A%0A**To%20Reproduce**%0A1.%20Step%201%0A2.%20Step%202%0A%0A**Expected%20behavior**%0A%0A**Screenshots**%0A%0A**Additional%20context**%0A'
                  );
                }}
              >
                <Bug size={16} className='mr-2' />
                Report Bug
              </MenubarItem>
              <MenubarItem
                onClick={handleOnClose}
                className='data-[highlighted]:bg-destructive'
              >
                <X size={16} className='mr-2' />
                Quit
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <span
            className='text-[0.6rem] opacity-45 select-none self-end justify-self-start'
            data-tauri-drag-region
          >
            Version {appVersion}
          </span>
          {newUpdateAvailable && (
            <Button
              variant='secondary'
              onClick={startInstall}
              className={cn(
                'h-6',
                'bg-green-700 text-foreground hover:bg-opacity-70 hover:bg-green-700'
              )}
            >
              Install Update
            </Button>
          )}
        </div>
        <div className='flex flex-row gap-2 justify-center items-center'>
          <Button
            variant='secondary'
            onClick={handleOnStart}
            className={cn(
              'h-6 w-20',
              'bg-green-700 text-foreground hover:bg-opacity-70 hover:bg-green-700'
            )}
            size='icon'
            disabled={guide === null}
          >
            <Play size={20} className='mr-2' />
            Start
          </Button>

          <Button
            variant='secondary'
            className='h-6 w-6'
            size='icon'
            onClick={handleOnMinize}
          >
            <Minus size={20} />
          </Button>
          <Button
            variant='destructive'
            className='h-6 w-6'
            size='icon'
            onClick={handleOnClose}
          >
            <X size={20} />
          </Button>
        </div>
      </Menubar>
    </>
  );
}
