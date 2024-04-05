import { AppState, useAppStore } from './store/app.store';
import { HashRouter, Route, RouterProvider, Routes } from 'react-router-dom';

import MainPage from './pages/main.page';
import SettingsPage from './pages/settings.page';
import appStates from './states/app.state';
import { useEffect } from 'react';
import useMachine from './hooks/useMachine';

function App() {
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
    <HashRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/settings' element={<SettingsPage />} />

        <Route path='/layoutmap' element={<h1>Map Layout</h1>} />

        <Route path='*' element={<h1>404 Not Found</h1>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
