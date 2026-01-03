import mongoose, { Document, Schema } from 'mongoose';
import { Address } from '../types';

export interface ICustomer extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: Address;
  taxId?: string;
  notes?: string;
  tags?: string[];
  preferredPaymentMethod?: string; // Preferred payment method
  walletAddress?: string; // For crypto payments
  invoiceSettings?: {
    prefix?: string; // Custom invoice prefix for this customer (e.g., "ACME")
    nextNumber?: number; // Next invoice number for this customer
  };
  totalInvoiced: number;
  totalPaid: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    taxId: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    preferredPaymentMethod: {
      type: String,
      enum: ['none', 'bank_transfer', 'credit_card', 'digital_currency', 'wire_transfer', 'check', 'ach', 'paypal'],
      trim: true,
    },
    walletAddress: {
      type: String, // Ethereum/crypto wallet
      trim: true,
    },
    invoiceSettings: {
      prefix: {
        type: String,
        trim: true,
        uppercase: true,
      },
      nextNumber: {
        type: Number,
        min: 1,
      },
    },
    totalInvoiced: {
      type: Number,
      default: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    customFields: [{
      label: String,
      value: String
    }],
  },
  {
    timestamps: true,
  }
);

// Compound indexes
// Partial unique index - only enforce uniqueness for active customers
CustomerSchema.index(
  { organizationId: 1, email: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);
CustomerSchema.index({ organizationId: 1, name: 1 });
CustomerSchema.index({ tags: 1 });

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
