// Common Types
export type PaymentMethod = 'stripe' | 'crypto' | 'bank_transfer' | 'cash' | 'check';
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'partial' | 'overdue' | 'cancelled';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'ETH' | 'USDC' | 'USDT';

export interface PaymentReference {
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  request_network_id?: string;
  blockchain_tx_hash?: string;
  blockchain_network?: string;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
}
