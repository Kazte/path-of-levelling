import MainPage from '@/pages/main.page';
import SettingsPage from '@/pages/settings.page';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  }
]);
export default router;
