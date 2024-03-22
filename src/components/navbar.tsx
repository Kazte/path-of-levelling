import {
  BoxSelect,
  Clipboard,
  FileType,
  Info,
  Minus,
  PencilRuler,
  Play,
  StepForward,
  Trash,
  Wrench,
  X
} from 'lucide-react';
import { appWindow } from '@tauri-apps/api/window';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent
} from './ui/menubar';
import { Button } from './ui/button';
import { readText } from '@tauri-apps/api/clipboard';
import { clearGuide, setNewGuide } from '@/utilities/guide.utilities';
import { cn } from '@/lib/utils';
import { AppState, useAppStore } from '@/store/app.store';
import logo from '@/assets/icon.ico';
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
import { useEffect, useState } from 'react';
import { useGuideStore } from '@/store/guide.store';
import { Input } from './ui/input';
import { open } from '@tauri-apps/api/dialog';
import { getVersion } from '@tauri-apps/api/app';

export default function Navbar() {
  const { setAppState, setClientTxtPath } = useAppStore((state) => state);
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

  const handleSetClientTxt = async () => {
    const selection = await open({
      multiple: false,
      filters: [{ name: 'Text', extensions: ['txt'] }]
    });

    if (selection) {
      setClientTxtPath(selection[0]);
    }
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
              PoE Guides
            </MenubarTrigger>

            <MenubarContent>
              <MenubarItem asChild>
                <a
                  href='https://github.com/Kazte/path-of-levelling'
                  target='_blank'
                  rel='noreferrer'
                >
                  <Info size={16} className='mr-2' />
                  About PoE Guides
                </a>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleOnCopyFromClipboard}>
                <Clipboard size={16} className='mr-2' /> Load from Clipboard
              </MenubarItem>
              <MenubarItem onClick={handleSetClientTxt}>
                <FileType size={16} className='mr-2' /> Set Client.txt
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
                onClick={handleOnClose}
                className='data-[highlighted]:bg-destructive'
              >
                <X size={16} className='mr-2' />
                Quit
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <span
            className='text-sm opacity-40 select-none'
            data-tauri-drag-region
          >
            v{appVersion}
          </span>
        </div>
        <div className='flex flex-row gap-2 justify-center items-center'>
          <Button
            variant='secondary'
            onClick={handleOnStart}
            className={cn(
              'w-fit h-fit py-[2px] px-[4px]',
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
    </>
  );
}
