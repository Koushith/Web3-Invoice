import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { InvoicesPage, NewInvoice } from './screens';
import { HomePage } from './screens';
import { Auth } from './screens/auth/Auth';
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/invoices',
        element: <InvoicesPage />,
      },
      {
        path: '/invoices/new',
        element: <NewInvoice />,
      },
      {
        path: '/auth',
        element: <Auth />,
      },
      // Add other routes here
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
