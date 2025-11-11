import { Button } from '@/components/ui/button';
import { PasskeyManagement } from '@/components/passkey/PasskeyManagement';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const PasskeysScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FEFFFE]">
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[28px] font-semibold text-gray-900">Passkeys</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm text-gray-600">Secure authentication</span>
          </div>
        </div>

        {/* Passkeys Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900">Your passkeys</h2>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Sign in securely with your biometrics, device PIN or hardware security key.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Passkeys are easy to set up and can also be used for two-step authentication. See{' '}
            <a href="#" className="text-primary hover:underline">
              supported browsers and devices
            </a>{' '}
            before using.
          </p>

          {/* Passkey Management Component */}
          <PasskeyManagement />
        </div>
      </div>
    </div>
  );
};
