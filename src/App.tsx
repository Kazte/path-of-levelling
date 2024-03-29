import { AppState, useAppStore } from './store/app.store';

import { RouterProvider } from 'react-router-dom';
import appStates from './states/app.state';
import router from './utilities/router';
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

  return <RouterProvider router={router} />;
}

export default App;
