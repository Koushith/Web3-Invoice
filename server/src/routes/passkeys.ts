/**
 * Passkey Routes
 * WebAuthn/Passkey authentication endpoints
 */

import express, { Request, Response } from 'express';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import { isoBase64URL } from '@simplewebauthn/server/helpers';

const router = express.Router();

// Relying Party configuration
const RP_NAME = process.env.RP_NAME || 'DefInvoice';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:5174';

// Store challenges temporarily (in production, use Redis)
const challenges = new Map<string, string>();

/**
 * POST /api/passkeys/register-options
 * Generate passkey registration options
 */
router.post('/register-options', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userName: user.email,
      userDisplayName: user.displayName || user.email,
      attestationType: 'none',
      excludeCredentials: user.passkeys.map((passkey) => ({
        id: isoBase64URL.toBuffer(passkey.credentialID),
        transports: passkey.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    // Store challenge for verification
    challenges.set(userId, options.challenge);

    res.json({ success: true, data: options });
  } catch (error: any) {
    console.error('[Passkey Register Options] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/passkeys/register
 * Verify and save new passkey
 */
router.post('/register', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { response, name } = req.body as {
      response: RegistrationResponseJSON;
      name?: string;
    };

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const expectedChallenge = challenges.get(userId);
    if (!expectedChallenge) {
      return res.status(400).json({ success: false, message: 'Challenge not found' });
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ success: false, message: 'Verification failed' });
    }

    const { credential } = verification.registrationInfo;

    // Save passkey
    user.passkeys.push({
      id: crypto.randomUUID(),
      credentialID: isoBase64URL.fromBuffer(credential.id),
      credentialPublicKey: isoBase64URL.fromBuffer(credential.publicKey),
      counter: credential.counter,
      credentialDeviceType: credential.deviceType,
      credentialBackedUp: credential.backedUp,
      transports: response.response.transports,
      name: name || 'Passkey',
      createdAt: new Date(),
    });

    await user.save();

    // Clean up challenge
    challenges.delete(userId);

    res.json({
      success: true,
      data: {
        id: user.passkeys[user.passkeys.length - 1].id,
        name: user.passkeys[user.passkeys.length - 1].name,
      },
    });
  } catch (error: any) {
    console.error('[Passkey Register] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/passkeys/auth-options
 * Generate passkey authentication options
 */
router.post('/auth-options', async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.passkeys.length === 0) {
      return res.status(404).json({ success: false, message: 'No passkeys found for this user' });
    }

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: user.passkeys.map((passkey) => ({
        id: isoBase64URL.toBuffer(passkey.credentialID),
        transports: passkey.transports,
      })),
      userVerification: 'preferred',
    });

    // Store challenge with email as key (since user is not authenticated yet)
    challenges.set(`auth:${email.toLowerCase()}`, options.challenge);

    res.json({ success: true, data: options });
  } catch (error: any) {
    console.error('[Passkey Auth Options] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/passkeys/auth
 * Verify passkey authentication
 */
router.post('/auth', async (req: Request, res: Response) => {
  try {
    const { response, email } = req.body as {
      response: AuthenticationResponseJSON;
      email: string;
    };

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const expectedChallenge = challenges.get(`auth:${email.toLowerCase()}`);
    if (!expectedChallenge) {
      return res.status(400).json({ success: false, message: 'Challenge not found' });
    }

    // Find the passkey
    const passkey = user.passkeys.find(
      (p) => p.credentialID === isoBase64URL.fromBuffer(response.rawId)
    );

    if (!passkey) {
      return res.status(404).json({ success: false, message: 'Passkey not found' });
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: isoBase64URL.toBuffer(passkey.credentialID),
        publicKey: isoBase64URL.toBuffer(passkey.credentialPublicKey),
        counter: passkey.counter,
      },
    });

    if (!verification.verified) {
      return res.status(400).json({ success: false, message: 'Verification failed' });
    }

    // Update counter and last used
    passkey.counter = verification.authenticationInfo.newCounter;
    passkey.lastUsedAt = new Date();
    await user.save();

    // Clean up challenge
    challenges.delete(`auth:${email.toLowerCase()}`);

    // Return user data (frontend will sync with Firebase)
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          firebaseUid: user.firebaseUid,
        },
      },
    });
  } catch (error: any) {
    console.error('[Passkey Auth] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/passkeys
 * List user's passkeys
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Return sanitized passkey list (exclude sensitive data)
    const passkeys = user.passkeys.map((p) => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt,
      lastUsedAt: p.lastUsedAt,
      deviceType: p.credentialDeviceType,
      backedUp: p.credentialBackedUp,
    }));

    res.json({ success: true, data: passkeys });
  } catch (error: any) {
    console.error('[Passkey List] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/passkeys/:id
 * Remove a passkey
 */
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.uid;
    const passkeyId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const passkeyIndex = user.passkeys.findIndex((p) => p.id === passkeyId);
    if (passkeyIndex === -1) {
      return res.status(404).json({ success: false, message: 'Passkey not found' });
    }

    user.passkeys.splice(passkeyIndex, 1);
    await user.save();

    res.json({ success: true, message: 'Passkey removed' });
  } catch (error: any) {
    console.error('[Passkey Delete] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
