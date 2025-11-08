/**
 * Core Domain Models
 * Enterprise-grade TypeScript definitions for the application
 */

// ==================== Enums ====================

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superadmin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export enum AuthProvider {
  EMAIL = 'email',
  PASSWORD = 'password',
  GOOGLE = 'google.com',
  GITHUB = 'github.com',
  FACEBOOK = 'facebook.com',
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CRYPTO = 'crypto',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  ETH = 'ETH',
  BTC = 'BTC',
  USDC = 'USDC',
}

// ==================== Base Interfaces ====================

export interface BaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SoftDeletable {
  deletedAt?: Date | string | null;
  isDeleted?: boolean;
}

// ==================== User & Auth ====================

export interface User extends BaseEntity {
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  provider: AuthProvider;
  firebaseUid: string;
  organizationId?: string;
  organization?: Organization;
  emailVerified: boolean;
  phoneNumber?: string;
  metadata?: Record<string, any>;
  preferences?: UserPreferences;
  lastLoginAt?: Date | string;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  currency?: Currency;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  timezone?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials extends LoginCredentials {
  displayName: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ==================== Organization ====================

export interface Organization extends BaseEntity, SoftDeletable {
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  logo?: string;
  address?: Address;
  taxId?: string;
  settings?: OrganizationSettings;
  subscription?: Subscription;
  ownerId: string;
  memberCount?: number;
}

export interface OrganizationSettings {
  defaultCurrency?: Currency;
  defaultPaymentTerms?: number;
  invoicePrefix?: string;
  invoiceNumberStart?: number;
  branding?: {
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
  };
}

export interface Subscription {
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: Date | string;
  currentPeriodEnd: Date | string;
  cancelAtPeriodEnd: boolean;
}

// ==================== Customer ====================

export interface Customer extends BaseEntity, SoftDeletable {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  taxId?: string;
  address?: Address;
  walletAddress?: string;
  notes?: string;
  organizationId: string;
  metadata?: Record<string, any>;
  totalInvoices?: number;
  totalRevenue?: number;
  outstandingBalance?: number;
}

export interface Address {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// ==================== Invoice ====================

export interface Invoice extends BaseEntity, SoftDeletable {
  invoiceNumber: string;
  status: InvoiceStatus;
  customerId: string;
  customer?: Customer;
  organizationId: string;
  organization?: Organization;
  issueDate: Date | string;
  dueDate: Date | string;
  paidDate?: Date | string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  total: number;
  currency: Currency;
  notes?: string;
  terms?: string;
  paymentMethod?: PaymentMethod;
  requestNetworkId?: string;
  metadata?: Record<string, any>;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
  metadata?: Record<string, any>;
}

export interface CreateInvoiceDTO {
  customerId: string;
  issueDate: Date | string;
  dueDate: Date | string;
  items: Omit<InvoiceItem, 'id' | 'amount'>[];
  taxRate: number;
  discount?: number;
  discountType?: 'percentage' | 'fixed';
  currency: Currency;
  notes?: string;
  terms?: string;
}

export interface UpdateInvoiceDTO extends Partial<CreateInvoiceDTO> {
  status?: InvoiceStatus;
}

// ==================== Payment ====================

export interface Payment extends BaseEntity {
  invoiceId: string;
  invoice?: Invoice;
  customerId: string;
  customer?: Customer;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  stripePaymentIntentId?: string;
  requestNetworkId?: string;
  walletAddress?: string;
  txHash?: string;
  paidAt?: Date | string;
  metadata?: Record<string, any>;
  notes?: string;
}

// ==================== API Types ====================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// ==================== UI State ====================

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  notifications: Notification[];
  modals: {
    [key: string]: boolean;
  };
  loading: {
    [key: string]: boolean;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: Date | string;
  read: boolean;
}

// ==================== Analytics ====================

export interface DashboardMetrics {
  totalRevenue: number;
  totalInvoices: number;
  pendingPayments: number;
  overdueInvoices: number;
  revenueChange: number;
  invoiceChange: number;
  paymentChange: number;
  overdueChange: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  invoices: number;
}

export interface StatusDistribution {
  status: InvoiceStatus;
  count: number;
  percentage: number;
}

// ==================== Webhook ====================

export interface Webhook extends BaseEntity {
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  organizationId: string;
  lastTriggeredAt?: Date | string;
  failureCount: number;
}

export enum WebhookEvent {
  INVOICE_CREATED = 'invoice.created',
  INVOICE_PAID = 'invoice.paid',
  INVOICE_OVERDUE = 'invoice.overdue',
  PAYMENT_RECEIVED = 'payment.received',
  PAYMENT_FAILED = 'payment.failed',
  CUSTOMER_CREATED = 'customer.created',
  CUSTOMER_UPDATED = 'customer.updated',
}

// ==================== API Keys ====================

export interface ApiKey extends BaseEntity {
  name: string;
  key: string;
  prefix: string;
  lastUsedAt?: Date | string;
  expiresAt?: Date | string;
  organizationId: string;
  permissions: string[];
  active: boolean;
}

// ==================== Team ====================

export interface TeamMember extends BaseEntity {
  userId: string;
  user?: User;
  organizationId: string;
  role: TeamRole;
  permissions: Permission[];
  invitedAt: Date | string;
  joinedAt?: Date | string;
  invitedBy: string;
}

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum Permission {
  INVOICES_CREATE = 'invoices:create',
  INVOICES_READ = 'invoices:read',
  INVOICES_UPDATE = 'invoices:update',
  INVOICES_DELETE = 'invoices:delete',
  CUSTOMERS_CREATE = 'customers:create',
  CUSTOMERS_READ = 'customers:read',
  CUSTOMERS_UPDATE = 'customers:update',
  CUSTOMERS_DELETE = 'customers:delete',
  PAYMENTS_READ = 'payments:read',
  REPORTS_READ = 'reports:read',
  SETTINGS_UPDATE = 'settings:update',
  TEAM_MANAGE = 'team:manage',
}

// ==================== Form Types ====================

export interface FormState<T = any> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

// ==================== Export All ====================

export type ID = string;
export type Timestamp = Date | string;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
