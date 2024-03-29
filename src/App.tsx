import { HashRouter, Route, Routes } from 'react-router-dom';

import MainPage from './pages/main.page';
import SettingsPage from './pages/settings.page';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/settings' element={<SettingsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
