import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ErrorScreen, InvoicesPage, NewCustomerScreen, NewInvoice } from './screens';
import { Auth } from './screens/auth/Auth';
import { LoginScreen } from './screens/auth/Login';
import { SignupScreen } from './screens/auth/Signup';
import { ForgotPasswordScreen } from './screens/auth/ForgotPassword';
import { InvoiceDetailScreen } from './screens/invoice/InvoiceDetail';
import { CustomerDetailScreen } from './screens/customer/CustomerDetail';
import { PaymentsScreen } from './screens/payments/Payments';
import { ReportsScreen } from './screens/reports/Reports';
import { TeamScreen } from './screens/team/Team';
import { SettingsScreen } from './screens/settings/Settings';
import { ApiKeysScreen } from './screens/api-keys/ApiKeys';
import { WebhooksScreen } from './screens/webhooks/Webhooks';
import { ProfileScreen } from './screens/profile/Profile';
import { PasskeysScreen } from './screens/passkeys/Passkeys';
import { SecurityScreen } from './screens/security/Security';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { CustomersScreen } from './screens/customer/Customer';
import { useAppDispatch } from '@/store/store';
import { initializeAuth } from '@/store/slices/auth.slice';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <ErrorScreen />,
    children: [
      {
        path: '/',
        element: <ReportsScreen />,
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
        path: '/invoices/:id',
        element: <InvoiceDetailScreen />,
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
      {
        path: '/customers/:id',
        element: <CustomerDetailScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/payments',
        element: <PaymentsScreen />,
        errorElement: <ErrorScreen />,
      },

      {
        path: '/team',
        element: <TeamScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/settings',
        element: <SettingsScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/api-keys',
        element: <ApiKeysScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/webhooks',
        element: <WebhooksScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/profile',
        element: <ProfileScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/passkeys',
        element: <PasskeysScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/security',
        element: <SecurityScreen />,
        errorElement: <ErrorScreen />,
      },
      {
        path: '/auth',
        element: <Auth />,
        errorElement: <ErrorScreen />,
      },
    ],
  },
  // Auth routes without sidebar
  {
    path: '/login',
    element: <LoginScreen />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/signup',
    element: <SignupScreen />,
    errorElement: <ErrorScreen />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordScreen />,
    errorElement: <ErrorScreen />,
  },
]);

function App() {
  const dispatch = useAppDispatch();

  // Initialize auth once when app starts
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
