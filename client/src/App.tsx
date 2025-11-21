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
import { EditCustomerScreen } from './screens/customer/EditCustomer';
import { PaymentsScreen } from './screens/payments/Payments';
import { PublicInvoiceScreen } from './screens/public/PublicInvoice';
import { ReportsScreen } from './screens/reports/Reports';
import { TeamScreen } from './screens/team/Team';
import { SettingsScreen } from './screens/settings/Settings';
import { ApiKeysScreen } from './screens/api-keys/ApiKeys';
import { WebhooksScreen } from './screens/webhooks/Webhooks';
import { ProfileScreen } from './screens/profile/Profile';
import { SecurityScreen } from './screens/security/Security';
import { BillingScreen } from './screens/billing/Billing';
import { BusinessScreen } from './screens/business/Business';
import { FeedbackScreen } from './screens/feedback/Feedback';
import { AboutScreen } from './screens/about/About';
import { IntegrationsScreen } from './screens/integrations/Integrations';
import { LandingPage } from './screens/landing/Landing';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Toaster } from 'sonner';
import { CustomersScreen } from './screens/customer/Customer';
import { useAppDispatch } from '@/store/store';
import { initializeAuth } from '@/store/slices/auth.slice';
import { analytics } from '@/lib/analytics';
import { auth } from '@/lib/firebase';

// Analytics Page View Tracker
// Note: Page views are tracked automatically on route changes
// This can be enhanced later with a custom component if needed

const router = createBrowserRouter([
  // Landing page - public route at root
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorScreen />,
  },
  // Fullscreen routes (no sidebar) - must be defined first for specific path matching
  {
    path: '/invoices/new',
    element: (
      <ProtectedRoute>
        <NewInvoice />
      </ProtectedRoute>
    ),
    errorElement: <ErrorScreen />,
  },
  {
    path: '/invoices/:id/edit',
    element: (
      <ProtectedRoute>
        <NewInvoice />
      </ProtectedRoute>
    ),
    errorElement: <ErrorScreen />,
  },
  // Main app routes with sidebar
  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <ErrorScreen />,
    children: [
      {
        path: '/dashboard',
        element: <ReportsScreen />,
      },
      {
        path: '/invoices',
        element: <InvoicesPage />,
      },
      {
        path: '/invoices/:id',
        element: <InvoiceDetailScreen />,
      },
      {
        path: '/customers',
        element: <CustomersScreen />,
      },
      {
        path: '/customers/new',
        element: <NewCustomerScreen />,
      },
      {
        path: '/customers/:id',
        element: <CustomerDetailScreen />,
      },
      {
        path: '/customers/:id/edit',
        element: <EditCustomerScreen />,
      },
      {
        path: '/transactions',
        element: <PaymentsScreen />,
      },
      {
        path: '/team',
        element: <TeamScreen />,
      },
      {
        path: '/settings',
        element: <SettingsScreen />,
      },
      {
        path: '/api-keys',
        element: <ApiKeysScreen />,
      },
      {
        path: '/webhooks',
        element: <WebhooksScreen />,
      },
      {
        path: '/integrations',
        element: <IntegrationsScreen />,
      },
      {
        path: '/profile',
        element: <ProfileScreen />,
      },
      {
        path: '/security',
        element: <SecurityScreen />,
      },
      {
        path: '/billing',
        element: <BillingScreen />,
      },
      {
        path: '/business',
        element: <BusinessScreen />,
      },
      {
        path: '/feedback',
        element: <FeedbackScreen />,
      },
      {
        path: '/about',
        element: <AboutScreen />,
      },
      {
        path: '/auth',
        element: <Auth />,
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
  // Public invoice view - no authentication required
  {
    path: '/invoice/:publicId',
    element: <PublicInvoiceScreen />,
    errorElement: <ErrorScreen />,
  },
]);

function App() {
  const dispatch = useAppDispatch();

  // Initialize auth once when app starts
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Track user when authenticated and page views on route changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        analytics.identify(user.uid, {
          email: user.email || undefined,
          displayName: user.displayName || undefined,
        });
      }
    });
    return unsubscribe;
  }, []);

  // Track page views on navigation
  useEffect(() => {
    // Track initial page view
    analytics.pageView(window.location.pathname + window.location.search);

    // Listen for route changes
    const handleRouteChange = () => {
      analytics.pageView(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
