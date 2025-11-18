import mongoose, { Document, Schema } from 'mongoose';
import { Address } from '../types';

export interface IOrganization extends Document {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string; // Full logo (can be rectangular)
  icon?: string; // Square icon (1:1 aspect ratio)
  address?: Address;
  taxId?: string;
  currency: string;
  invoicePrefix: string;
  invoiceNumberSequence: number;
  ownerId: string; // Firebase UID
  settings: {
    defaultTaxRate?: number;
    defaultPaymentTerms?: number; // days
    emailNotifications: boolean;
    autoReminders: boolean;
  };
  stripe?: {
    accountId?: string;
    isConnected: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema: Schema = new Schema(
  {
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
    website: {
      type: String,
      trim: true,
    },
    logo: {
      type: String, // Full logo (can be rectangular)
    },
    icon: {
      type: String, // Square icon (1:1 aspect ratio)
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
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
    },
    invoicePrefix: {
      type: String,
      default: 'INV',
      uppercase: true,
    },
    invoiceNumberSequence: {
      type: Number,
      default: 1,
    },
    ownerId: {
      type: String, // Firebase UID
      required: true,
      index: true,
    },
    settings: {
      defaultTaxRate: {
        type: Number,
        min: 0,
        max: 100,
      },
      defaultPaymentTerms: {
        type: Number,
        default: 30,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      autoReminders: {
        type: Boolean,
        default: false,
      },
    },
    stripe: {
      accountId: String,
      isConnected: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (ownerId already indexed via index: true)
OrganizationSchema.index({ email: 1 });

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
