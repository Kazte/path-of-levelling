import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';
import { AppState, useAppStore } from '@/store/app.store';
import {
  BoxSelect,
  Clipboard,
  Info,
  Minus,
  PencilRuler,
  Play,
  Settings,
  StepForward,
  Trash,
  Wrench,
  X
} from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from './ui/menubar';
import { clearGuide, setNewGuide } from '@/utilities/guide.utilities';
import { useEffect, useState } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { appWindow } from '@tauri-apps/api/window';
import { cn } from '@/lib/utils';
import { getVersion } from '@tauri-apps/api/app';
import logo from '@/assets/icon.ico';
import { readText } from '@tauri-apps/api/clipboard';
import { useGuideStore } from '@/store/guide.store';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigator = useNavigate();
  const { setAppState } = useAppStore((state) => state);
  const { guide, setCurrentStep } = useGuideStore((state) => state);

  const [openClearDialog, setOpenClearDialog] = useState(false);
  const [openOverrideDialog, setOpenOverrideDialog] = useState(false);
  const [openGotoStepDialog, setOpenGotoStepDialog] = useState(false);
  const [appVersion, setAppVersion] = useState<string | null>();

  const [gotoStep, setGotoStep] = useState(0);

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

  // const handleOnChangeScanning = () => {
  //   setAppScanningState(
  //     appScanningState === AppScanningState.NOT_SCANNING
  //       ? AppScanningState.SCANNING
  //       : AppScanningState.NOT_SCANNING
  //   );
  // };

  const handleGotoStep = () => {
    setCurrentStep(gotoStep - 1);
    setOpenGotoStepDialog(false);
  };

  const handleOnTest = () => {
    setAppState(AppState.TEST);
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

      <AlertDialog
        open={openGotoStepDialog}
        onOpenChange={setOpenGotoStepDialog}
      >
        <AlertDialogTrigger />
        <AlertDialogContent>
          <AlertDialogTitle>Select the step you want to go to</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              type='number'
              placeholder='Step'
              onChange={(e) => {
                setGotoStep(parseInt(e.target.value));
              }}
            />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleGotoStep}>
              Go to Step
            </AlertDialogAction>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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
              <MenubarSub>
                <MenubarSubTrigger>
                  <Wrench size={16} className='mr-2' />
                  Utilities
                </MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem
                    onClick={() => setOpenGotoStepDialog(true)}
                    disabled={guide === null}
                  >
                    <StepForward size={20} className='mr-2' />
                    Goto
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem
                    onClick={handleOnTest}
                    // className={cn('w-fit h-fit py-[2px] px-[4px]')}
                  >
                    <BoxSelect size={20} className='mr-2' /> Set Display
                  </MenubarItem>
                  {/* <MenubarItem
                    onClick={handleOnChangeScanning}
                    // className={cn(
                    //   'w-fit h-fit py-[2px] px-[4px]',
                    //   appScanningState === AppScanningState.NOT_SCANNING &&
                    //     'bg-red-700 text-foreground hover:bg-opacity-70 hover:bg-red-700',
                    //   appScanningState === AppScanningState.SCANNING &&
                    //     'bg-green-700 text-foreground hover:bg-opacity-70 hover:bg-green-700'
                    // )}
                  >
                    {appScanningState === AppScanningState.NOT_SCANNING ? (
                      <>
                        <EyeOff size={20} className='mr-2' /> Not Scanning
                      </>
                    ) : (
                      <>
                        <Eye size={20} className='mr-2' /> Scanning
                      </>
                    )}
                  </MenubarItem> */}
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem
                // onClick={handleOnClearGuide}
                onClick={() => setOpenClearDialog(true)}
                disabled={guide === null}
                className='data-[highlighted]:bg-destructive'
              >
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
              <MenubarItem
                onClick={() => {
                  navigator('/settings');
                }}
              >
                <Settings size={16} className='mr-2' />
                Settings
              </MenubarItem>
              <MenubarSeparator />
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
