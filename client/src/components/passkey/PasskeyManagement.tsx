/**
 * Passkey Management Component
 * Allows users to register, view, and delete passkeys
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetPasskeysQuery, useDeletePasskeyMutation } from '@/services/api.service';
import { startRegistration, type PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser';
import { Fingerprint, Trash2, Smartphone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function PasskeyManagement() {
  const { data: passkeys, isLoading, refetch } = useGetPasskeysQuery();
  const [deletePasskey] = useDeletePasskeyMutation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [passkeyName, setPasskeyName] = useState('');

  const handleOpenNameDialog = () => {
    const defaultName = `Passkey ${(passkeys?.length || 0) + 1}`;
    setPasskeyName(defaultName);
    setShowNameDialog(true);
  };

  const handleRegisterPasskey = async () => {
    try {
      setIsRegistering(true);
      setShowNameDialog(false);

      // Get registration options from backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/passkeys/register-options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await (await import('@/lib/firebase')).auth.currentUser?.getIdToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get registration options');
      }

      const { data: options } = await response.json() as { data: PublicKeyCredentialCreationOptionsJSON };

      // Start WebAuthn registration
      const registrationResponse = await startRegistration({ optionsJSON: options });

      // Send registration response to backend
      const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/passkeys/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await (await import('@/lib/firebase')).auth.currentUser?.getIdToken()}`,
        },
        body: JSON.stringify({
          response: registrationResponse,
          name: passkeyName || `Passkey ${(passkeys?.length || 0) + 1}`,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Failed to verify passkey registration');
      }

      toast.success('Passkey registered successfully');
      setPasskeyName('');
      refetch();
    } catch (error: any) {
      console.error('Passkey registration error:', error);
      if (error.name === 'NotAllowedError') {
        toast.error('Passkey registration was cancelled');
      } else {
        toast.error(error.message || 'Failed to register passkey');
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDeletePasskey = async (id: string) => {
    try {
      await deletePasskey(id).unwrap();
      toast.success('Passkey removed successfully');
    } catch (error) {
      console.error('Delete passkey error:', error);
      toast.error('Failed to remove passkey');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Add button */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <p className="text-sm font-medium text-gray-900">Passkeys</p>
          <p className="text-xs text-gray-500 mt-0.5">Sign in quickly and securely with your device</p>
        </div>
        <Button
          onClick={handleOpenNameDialog}
          disabled={isRegistering}
          className="h-9 px-4 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg"
        >
          {isRegistering ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4 mr-2" />
              Add Passkey
            </>
          )}
        </Button>
      </div>

      {/* Passkey list */}
      {passkeys && passkeys.length > 0 ? (
        <div className="space-y-3">
          {passkeys.map((passkey) => (
            <div
              key={passkey.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  {passkey.deviceType === 'multiDevice' ? (
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Fingerprint className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{passkey.name || 'Passkey'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-500">
                      Created {format(new Date(passkey.createdAt), 'MMM d, yyyy')}
                    </p>
                    {passkey.lastUsedAt && (
                      <>
                        <span className="text-xs text-gray-300">•</span>
                        <p className="text-xs text-gray-500">
                          Last used {format(new Date(passkey.lastUsedAt), 'MMM d, yyyy')}
                        </p>
                      </>
                    )}
                    {passkey.backedUp && (
                      <>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                          Backed up
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeletePasskey(passkey.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 px-4 rounded-lg border border-dashed border-gray-300 bg-gray-50/50">
          <Fingerprint className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">No passkeys registered</p>
          <p className="text-xs text-gray-500 mb-4">
            Add a passkey to sign in quickly and securely without a password
          </p>
          <Button
            onClick={handleOpenNameDialog}
            disabled={isRegistering}
            size="sm"
            className="h-9 px-4 bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white rounded-lg"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4 mr-2" />
                Add Your First Passkey
              </>
            )}
          </Button>
        </div>
      )}

      {/* Name Dialog */}
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name Your Passkey</DialogTitle>
            <DialogDescription>
              Give your passkey a memorable name to help you identify this device later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={passkeyName}
              onChange={(e) => setPasskeyName(e.target.value)}
              placeholder="e.g., MacBook Pro, iPhone 15, etc."
              className="w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && passkeyName.trim()) {
                  handleRegisterPasskey();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNameDialog(false)}
              disabled={isRegistering}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegisterPasskey}
              disabled={isRegistering || !passkeyName.trim()}
              className="bg-gradient-to-r from-[#635bff] to-[#5045e5] hover:from-[#5045e5] hover:to-[#3d38d1] text-white"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Passkey'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
