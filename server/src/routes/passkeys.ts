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
  type RegistrationResponseJSON,
  type AuthenticationResponseJSON,
} from '@simplewebauthn/server';
import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { auth } from '../config/firebase.js';

const router = express.Router();

// Relying Party configuration
const RP_NAME = process.env.RP_NAME || 'DefInvoice';
const RP_ID = process.env.RP_ID || 'localhost';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

// Store challenges temporarily (in production, use Redis)
// Format: { challenge: string, timestamp: number }
const challenges = new Map<string, { challenge: string; timestamp: number }>();

// Clean up expired challenges (older than 5 minutes)
setInterval(() => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  for (const [key, value] of challenges.entries()) {
    if (now - value.timestamp > fiveMinutes) {
      challenges.delete(key);
    }
  }
}, 60 * 1000); // Run every minute

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
        id: passkey.credentialID, // Already a Base64URLString
        transports: passkey.transports,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    // Store challenge for verification
    challenges.set(userId, { challenge: options.challenge, timestamp: Date.now() });

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

    const challengeData = challenges.get(userId);
    if (!challengeData) {
      return res.status(400).json({ success: false, message: 'Challenge not found' });
    }

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challengeData.challenge,
      expectedOrigin: ALLOWED_ORIGINS,
      expectedRPID: RP_ID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ success: false, message: 'Verification failed' });
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

    // Save passkey
    user.passkeys.push({
      id: crypto.randomUUID(),
      credentialID: credential.id, // Already a Base64URLString
      credentialPublicKey: isoBase64URL.fromBuffer(credential.publicKey), // Convert Uint8Array to Base64URLString
      counter: credential.counter,
      credentialDeviceType: credentialDeviceType,
      credentialBackedUp: credentialBackedUp,
      transports: credential.transports,
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
 * Supports both username (email) and usernameless (discoverable) authentication
 */
router.post('/auth-options', async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email?: string };

    // Usernameless authentication (discoverable credentials)
    if (!email) {
      const options = await generateAuthenticationOptions({
        rpID: RP_ID,
        allowCredentials: [], // Empty array = show all passkeys on device
        userVerification: 'preferred',
      });

      // Store challenge with a temporary key
      challenges.set(`auth:usernameless:${options.challenge}`, {
        challenge: options.challenge,
        timestamp: Date.now(),
      });

      return res.json({ success: true, data: options });
    }

    // Traditional authentication with email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.passkeys.length === 0) {
      return res.status(404).json({ success: false, message: 'No passkeys found for this user' });
    }

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: user.passkeys.map((passkey) => ({
        id: passkey.credentialID, // Already a Base64URLString
        transports: passkey.transports,
      })),
      userVerification: 'preferred',
    });

    // Store challenge with email as key
    challenges.set(`auth:${email.toLowerCase()}`, {
      challenge: options.challenge,
      timestamp: Date.now(),
    });

    res.json({ success: true, data: options });
  } catch (error: any) {
    console.error('[Passkey Auth Options] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/passkeys/auth
 * Verify passkey authentication
 * Supports both email-based and usernameless (discoverable) authentication
 */
router.post('/auth', async (req: Request, res: Response) => {
  try {
    const { response, email } = req.body as {
      response: AuthenticationResponseJSON;
      email?: string;
    };

    let user;
    let expectedChallenge;
    let passkey;

    // Extract the challenge from the response
    const clientDataJSON = JSON.parse(Buffer.from(response.response.clientDataJSON, 'base64').toString('utf-8'));
    const challengeFromResponse = clientDataJSON.challenge;

    // Usernameless authentication - find user by credential ID
    if (!email) {
      // Find user with matching credential ID
      user = await User.findOne({
        'passkeys.credentialID': response.rawId,
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'Passkey not found' });
      }

      // Look up the exact challenge using the challenge from the response
      const challengeKey = `auth:usernameless:${challengeFromResponse}`;
      const challengeData = challenges.get(challengeKey);

      if (!challengeData) {
        return res.status(400).json({
          success: false,
          message: 'Challenge not found or expired. Please try signing in again.',
        });
      }

      expectedChallenge = challengeData.challenge;

      // Clean up challenge
      challenges.delete(challengeKey);

      // Find the specific passkey
      passkey = user.passkeys.find((p) => p.credentialID === response.rawId);
    } else {
      // Traditional email-based authentication
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const challengeData = challenges.get(`auth:${email.toLowerCase()}`);
      if (!challengeData) {
        return res.status(400).json({ success: false, message: 'Challenge not found' });
      }

      expectedChallenge = challengeData.challenge;

      // Find the passkey (response.rawId is already a Base64URLString)
      passkey = user.passkeys.find((p) => p.credentialID === response.rawId);
    }

    if (!passkey) {
      return res.status(404).json({ success: false, message: 'Passkey not found' });
    }

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: ALLOWED_ORIGINS,
      expectedRPID: RP_ID,
      credential: {
        id: passkey.credentialID, // Already a Base64URLString
        publicKey: isoBase64URL.toBuffer(passkey.credentialPublicKey), // Convert Base64URLString to Uint8Array
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

    // Clean up challenge (usernameless challenge already cleaned up above)
    if (email) {
      challenges.delete(`auth:${email.toLowerCase()}`);
    }

    // Generate Firebase custom token for authentication
    const customToken = await auth.createCustomToken(user.firebaseUid);

    // Return custom token for Firebase authentication
    res.json({
      success: true,
      data: {
        customToken,
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
