import { HashRouter, Route, Routes } from 'react-router-dom';

import LayoutMapPage from './pages/layout-map.page';
import MainRoutes from './pages/main-routes';

function App() {
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
