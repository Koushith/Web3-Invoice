import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { InvoicesPage, NewInvoice } from './screens';
import { HomePage } from './screens';

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
      // Add other routes here
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
