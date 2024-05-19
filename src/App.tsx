import { HashRouter, Route, Routes } from 'react-router-dom';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';

import LayoutMapPage from './pages/layout-map.page';
import MainRoutes from './pages/main-routes';
import { ToastAction } from './components/ui/toast';
import { relaunch } from '@tauri-apps/api/process';
import { useAppStore } from './store/app.store';
import { useEffect } from 'react';
import { useToast } from './components/ui/use-toast';

function App() {
  const { setNewUpdateAvailable } = useAppStore((state) => state);

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
    checkUpdate().then(({ shouldUpdate, manifest }) => {
      if (shouldUpdate) {
        if (!manifest) return;

        const { version } = manifest;

        setNewUpdateAvailable(true);

        toast({
          title: 'New update available',
          description: `Update ${version} \nThis program will restart automatically after the update is installed.`,
          action: (
            <ToastAction altText='Install' onClick={startInstall}>
              Install
            </ToastAction>
          )
        });
      } else {
        setNewUpdateAvailable(false);
      }
    });
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path='/*' element={<MainRoutes />} />

        <Route path='/layoutmap' element={<LayoutMapPage />} />
        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
