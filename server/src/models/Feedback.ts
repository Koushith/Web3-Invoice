import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId?: mongoose.Types.ObjectId | null;
  organizationId?: mongoose.Types.ObjectId | null;
  type: 'bug' | 'feature' | 'feedback';
  title: string;
  description: string;
  status: 'open' | 'closed' | 'in_progress';
  upvotes: number;
  rating?: number; // 1-5 star rating (optional, only for feedback type)
  userEmail: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: false,
      index: true,
    },
    type: {
      type: String,
      enum: ['bug', 'feature', 'feedback'],
      required: true,
      default: 'feedback',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'in_progress'],
      default: 'open',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FeedbackSchema.index({ organizationId: 1, createdAt: -1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ type: 1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
