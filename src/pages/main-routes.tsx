import { AppState, useAppStore } from '@/store/app.store';
import { Route, Routes } from 'react-router-dom';

import MainPage from './main.page';
import SettingsPage from './settings.page';
import appStates from '@/states/app.state';
import { useEffect } from 'react';
import useMachine from '@/hooks/useMachine';

export default function MainRoutes() {
  const { transition } = useMachine(appStates, 'normal');
  const appState = useAppStore((state) => state.appState);

  useEffect(() => {
    switch (appState) {
      case AppState.NORMAL:
        transition('normal');
        break;
      case AppState.IN_GAME:
        transition('in-game');
        break;
      case AppState.TEST:
        transition('test');

        break;
    }
  }, [appState]);

  return (
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/settings' element={<SettingsPage />} />
    </Routes>
  );
}
