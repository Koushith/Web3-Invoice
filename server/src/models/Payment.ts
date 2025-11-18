import mongoose, { Document, Schema } from 'mongoose';
import { PaymentMethod, PaymentReference } from '../types';

export interface IPayment extends Document {
  organizationId: mongoose.Types.ObjectId;
  invoiceId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentReference: PaymentReference;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string; // External transaction ID
  notes?: string;
  refundedAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['stripe', 'crypto', 'bank_transfer', 'cash', 'check'],
    },
    paymentReference: {
      stripe_payment_intent_id: String,
      stripe_charge_id: String,
      request_network_id: String,
      blockchain_tx_hash: String,
      blockchain_network: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    notes: {
      type: String,
    },
    refundedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    refundReason: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
PaymentSchema.index({ organizationId: 1, status: 1 });
PaymentSchema.index({ invoiceId: 1, status: 1 });
PaymentSchema.index({ customerId: 1 });
PaymentSchema.index({ 'paymentReference.stripe_payment_intent_id': 1 }, { sparse: true });
PaymentSchema.index({ 'paymentReference.request_network_id': 1 }, { sparse: true });
PaymentSchema.index({ 'paymentReference.blockchain_tx_hash': 1 }, { sparse: true });

// Pre-save hook to set processedAt for completed payments
PaymentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date();
  }
  next();
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
