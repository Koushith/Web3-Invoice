/**
 * RTK Query API Service
 * Centralized API service with automatic token injection, error handling, and caching
 */

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { auth } from '@/lib/firebase';
import type {
  User,
  Invoice,
  Customer,
  Payment,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  CreateInvoiceDTO,
  UpdateInvoiceDTO,
  DashboardMetrics,
  Webhook,
  ApiKey,
  TeamMember,
  Passkey,
  Organization,
} from '@/types/models';

// ==================== Base Query Configuration ====================

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  prepareHeaders: async (headers) => {
    try {
      // Get Firebase ID token
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.error('[API] Failed to get auth token:', error);
    }

    // Set content type
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  },
  credentials: 'include',
});

// ==================== Enhanced Base Query with Retry ====================

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });

// ==================== Base Query with Re-auth ====================

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQueryWithRetry(args, api, extraOptions);

  // Handle 401 Unauthorized - attempt to refresh token
  if (result.error && result.error.status === 401) {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Force token refresh
        await currentUser.getIdToken(true);
        // Retry the original request
        result = await baseQueryWithRetry(args, api, extraOptions);
      }
    } catch (error) {
      console.error('[API] Token refresh failed:', error);
      // Dispatch logout action
      // api.dispatch(authSlice.actions.logout());
    }
  }

  return result;
};

// ==================== API Service ====================

export const apiService = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Invoice', 'Customer', 'Payment', 'Webhook', 'ApiKey', 'Team', 'Dashboard', 'Passkey', 'Organization'],
  endpoints: (builder) => ({
    // ==================== Auth Endpoints ====================

    getProfile: builder.query<User, void>({
      query: () => '/auth/me',
      transformResponse: (response: ApiResponse<User>) => response.data!,
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/auth/me',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<User>) => response.data!,
      invalidatesTags: ['User'],
    }),

    syncUser: builder.mutation<User, Partial<User> | void>({
      query: (data) => ({
        url: '/auth/sync',
        method: 'POST',
        body: data || {},
      }),
      transformResponse: (response: ApiResponse<User>) => response.data!,
      invalidatesTags: ['User'],
    }),

    deleteAccount: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/me',
        method: 'DELETE',
      }),
    }),

    // ==================== User Profile Endpoints ====================

    getUserProfile: builder.query<User, void>({
      query: () => '/users/profile/me',
      transformResponse: (response: ApiResponse<User>) => response.data!,
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/users/profile/me',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<User>) => response.data!,
      invalidatesTags: ['User'],
    }),

    // ==================== Invoice Endpoints ====================

    getInvoices: builder.query<PaginatedResponse<Invoice>, QueryParams>({
      query: (params) => ({
        url: '/invoices',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Invoice' as const, id })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),

    getInvoice: builder.query<Invoice, string>({
      query: (id) => `/invoices/${id}`,
      transformResponse: (response: ApiResponse<Invoice>) => response.data!,
      providesTags: (_result, _error, id) => [{ type: 'Invoice', id }],
    }),

    createInvoice: builder.mutation<Invoice, CreateInvoiceDTO>({
      query: (data) => ({
        url: '/invoices',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Invoice>) => response.data!,
      invalidatesTags: [{ type: 'Invoice', id: 'LIST' }, 'Dashboard'],
    }),

    updateInvoice: builder.mutation<Invoice, { id: string; data: UpdateInvoiceDTO }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Invoice>) => response.data!,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
        'Dashboard',
      ],
    }),

    deleteInvoice: builder.mutation<void, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
        'Dashboard',
      ],
    }),

    sendInvoice: builder.mutation<{ invoice: Invoice; publicUrl: string; emailSent: boolean }, string>({
      query: (id) => ({
        url: `/invoices/${id}/send`,
        method: 'POST',
      }),
      transformResponse: (response: ApiResponse<{ invoice: Invoice; publicUrl: string; emailSent: boolean }>) => response.data!,
      invalidatesTags: (_result, _error, id) => [{ type: 'Invoice', id }, { type: 'Invoice', id: 'LIST' }],
    }),

    markInvoiceAsPaid: builder.mutation<Invoice, {
      id: string;
      data: {
        amountPaid?: number;
        paymentMethod?: string;
        transactionReference?: string;
        paymentDate?: string;
        notes?: string;
      }
    }>({
      query: ({ id, data }) => ({
        url: `/invoices/${id}/mark-paid`,
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Invoice>) => response.data!,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Invoice', id },
        { type: 'Invoice', id: 'LIST' },
        'Dashboard',
      ],
    }),

    // ==================== Customer Endpoints ====================

    getCustomers: builder.query<PaginatedResponse<Customer>, QueryParams>({
      query: (params) => ({
        url: '/customers',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Customer' as const, id })),
              { type: 'Customer', id: 'LIST' },
            ]
          : [{ type: 'Customer', id: 'LIST' }],
    }),

    getCustomer: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      transformResponse: (response: ApiResponse<Customer>) => response.data!,
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }],
    }),

    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (data) => ({
        url: '/customers',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Customer>) => response.data!,
      invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
    }),

    updateCustomer: builder.mutation<Customer, { id: string; data: Partial<Customer> }>({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Customer>) => response.data!,
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Customer', id },
        { type: 'Customer', id: 'LIST' },
      ],
    }),

    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/customers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Customer', id },
        { type: 'Customer', id: 'LIST' },
      ],
    }),

    // ==================== Payment Endpoints ====================

    getPayments: builder.query<PaginatedResponse<Payment>, QueryParams>({
      query: (params) => ({
        url: '/payments',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Payment' as const, id })),
              { type: 'Payment', id: 'LIST' },
            ]
          : [{ type: 'Payment', id: 'LIST' }],
    }),

    getPayment: builder.query<Payment, string>({
      query: (id) => `/payments/${id}`,
      transformResponse: (response: ApiResponse<Payment>) => response.data!,
      providesTags: (_result, _error, id) => [{ type: 'Payment', id }],
    }),

    createPayment: builder.mutation<Payment, Partial<Payment>>({
      query: (data) => ({
        url: '/payments',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Payment>) => response.data!,
      invalidatesTags: [{ type: 'Payment', id: 'LIST' }, 'Dashboard', { type: 'Invoice' }],
    }),

    // ==================== Dashboard Endpoints ====================

    getDashboardMetrics: builder.query<DashboardMetrics, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/dashboard/metrics',
        params,
      }),
      transformResponse: (response: ApiResponse<DashboardMetrics>) => response.data!,
      providesTags: ['Dashboard'],
    }),

    getRevenueChart: builder.query<any, { period: 'week' | 'month' | 'year' }>({
      query: (params) => ({
        url: '/dashboard/revenue',
        params,
      }),
      transformResponse: (response: ApiResponse) => response.data!,
      providesTags: ['Dashboard'],
    }),

    // ==================== Webhook Endpoints ====================

    getWebhooks: builder.query<Webhook[], void>({
      query: () => '/webhooks',
      transformResponse: (response: ApiResponse<Webhook[]>) => response.data!,
      providesTags: ['Webhook'],
    }),

    createWebhook: builder.mutation<Webhook, Partial<Webhook>>({
      query: (data) => ({
        url: '/webhooks',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Webhook>) => response.data!,
      invalidatesTags: ['Webhook'],
    }),

    updateWebhook: builder.mutation<Webhook, { id: string; data: Partial<Webhook> }>({
      query: ({ id, data }) => ({
        url: `/webhooks/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Webhook>) => response.data!,
      invalidatesTags: ['Webhook'],
    }),

    deleteWebhook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/webhooks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Webhook'],
    }),

    // ==================== API Key Endpoints ====================

    getApiKeys: builder.query<ApiKey[], void>({
      query: () => '/api-keys',
      transformResponse: (response: ApiResponse<ApiKey[]>) => response.data!,
      providesTags: ['ApiKey'],
    }),

    createApiKey: builder.mutation<ApiKey, { name: string; permissions: string[] }>({
      query: (data) => ({
        url: '/api-keys',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<ApiKey>) => response.data!,
      invalidatesTags: ['ApiKey'],
    }),

    deleteApiKey: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api-keys/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ApiKey'],
    }),

    // ==================== Team Endpoints ====================

    getTeamMembers: builder.query<TeamMember[], void>({
      query: () => '/team',
      transformResponse: (response: ApiResponse<TeamMember[]>) => response.data!,
      providesTags: ['Team'],
    }),

    inviteTeamMember: builder.mutation<TeamMember, { email: string; role: string }>({
      query: (data) => ({
        url: '/team/invite',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: ApiResponse<TeamMember>) => response.data!,
      invalidatesTags: ['Team'],
    }),

    updateTeamMember: builder.mutation<TeamMember, { id: string; data: Partial<TeamMember> }>({
      query: ({ id, data }) => ({
        url: `/team/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<TeamMember>) => response.data!,
      invalidatesTags: ['Team'],
    }),

    removeTeamMember: builder.mutation<void, string>({
      query: (id) => ({
        url: `/team/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),

    // ==================== Passkey Endpoints ====================

    getPasskeys: builder.query<Passkey[], void>({
      query: () => '/passkeys',
      transformResponse: (response: ApiResponse<Passkey[]>) => response.data!,
      providesTags: ['Passkey'],
    }),

    deletePasskey: builder.mutation<void, string>({
      query: (id) => ({
        url: `/passkeys/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Passkey'],
    }),

    // ==================== Organization Endpoints ====================

    getOrganization: builder.query<Organization, void>({
      query: () => '/organization',
      transformResponse: (response: ApiResponse<Organization>) => response.data!,
      providesTags: ['Organization'],
    }),

    updateOrganization: builder.mutation<Organization, Partial<Organization>>({
      query: (data) => ({
        url: '/organization',
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: ApiResponse<Organization>) => response.data!,
      invalidatesTags: ['Organization'],
    }),
  }),
});

// ==================== Export Hooks ====================

export const {
  // Auth
  useGetProfileQuery,
  useUpdateProfileMutation,
  useSyncUserMutation,
  useDeleteAccountMutation,

  // User Profile
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,

  // Invoices
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useSendInvoiceMutation,
  useMarkInvoiceAsPaidMutation,

  // Customers
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,

  // Payments
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,

  // Dashboard
  useGetDashboardMetricsQuery,
  useGetRevenueChartQuery,

  // Webhooks
  useGetWebhooksQuery,
  useCreateWebhookMutation,
  useUpdateWebhookMutation,
  useDeleteWebhookMutation,

  // API Keys
  useGetApiKeysQuery,
  useCreateApiKeyMutation,
  useDeleteApiKeyMutation,

  // Team
  useGetTeamMembersQuery,
  useInviteTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useRemoveTeamMemberMutation,

  // Passkeys
  useGetPasskeysQuery,
  useDeletePasskeyMutation,

  // Organization
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} = apiService;

// ==================== Export Utilities ====================

export const {
  endpoints,
  reducerPath,
  reducer,
  middleware,
} = apiService;
