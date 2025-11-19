import mongoose, { Document, Schema } from 'mongoose';
import { InvoiceStatus, Currency, InvoiceLineItem } from '../types';

export interface IInvoice extends Document {
  organizationId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  currency: Currency;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  notes?: string;
  terms?: string;
  pdfUrl?: string;
  templateStyle?: string;
  metadata?: Record<string, any>;

  // Payment references
  allowedPaymentMethods: string[];
  stripePaymentIntentId?: string;
  requestNetworkId?: string;

  // Tracking
  sentAt?: Date;
  viewedAt?: Date;
  paidAt?: Date;
  remindersSent: number;
  lastReminderAt?: Date;

  // Public sharing
  publicId?: string;

  // Recurring
  isRecurring: boolean;
  recurringInterval?: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  recurringEndDate?: Date;
  parentInvoiceId?: mongoose.Types.ObjectId;

  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled'],
      default: 'sent',
      index: true,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
      uppercase: true,
    },
    lineItems: [{
      description: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      taxRate: {
        type: Number,
        min: 0,
        max: 100,
      },
    }],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    amountDue: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
    },
    terms: {
      type: String,
    },
    pdfUrl: {
      type: String,
    },
    templateStyle: {
      type: String,
      enum: ['standard', 'modern', 'minimal', 'artistic', 'gradient', 'glass', 'elegant', 'catty', 'floral', 'floraldark', 'panda', 'pinkminimal', 'compactpanda', 'cloudflare'],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    allowedPaymentMethods: [{
      type: String,
      enum: ['stripe', 'crypto', 'bank_transfer', 'cash', 'check'],
    }],
    stripePaymentIntentId: {
      type: String,
    },
    requestNetworkId: {
      type: String,
    },
    sentAt: {
      type: Date,
    },
    viewedAt: {
      type: Date,
    },
    paidAt: {
      type: Date,
    },
    remindersSent: {
      type: Number,
      default: 0,
    },
    lastReminderAt: {
      type: Date,
    },
    publicId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringInterval: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
    },
    recurringEndDate: {
      type: Date,
    },
    parentInvoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common queries
InvoiceSchema.index({ organizationId: 1, status: 1 });
InvoiceSchema.index({ organizationId: 1, customerId: 1 });
InvoiceSchema.index({ organizationId: 1, dueDate: 1 });
InvoiceSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });
InvoiceSchema.index({ requestNetworkId: 1 }, { sparse: true });

// Pre-save hook to calculate amounts
InvoiceSchema.pre('save', function(this: IInvoice, next) {
  if (this.isModified('lineItems') || this.isModified('taxRate')) {
    // Calculate subtotal
    this.subtotal = this.lineItems.reduce((sum: number, item: InvoiceLineItem) => sum + item.amount, 0);

    // Calculate tax
    this.taxAmount = (this.subtotal * this.taxRate) / 100;

    // Calculate total
    this.total = this.subtotal + this.taxAmount;

    // Calculate amount due
    this.amountDue = this.total - this.amountPaid;

    // Update status based on payment (but preserve 'draft' status)
    if (this.status !== 'draft') {
      if (this.amountPaid === 0) {
        if (this.status === 'paid' || this.status === 'partial') {
          this.status = 'sent';
        }
      } else if (this.amountPaid >= this.total) {
        this.status = 'paid';
        if (!this.paidAt) {
          this.paidAt = new Date();
        }
      } else if (this.amountPaid > 0 && this.amountPaid < this.total) {
        this.status = 'partial';
      }

      // Check for overdue (only if dueDate exists)
      if (this.dueDate && this.status !== 'paid' && this.status !== 'cancelled' && new Date() > this.dueDate) {
        this.status = 'overdue';
      }
    }
  }

  next();
});

// Pre-save hook to generate publicId
InvoiceSchema.pre('save', function(this: IInvoice, next) {
  if (this.isNew && !this.publicId) {
    // Generate a unique public ID (8 random alphanumeric characters)
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let publicId = '';
    for (let i = 0; i < 12; i++) {
      publicId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    this.publicId = publicId;
  }
  next();
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);
