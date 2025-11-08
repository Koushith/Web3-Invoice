import mongoose, { Document, Schema } from 'mongoose';
import type { AuthenticatorTransportFuture, CredentialDeviceType } from '@simplewebauthn/types';

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
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ organizationId: 1 });
UserSchema.index({ 'passkeys.credentialID': 1 });

export default mongoose.model<IUser>('User', UserSchema);
