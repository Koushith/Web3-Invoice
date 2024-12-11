import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { CustomersScreen, ErrorScreen, InvoicesPage, NewCustomerScreen, NewInvoice } from './screens';
import { HomePage } from './screens';
import { Auth } from './screens/auth/Auth';
const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/invoices',
        element: <InvoicesPage />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/invoices/new',
        element: <NewInvoice />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/auth',
        element: <Auth />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/customers',
        element: <CustomersScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/customers/new',
        element: <NewCustomerScreen />,
        errorElement: <ErrorScreen />,
      },
      // Add other routes here
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
