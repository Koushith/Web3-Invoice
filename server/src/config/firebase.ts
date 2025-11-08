// Load environment variables first
import './env.ts';

import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Construct service account from environment variables
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const auth = admin.auth();
export const firestore = admin.firestore();

// Export getter function for auth (for middleware compatibility)
export const getFirebaseAuth = () => admin.auth();

export default admin;
