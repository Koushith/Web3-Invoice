import mongoose, { Document, Schema } from 'mongoose';
import type { AuthenticatorTransportFuture, CredentialDeviceType } from '@simplewebauthn/server';

export interface IPasskey {
  id: string;
  credentialID: string; // base64url encoded
  credentialPublicKey: string; // base64url encoded
  counter: number;
  credentialDeviceType: CredentialDeviceType;
  credentialBackedUp: boolean;
  transports?: AuthenticatorTransportFuture[];
  name?: string; // User-friendly name for the passkey
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  organizationId?: mongoose.Types.ObjectId;
  role: 'owner' | 'admin' | 'accountant' | 'viewer';
  isActive: boolean;
  passkeys: IPasskey[];
  // Profile fields
  firstName?: string;
  lastName?: string;
  phone?: string;
  language?: string;
  jobTitle?: string;
  department?: string;
  bio?: string;
  city?: string;
  country?: string;
  timezone?: string;
  dateFormat?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    photoURL: {
      type: String,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'accountant', 'viewer'],
      default: 'owner',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passkeys: [
      {
        id: { type: String, required: true },
        credentialID: { type: String, required: true },
        credentialPublicKey: { type: String, required: true },
        counter: { type: Number, required: true, default: 0 },
        credentialDeviceType: { type: String, required: true },
        credentialBackedUp: { type: Boolean, required: true, default: false },
        transports: [{ type: String }],
        name: { type: String },
        createdAt: { type: Date, default: Date.now },
        lastUsedAt: { type: Date },
      },
    ],
    // Profile fields
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (email already indexed via unique: true)
UserSchema.index({ organizationId: 1 });
UserSchema.index({ 'passkeys.credentialID': 1 });

export default mongoose.model<IUser>('User', UserSchema);
